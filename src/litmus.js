const GLib = imports.gi.GLib;

let count = 0;

function Assert(desc, index) {
    this.desc = desc;
    this.index = index;
}

Assert.prototype.ok = function(actual, msg) {
    let title = this.index + ". " + this.desc;

    if (actual) {
        title = "✔ passed : " + title;
    } else {
        title = "❌ failed : " + title + (msg ? " : " + msg : "");
    }

    print("    " + title);
}

Assert.prototype.equal = function(actual, expected, msg) {
    this.ok((actual === expected), msg);
}

Assert.prototype.notEqual = function(actual, expected, msg) {
    this.ok((actual !== expected), msg);
}

Assert.prototype.throws = function(func, msg) {
    let thrown = false;

    try {
        func()
    } catch (e) {
        thrown = true;
    }

    this.ok(thrown, msg);
}

Assert.prototype.doesNotThrow = function(func, msg) {
    let thrown = false;

    try {
        func()
    } catch (e) {
        thrown = true;
    }

    this.ok(!thrown, msg);
}

function it(desc, callback) {
    count++;

    // Assume async only if callback is receiving more than 1 argument
    let loop = callback.length > 1 ? new GLib.MainLoop(null, false) : null;

    callback(new Assert(desc, count), () => {
        if (loop) {
            loop.quit();
        }
    });

    if (loop) {
        loop.run();
    }
}

function describe(desc, callback) {
    count = 0;

    print("  " + desc + " :");

    callback();
}
