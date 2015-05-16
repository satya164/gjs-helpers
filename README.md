# GNOME JavaScript helpers

These helper modules are made to make working with GJS easier. Especially when you're coming from a `node` environment.

Currently these include,
* `Promise` implementation based on the [ES6 spec](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise).
* Polyfill for `setTimeout` and `setInterval`.
* Promise based library for working with files.

## Usage

Since I'm not aware of any good module architecture for GJS, you've to manually copy the files to your project directory and use them. Which means you'll miss on updates.

First you'll need to add the current directory to search path.
```javascript
imports.searchPath.unshift(".");
```

Then, say you want to use the `Promise` library, place the `promise.js` file in the same directory and import it,
```javascript
const Promise = imports.promise.Promise;
```

Now you have access to the `Promise` object for use.
```javascript
let promise = new Promise((resolve, reject) => {
    let file = Gio.File.new_for_path("/tmp/new_dir");

    file.make_directory_async(GLib.PRIORITY_DEFAULT, null, (source, res) => {
        resolve(source.make_directory_finish(res));
    });
});
```

## Running tests

Tests are written using a custom tool (included as `litmus.js` in the repo). To run tests, simply `cd` into the `src`
 directory and run the intended test file.
```sh
cd src
gjs promise-test.js
```
