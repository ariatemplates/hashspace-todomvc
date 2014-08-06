[![Build Status](https://secure.travis-ci.org/ariatemplates/hashspace-todomvc.png)](http://travis-ci.org/ariatemplates/hashspace-todomvc)

# Hashspace TodoMVC

The directory structure of this repository is equivalent to the official TodoMVC repository, to allow easier merging
once the application is ready.

This _README_ is implementor-centered.

Go to `architecture-examples/hashspace` to read more about Hashspace TodoMVC.

Important note: the `browser-tests` folder was taken from https://github.com/tastejs/todomvc/tree/gh-pages/browser-tests
and no files in that folder should be modified in this repository (other than syncing with the todomvc repository).

## TodoMVC reference Links

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


## Running the tests with PhantomJS and a temporary webserver on port 8000

```bash
node test
```

This is what is run on Travis CI: a throwaway server is established on port 8000, and mocha suite
is invoked via grunt task defined in `browser-tests/gruntfile.js`.

## Running the tests with long-lived server and configurable browser from command line:

```bash
# in first shell window
cd /
npm install -g http-server
http-server -p 8000

# in second shell window
npm install -g mocha
cd browser-tests && npm install && cd -
./test-phantom
```

To run with PhantomJS, install `phantomjs` on your machine and make it visible in `PATH`.
Then run `./test-phantom`.

To run with Chrome, install [chromedriver 2.9](http://chromedriver.storage.googleapis.com/2.9/chromedriver_win32.zip) and make the
  executable visible in your `PATH`.
Then run `./test-chrome`.

## Running just one test (development mode)

```bash
mocha allTests.js --no-timeouts --reporter spec --browser=phantomjs --grep "should trim text input"
```

## Running the application in the browser

```bash
npm install -g http-server
http-server -p 8080
```

Go to http://localhost:8080/ in the browser

Also once you push to `gh-pages` in your fork, after a few minutes a URL like below should work:

http://jakub-g.github.io/hashspace-todomvc/

## TODO

- routing
- local storage
- some code style refactoring (tabulations not spaces, apostrophes in JS vs. quotes in HTML, components in separate files)

## Current status of the test suite

```bash
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
     √ should display the number of completed items
     √ should remove completed items when clicked
     √ should be hidden when there are no items that are completed
   Routing
     √ should allow me to display active items (714ms)
     11) should respect the back button
     √ should allow me to display completed items (750ms)
     √ should allow me to display all items (1081ms)
     √ should highlight the currently applied filter (1028ms)


 27 passing (2m)
 1 failing
```
