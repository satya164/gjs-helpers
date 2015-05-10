imports.searchPath.unshift(".");

const describe = imports.litmus.describe;
const it = imports.litmus.it;

const setTimeout = imports.timing.setTimeout;
const clearTimeout = imports.timing.clearTimeout;
const setInterval = imports.timing.setInterval;
const clearInterval = imports.timing.clearInterval;

describe("timing events", () => {
    it("should finish in 1 second", (assert, done) => {
        let time = Date.now();

        setTimeout(() => {
            assert.ok((Date.now() - time - 1000) < 10);
            done();
        }, 1000);
    });

    it("should clear timeout", (assert, done) => {
        let called = false;

        let id = setTimeout(() => {
            called = true;

            assert.ok(false);
            done();
        }, 1000);

        setTimeout(() => {
            if (called) {
                return;
            }

            assert.ok(true);
            done();
        }, 1500);

        clearTimeout(id);
    });

    it("should run in .5 second interval for 5 times", (assert, done) => {
        let time = Date.now(),
            i = 0;

        let id = setInterval(() => {
            i++;

            if (i === 5) {
                clearInterval(id);

                assert.ok((Date.now() - time - (500 * 5)) < 10);
                done();
            }
        }, 500);
    });
});
