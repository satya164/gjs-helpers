const GLib = imports.gi.GLib;

imports.searchPath.unshift(".");

const describe = imports.litmus.describe;
const it = imports.litmus.it;

const setTimeout = imports.timing.setTimeout;
const Promise = imports.promise.Promise;

describe("promises", done => {
    it("should resolve promise", assert => {
        let promise = new Promise(resolve => {
            setTimeout(resolve, 50);
        })

        promise.then(() => {
            assert(true);
            done();
        });
    });

    it("should reject promise", assert => {
        let promise = new Promise((resolve, reject) => {
            setTimeout(reject, 50);
        })

        promise["catch"](() => {
            assert(true);
            done();
        });
    });

    it("should reject promise on error", assert => {
        let promise = new Promise(() => {
            throw new Error();
        });

        promise["catch"](() => {
            assert(true);
            done();
        });
    });

    it("should resolve as all promises resolve", assert => {
        let promises = [];

        promises.push(new Promise(resolve => {
            setTimeout(() => {
                resolve(5);
            }, 10);
        }));

        promises.push(new Promise(resolve => {
            setTimeout(() => {
                resolve(7);
            }, 20);
        }));

        promises.push(new Promise(resolve => {
            setTimeout(() => {
                resolve(3);
            }, 50);
        }));

        Promise.all(promises).then(value => {
            assert(value[0] === 5 && value[1] === 7 && value[2] === 3);
            done();
        });
    });

    it("should resolve as first promise resolves", assert => {
        let promises = [],
            resolved = false;

        promises.push(new Promise(resolve => {
            setTimeout(() => {
                resolve(5);
            }, 10);
        }));

        promises.push(new Promise(resolve => {
            setTimeout(() => {
                resolve(7);
            }, 20);
        }));

        promises.push(new Promise(resolve => {
            setTimeout(() => {
                resolve(3);
            }, 50);
        }));

        Promise.race(promises).then(value => {
            if (resolved) {
                return;
            }

            resolved = (value === 5);

            assert(true);
            done();
        });
    });

    it("should reject as first promise rejects", assert => {
        let promises = [],
            resolved = false;

        promises.push(new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(5);
            }, 10);
        }));

        promises.push(new Promise(resolve => {
            setTimeout(() => {
                resolve(7);
            }, 20);
        }));

        promises.push(new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(3);
            }, 50);
        }));

        Promise.race(promises)["catch"](value => {
            if (resolved) {
                return;
            }

            resolved = (value === 5);

            assert(true);
            done();
        });
    });

    it("should resolve promise with value", assert => {
        let promise = Promise.resolve(12);

        promise.then(value => {
            assert(value === 12);
            done();
        });
    });

    it("should reject promise with value", assert => {
        let promise = Promise.reject(12);

        promise["catch"](value => {
            assert(value === 12);
            done();
        });
    });
});
