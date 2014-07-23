
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
			this.remainingCount = 1; // number of remaining tasks (cf. syncData)
			this.doneCount = 0; // number of items done (cf. syncData)
			this.todos = [ // todo list - empty by default
				// sample item: {title: "task text", completed: false, editMode: false}
			];
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
			var index, length, todo;
			for (index = 0, length = this.todos.length; index < length; index++) {
				todo = this.todos[index];

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
			var todos = this.todos;

			var index, length, todo;
			for (index = 0, length = todos.length; index < length; index++) {
				todo = todos[index];

				todo.completed = newState;
			}

			this.syncData();
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
			this.filter = "all"; // possible values: "all", "active", "completed"
		},

		/**
		 * Tells if a todo item should be displayed based on the current UI filter.
		 */
		isInFilter : function (todo, filter) {
			var filter = this.filter;

			if (filter === "active" && todo.completed)
				return false;

			if (filter === "completed" && !todo.completed)
				return false;

			return true;
		},

		/**
		 * Select a new filter.
		 */
		selectFilter : function (filter) {
			if (filter === "all" || filter === "active" || filter === "completed") {
				this.filter = filter;
			}
		}
	});
})();
