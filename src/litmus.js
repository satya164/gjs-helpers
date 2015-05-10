const GLib = imports.gi.GLib;

let testcount = 0,
    donecount = 0;

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
    testcount++;

    callback(assert.bind({
        index: testcount,
        desc: desc
    }));
}

function done(loop) {
    donecount++;

    if (donecount === testcount) {
        testcount = donecount = 0;

        if (loop) {
            loop.quit();
        }
    }
}

function describe(desc, callback) {
    testcount = donecount = 0;

    print("  " + desc + " :");

    // Assume async only if callback is receiving at least 1 argument
    let loop = callback.length ? new GLib.MainLoop(null, false) : null;

    callback(done.bind(this, loop));

    if (loop) {
        loop.run();
    }
}
