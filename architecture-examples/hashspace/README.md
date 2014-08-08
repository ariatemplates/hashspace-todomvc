# Hashspace TodoMVC Example

> Hashspace is a powerful and lightweight JavaScript template engine that focuses on simplicity and efficiency.

> It is free and open-source.

> _[hashspace.ariatemplates.com](http://hashspace.ariatemplates.com/)_


## Learning Hashspace

The [hashspace website](http://hashspace.ariatemplates.com/) is a great resource for getting started.

Here are some links you may find helpful:

* [Getting started with Hashspace](http://hashspace.ariatemplates.com/start/)
* [API Reference](http://hashspace.ariatemplates.com/api/)
* [Playground](http://hashspace.ariatemplates.com/playground/)
* [hashspace on GitHub](https://github.com/ariatemplates/hashspace/)


## Implementation

// TODO How is the app structured? Are there deviations from the spec? If so, why?


## Running

To run the app, you need to start an HTTP server **in the root of this repository**. For instance:

    cd ../../
    npm install -g http-server
    http-server -p 8080

Then you can navigate to the development version of the application:

    http://localhost:8080/architecture-examples/hashspace

It's possible to build the minified version of the application:

    cd min
    npm install
    npm install -g gulp@3.8
    gulp

Once you start the server, you can navigate to the minified version of the application:

    http://localhost:8080/architecture-examples/hashspace/min

## Credit

This TodoMVC application was created by [Hashspace team](https://github.com/ariatemplates/hashspace/).
