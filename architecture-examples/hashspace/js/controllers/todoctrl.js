
/*
 * Copyright 2014 Amadeus s.a.s.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *	http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function () {
	'use strict';

	var ESCAPE_KEY = 27;
	var LOCALSTORAGE_KEY = 'todos-hashspace';

	function trim(str) {
		return str.replace(/^\s+|\s+$/g, '');
	};



	// Parts of this code has been copied from the angular MVC controller at
	// https://github.com/addyosmani/todomvc/blob/gh-pages/architecture-examples/angularjs/js/controllers/todoCtrl.js
	var klass = require("hsp/klass");

	/**
	 * Main Todo Controller
	 */
	var TodoCtrl = klass({
		/**
		 * Object constructor: initialization of the data model.
		 */
		$constructor : function () {
			// todo structure used to create a new todo
			this.newTodo = {title : ""};

			// todo used for the edition so that canceling edition change the initial todo
			this.editTodo = {title : ""};

			this.allChecked = false; // tells if all tasks are checked (cf. syncData)
			this.remainingCount = 0; // number of remaining tasks (cf. syncData)
			this.doneCount = 0; // number of items done (cf. syncData)

			// todo list - empty by default
			// item: {title: "task text", completed: false, editMode: false}
			this.todos = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)) || [];

			// recompute data after reading from local storage
			this.syncData();
		},

		/**
		 * Synchronize bound data in the data structure Could be called by observers - but would require one observer per
		 * todo item (not worth in this case - as using observers in the controller can then easily lead to infinite
		 * loops..)
		 */
		syncData : function () {
			var doneCount = 0;
			var todos = this.todos;

			var index, size, todo;
			for (index = 0, size = todos.length; index < size; index++) {
				todo = todos[index];

				if (todo.completed)
					doneCount++;
			}

			this.doneCount = doneCount;
			this.remainingCount = size - doneCount;
			this.allChecked = (doneCount === size);

			localStorage.setItem(LOCALSTORAGE_KEY, this.serialize(this.todos));
		},

		/**
		 * Removes metadata from data model and returns stringified JSON representation of it
		 */
		serialize : function (model) {
			var newModel = [];
			// First clone the object, removing metadata (with keys starting with "+")
			// Also, get rid of 'editMode' from the model. Then serialize that
			// TODO reimplement it in a better way once https://github.com/ariatemplates/hashspace/issues/238 is fixed
			for (var i = 0; i < model.length; i++) {
				var entry = model[i];
				var newEntry = {};
				for (var key in entry) {
					if (key.charAt(0) != '+' && key != 'editMode') {
						newEntry[key] = entry[key];
					}
				}
				newModel.push(newEntry);
			}
			return JSON.stringify(newModel);
		},

		/**
		 * Add a new todo item from the newTodo structure in the data set.
		 */
		addTodo : function () {
			this.doneEditingAll();

			var newTodo = this.newTodo;

			// ignore empty entries
			var trimmedTitle = trim(newTodo.title);

			if (trimmedTitle.length > 0) {
				// put new todo at the end of the list
				this.todos.push({
					title : trimmedTitle,
					completed : false,
					editMode : false
				});
				newTodo.title  = "";
				this.syncData();
			}

			return false; // to prevent default behavior
		},

		/**
		 * Activate the edit mode for the current todo item and copies the todo values in the editTodo structure.
		 */
		edit : function (todo) {
			this.doneEditingAll();
			todo.editMode = true;
			this.editTodo.title = todo.title;
		},

		/**
		 * Remove a todo item from the todo list.
		 */
		remove : function (todo) {
			var index = this.todos.indexOf(todo);
			this.todos.splice(index, 1);
			this.syncData();
		},

		/**
		 * Copy the value of the editTodo in the currently edited todo and remove the editMode flag.
		 */
		doneEditing : function (todo) {
			if (!this.editTodo.title) {
				this.remove(todo); // remove todo if title is empty
			} else {
				todo.title = trim(this.editTodo.title);
				todo.editMode = false;
			}
			return false;
		},

		/**
		 * Undo editing when user hits ESC on keyboard.
		 */
		todoEditKeydown : function (event, todo) {
			if (event.keyCode === ESCAPE_KEY) {
				todo.editMode = false;
			}
		},

		/**
		 * Automatically close all todo in that may be in edit mode.
		 */
		doneEditingAll : function() {
			// cancel current edit if any
			var todos, index, length, todo;
			todos = this.todos;
			for (index = 0, length = todos.length; index < length; index++) {
				todo = todos[index];

				if (todo.editMode) {
					this.doneEditing(todo);
				}
			}
		},

		/**
		 * Cancel the edition for a todo a keeps the previous value.
		 */
		cancelEditing : function (todo) {
			this.editTodo.title = "";
			todo.editMode = false;
		},

		/**
		 * Remove all the completed todos from the todo list.
		 */
		clearDoneTodos : function () {
			this.todos = this.todos.filter(function (val) {
				return !(val.completed);
			});
			this.syncData();
		},

		/**
		 * Toggle all todo items' completed state.
		 */
		toggleAllDone : function () {
			var newState = this.allChecked;
			var todos, index, length, todo;

			todos = this.todos;
			for (index = 0, length = todos.length; index < length; index++) {
				todo = todos[index];

				todo.completed = newState;
			}

			this.syncData();
		}

	});



	var director = require("libs/director");

	/**
	 * Filter specifications for the list of todos.
	 */
	var Filter = klass({
		$constructor : function (names) {
			this.names = names;
		},

		match : function (name) {
			var names, index, length;

			names = this.names
			for (index = 0, length = names.length; index < length; index++) {
				if (names[index] === name) {
					return true;
				}
			}

			return false;
		}
	});

	/**
	 * UI Module Controller - dealing with the filter part and managing the template display.
	 */
	exports.TodoUICtrl = klass({
		$extends : TodoCtrl,

		/**
		 * Create a new panel object.
		 *
		 * @param {DOMElement} DOMElt A HTML DOM element where the panel should be displayed (optional).
		 */
		$constructor : function (DOMElt) {
			// call super constructor
			TodoCtrl.$constructor.call(this);
			// add ui-items to the data model

			// ------------------------------------------------------- filtering

			var filtersSpecs, filters, filtersMap;
			var index, length;
			var filter;

			filtersSpecs = [
				['all', ''],
				['active'],
				['completed', '!']
			];
			filters = [];
			filtersMap = {};

			for (index = 0, length = filtersSpecs.length; index < length; index++) {
				filter = new Filter(filtersSpecs[index]);
				filters.push(filter);
				filtersMap[filter.names[0]] = filter;
			}

			this.filters = filters;
			this.filtersMap = filtersMap;

			this.router = director.Router({
			    '/': this.selectFilter.bind(this, 'all'),
			    '/!': this.selectFilter.bind(this, 'completed'),
			    '/:filter': this.selectFilter.bind(this)
			}).init('/all');

			this.filter = this.filtersMap['all'];
		},

		/**
		 * Tells if a todo item should be displayed based on the current UI filter.
		 */
		isInFilter : function (todo, filter) {
			if (filter === this.filtersMap['active'] && todo.completed)
				return false;

			if (filter === this.filtersMap['completed'] && !todo.completed)
				return false;

			return true;
		},

		/**
		 * Select a new filter.
		 */
		selectFilter : function (filterName) {
			var filter;

			filter = this.filtersMap[filterName];
			if (filter != null) {
				this.filter = filter;
			}
		}
	});
})();
