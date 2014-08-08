Hashspace TodoMVC minified build
================================

This folder contains a Gulp script to preprocess Hashspace templates and controllers
to achieve better performance, and the output of that build (in `js` folder).

To perform the preprocessing, run the following commands:

```bash
npm install -g gulp
npm install
gulp
```

Then the processed files will be output to `js` folder and you can start the server at the root
of this repo and navigate to `http://localhost:8080/architecture-examples/hashspace/index-min.html`