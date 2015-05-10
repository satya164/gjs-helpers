const GLib = imports.gi.GLib;

imports.searchPath.unshift(".");

const describe = imports.litmus.describe;
const it = imports.litmus.it;

let loop = new GLib.MainLoop(null, false);

const setTimeout = imports.timing.setTimeout;
const clearTimeout = imports.timing.clearTimeout;
const setInterval = imports.timing.setInterval;
const clearInterval = imports.timing.clearInterval;

describe("timing events", done => {
    it("should finish in 1 second", assert => {
        let time = Date.now();

        setTimeout(() => {
            assert((Date.now() - time - 1000) < 10);
            done();
        }, 1000);
    });

    it("should clear timeout", assert => {
        let called = false;

        let id = setTimeout(() => {
            called = true;

            assert(false);
            done();
        }, 1000);

        setTimeout(() => {
            if (called) {
                return;
            }

            assert(true);
            done();
        }, 1500);

        clearTimeout(id);
    });

    it("should run in .5 second interval for 5 times", assert => {
        let time = Date.now(),
            i = 0;

        let id = setInterval(() => {
            i++;

            if (i === 5) {
                clearInterval(id);

                assert((Date.now() - time - (500 * 5)) < 10);
                done();
            }
        }, 500);
    });
}, () => loop.quit());

loop.run();
