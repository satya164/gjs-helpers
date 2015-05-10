const GLib = imports.gi.GLib;

let count = 0;

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
    this.index = (typeof this.index === "number") ? this.index : 1;

    this.desc = desc;

    callback(assert.bind({
        index: this.index,
        desc: this.desc
    }));

    this.index++;

    count++;
}

function done(loop) {
    this.num++;

    if (this.num === count) {
        count = 0;

        loop.quit();
    }
}

function describe(desc, callback) {
    let loop = new GLib.MainLoop(null, false);

    print("  " + desc + " :");

    this.num = 0;

    callback(done.bind(this, loop));

    loop.run();
}
