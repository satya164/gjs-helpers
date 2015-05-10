const GLib = imports.gi.GLib;

let index = 0;

function assert(value, err) {
    let msg = this.index + ". " + this.desc;

    if (value) {
        msg = "✔ passed : " + msg;
    } else {
        msg = "❌ failed : " + msg + (err ? " : " + err : "");
    }

    print("    " + msg);
}

function it(desc, callback) {
    index++;

    // Assume async only if callback is receiving more than 1 argument
    let loop = callback.length > 1 ? new GLib.MainLoop(null, false) : null;

    callback(assert.bind({
        index: index,
        desc: desc
    }), done.bind(this, loop));

    if (loop) {
        loop.run();
    }
}

function done(loop) {
    if (loop) {
        loop.quit();
    }
}

function describe(desc, callback) {
    index = 0;

    print("  " + desc + " :");

    callback();
}
