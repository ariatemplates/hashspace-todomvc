[![Build Status](https://secure.travis-ci.org/ariatemplates/hashspace-todomvc.png)](http://travis-ci.org/ariatemplates/hashspace-todomvc)

# Hashspace TodoMVC

Implementation of [TodoMVC](http://todomvc.com) in [Hashspace](http://hashspace.ariatemplates.com)

This _README_ is implementor-centered.

Go to `architecture-examples/hashspace/README.md` to read more about Hashspace TodoMVC from user's perspective.

## Preview URLs

- [Hashspace-TodoMVC with in-browser compilation](http://ariatemplates.github.io/hashspace-todomvc/architecture-examples/hashspace)
- [Hashspace-TodoMVC using precompiled templates](http://ariatemplates.github.io/hashspace-todomvc/architecture-examples/hashspace-min)

# Structure

The directory structure of this repository is equivalent to the official TodoMVC repository, to allow easier merging
once the application is ready.

*Important note*: the `browser-tests` folder was taken from `https://github.com/tastejs/todomvc/tree/gh-pages/browser-tests`
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

## Deployment

The `master` branch on GitHub contains the source files only (not precompiled).

A minified version is built automatically during Travis build by running the `gulp` build inside `min` folder. This consists of the following steps:

- compiling `hsp` and `js` files with hashspace-gulp
- replacing noder, its dependencies and config in `index.html`
- the built versions of files are output to `../hashspace-min` folder
- TodoMVC test suite is run on both hashspace and hashspace-min versions
- If the build is green, both versions are deployed to `gh-pages` branch

