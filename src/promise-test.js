imports.searchPath.unshift(".");

const describe = imports.litmus.describe;
const it = imports.litmus.it;

const setTimeout = imports.timing.setTimeout;
const Promise = imports.promise.Promise;

describe("promises", () => {
    it("should throw error when called without 'new'", (assert) => {
        assert.throws(() => Promise(resolve => resolve()));
    });

    it("should throw error when called without a function", (assert) => {
        assert.throws(() => {
            let promise = new Promise(null);

            promise.then(() => {});
        });
    });

    it("should resolve promise", (assert, done) => {
        let promise = new Promise(resolve => {
            setTimeout(resolve, 50);
        })

        promise.then(() => {
            assert.ok(true);
            done();
        });
    });

    it("should reject promise", (assert, done) => {
        let promise = new Promise((resolve, reject) => {
            setTimeout(reject, 50);
        })

        promise.catch(() => {
            assert.ok(true);
            done();
        });
    });

    it("should resolve promise after the async task is finished", (assert, done) => {
        let promise = new Promise(resolve => {
            setTimeout(resolve, 20);
        });

        setTimeout(function() {
            promise.then(() => {
                assert.ok(true);
                done();
            });
        }, 50);
    });

    it("should reject promise after the async task is finished", (assert, done) => {
        let promise = new Promise((resolve, reject) => {
            setTimeout(reject, 20);
        });

        setTimeout(function() {
            promise.catch(() => {
                assert.ok(true);
                done();
            });
        }, 50);
    });

    it("should reject promise on error", (assert, done) => {
        let promise = new Promise(() => {
            throw new Error();
        });

        promise.catch(() => {
            assert.ok(true);
            done();
        });
    });

    it("should resolve as all promises resolve", (assert, done) => {
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
            assert.ok(value[0] === 5 && value[1] === 7 && value[2] === 3);
            done();
        });
    });

    it("should resolve as first promise resolves", (assert, done) => {
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

            assert.ok(true);
            done();
        });
    });

    it("should reject as first promise rejects", (assert, done) => {
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

        Promise.race(promises).catch(value => {
            if (resolved) {
                return;
            }

            resolved = true;

            assert.equal(value, 5);
            done();
        });
    });

    it("should resolve promise with value", (assert, done) => {
        let promise = Promise.resolve(12);

        promise.then(value => {
            assert.equal(value, 12);
            done();
        });
    });

    it("should reject promise with value", (assert, done) => {
        let promise = Promise.reject(12);

        promise.catch(value => {
            assert.equal(value, 12);
            done();
        });
    });
});
