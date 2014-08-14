
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
	// https://github.com/tastejs/todomvc/blob/gh-pages/architecture-examples/angularjs/js/controllers/todoCtrl.js
	var klass = require('hsp/klass');

	/**
	 * Main Todo Controller
	 */
	var TodoCtrl = klass({
		/**
		 * Object constructor: initialization of the data model.
		 */
		$constructor : function () {
			// todo structure used to create a new todo
			this.newTodo = {title : ''};

			// todo used for the edition so that canceling edition change the initial todo
			this.editTodo = {title : ''};

			// number of items done and remaining. See this.syncData
			this.allChecked = false;
			this.remainingCount = 0;
			this.doneCount = 0;

			// FIXME hack for PhantomJS (since it's impossible to disable local storage or run a new profile each time)
			// https://github.com/ariya/phantomjs/issues/11055
			if (window.callPhantom) {
				localStorage.clear();
			}

			// todo list - empty by default
			// sample item: {title: 'task text', completed: false, editMode: false}
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
			var todos = this.todos;

			var allCount = this.todos.length;
			var doneCount = 0;
			this.todos.forEach(function (todo) {
				if(todo.completed) {
					doneCount++;
				}
			});

			this.doneCount = doneCount;
			this.remainingCount = allCount - doneCount;
			this.allChecked = (doneCount === allCount);

			this.updateLocalStorage();
		},

		updateLocalStorage : function () {
			localStorage.setItem(LOCALSTORAGE_KEY, this.serialize(this.todos));
		},

		/**
		 * Removes metadata from data model and returns stringified JSON representation of it
		 */
		serialize : function (model) {
			// First clone the object, removing metadata (with keys starting with '+')
			// Also, get rid of 'editMode' from the model. Then serialize that
			// FIXME reimplement it in a better way once https://github.com/ariatemplates/hashspace/issues/238 is fixed
			var newModel = model.map(function (entry) {
				var newEntry = {};
				for (var key in entry) {
					if (key.charAt(0) != '+' && key != 'editMode') {
						newEntry[key] = entry[key];
					}
				}
				return newEntry;
			});
			return JSON.stringify(newModel);
		},

		/**
		 * Add a new todo item from the newTodo structure in the data set.
		 */
		addTodo : function () {
			this.doneEditingAll();

			var newTodo = this.newTodo;

			// put new todo at the end of the list; ignore empty entries
			var trimmedTitle = trim(newTodo.title);
			if (trimmedTitle.length > 0) {

				this.todos.push({
					title : trimmedTitle,
					completed : false,
					editMode : false
				});
				newTodo.title  = '';
				this.syncData();
			}

			// prevent default behavior (form submit)
			return false;
		},

		/**
		 * Activate the edit mode for the current todo item and copies the todo values in the editTodo structure.
		 */
		edit : function (todo) {
			this.doneEditingAll();
			todo.editMode = true;
			this.editTodo.title = todo.title;

			// FIXME find a better way to put the focus into the active todo
			setTimeout(function () {
				var activeTodo = document.getElementById('active-todo');
				if (activeTodo) {
					activeTodo.focus();
				}
			}, 20);
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
				this.updateLocalStorage();
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
			this.todos.forEach(function (todo) {
				if (todo.editMode) {
					this.doneEditing(todo);
				}
			}, this);
		},

		/**
		 * Cancel the edition for a todo a keeps the previous value.
		 */
		cancelEditing : function (todo) {
			this.editTodo.title = '';
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
			this.todos.forEach(function (todo) {
				todo.completed = this.allChecked;
			}, this);
			this.syncData();
		}

	});



	var director = require('libs/director');

	/**
	 * Filter specifications for the list of todos.
	 */
	var Filter = klass({
		$constructor : function (names) {
			this.names = names;
		},

		/**
		 * Returns true when `testedFilter` matches one of the name in `this.names`.
		 * @param {String} testedFilter
		 * @return {Boolean}
		 */
		matches : function (testedFilter) {
			return this.names.some(function (filterName) {
				return filterName === testedFilter;
			});
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
			TodoCtrl.$constructor.call(this);

			var filtersSpecs = [
				['all', ''],
				['active'],
				['completed', '!']
			];

			this.filters = filtersSpecs.map(function (spec) {
				return new Filter(spec);
			});

			var filtersMap = {};
			this.filters.forEach(function (filter) {
				filtersMap[filter.names[0]] = filter;
			});
			this.filtersMap = filtersMap;

			// restore filter state from URL if possible, default to 'all'
			var initFilterName = location.hash.slice(2) || 'all'; // omit leading '#/'
			this.router = director.Router({
			    '/': this.selectFilter.bind(this, 'all'),
			    '/!': this.selectFilter.bind(this, 'completed'),
			    '/:filter': this.selectFilter.bind(this)
			}).init('/' + initFilterName);

			this.selectFilter(initFilterName);
		},

		/**
		 * Tells if a todo item should be displayed based on the current UI filter.
		 */
		isInFilter : function (todo, filter) {
			if (filter === this.filtersMap['active'] && todo.completed) {
				return false;
			}

			if (filter === this.filtersMap['completed'] && !todo.completed) {
				return false;
			}

			return true;
		},

		/**
		 * Select a new filter.
		 */
		selectFilter : function (filterName) {
			var filter = this.filtersMap[filterName];
			if (filter != null) {
				this.filter = filter;
			}
		}
	});
})();
