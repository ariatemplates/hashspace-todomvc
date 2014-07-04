Hashspace TodoMVC
=================

The directory structure of this repo is equivalent to the official TodoMVC repo, to allow easier merging
once the app is ready.

Go to `architecture-examples/hashspace` to read more about Hashspace TodoMVC.

TodoMVC reference Links
=======================

App Spec:
> https://github.com/tastejs/todomvc/blob/gh-pages/app-spec.md

Contributing:
> https://github.com/tastejs/todomvc/blob/gh-pages/contributing.md

Code style:
> https://github.com/tastejs/todomvc/blob/gh-pages/codestyle.md

Browser tests:
> https://github.com/tastejs/todomvc/tree/gh-pages/browser-tests

Backbone sample app:
> https://github.com/tastejs/todomvc/tree/gh-pages/architecture-examples/backbone


Running the tests
=================

    # in first shell window
    cd /
    npm install -g http-server
    http-server -p 8000

    # in second shell window
    cd browser-tests
    npm install -g mocha
    mocha allTests.js  --reporter spec --browser=phantomjs

(supposing you have phantomjs in `PATH` already)

Running just one test (dev mode)
================================

    mocha allTests.js  --reporter spec --browser=phantomjs --grep "should trim text input"


Running the app in the browser
==============================

    http-server -p 8080

Go to http://localhost:8080/ in the browser

Also once you push to `gh-pages` in your fork, after a few minutes a URL like below should work:

http://jakub-g.github.io/hashspace-todomvc/

Current status of tests
=======================

     TodoMVC - hashspace
       No Todos
         √ should hide #main and #footer (334ms)
       New Todo
         √ should allow me to add todo items (531ms)
         √ should clear text input field when an item is added (219ms)
         √ should append new items to the bottom of the list
         √ should trim text input
         √ should show #main and #footer when items added (401ms)
       Mark all as completed
         √ should allow me to mark all items as completed
         √ should allow me to clear the completion state of all items
         √ complete all checkbox should update state when items are completed / cleared
       Item
         √ should allow me to mark items as complete (890ms)
         √ should allow me to un-mark items as complete (934ms)
         √ should allow me to edit an item (877ms)
         √ should show the remove button on hover
       Editing
         √ should hide other controls when editing (638ms)
         √ should save edits on enter (906ms)
         √ should save edits on blur (1027ms)
         √ should trim entered text
         √ should remove the item if an empty text string was entered (814ms)
         √ should cancel edits on escape
       Counter
         √ should display the current number of todo items (364ms)
       Clear completed button
         8) should display the number of completed items
         9) should remove completed items when clicked
         10) should be hidden when there are no items that are completed
       Routing
         √ should allow me to display active items (714ms)
         11) should respect the back button
         √ should allow me to display completed items (750ms)
         √ should allow me to display all items (1081ms)
         √ should highlight the currently applied filter (1028ms)


     21 passing (2m)
     7 failing
