const Mainloop = imports.mainloop;

function Promise(executer) {
    if (typeof executer !== "function") {
        throw new TypeError("Promise resolver " + executer + " is not a function");
    }

    this._onFullfilled = [];
    this._onRejected = [];

    this._PromiseStatus = "pending";

    let resolve = (value) => {
        this._PromiseValue = value;
        this._PromiseStatus = "resolved"

        for (let handler of this._onFullfilled) {
            handler.call(this, value);
        }
    }

    let reject = (reason) => {
        this._PromiseValue = reason;
        this._PromiseStatus = "rejected"

        if (this._onRejected.length === 0) {
            throw new Error("Uncaught (in promise) " + reason);
        }

        for (let handler of this._onRejected) {
            handler.call(this, reason);
        }
    }

    Mainloop.timeout_add(10, () => {
        executer(resolve, reject)

        return false; // Repeat
    }, null);
}

Promise.prototype.then = function(onFullfilled, onRejected) {
    if (typeof onFullfilled === "function") {
        if (this._PromiseStatus === "resolved") {
            onFullfilled.call(this, this._PromiseValue);
        } else {
            this._onFullfilled.push(onFullfilled);
        }
    }

    this["catch"](onRejected);

    return this;
}

Promise.prototype["catch"] = function(onRejected) {
    if (typeof onRejected === "function") {
        if (this._PromiseStatus === "rejected") {
            onRejected.call(this, this._PromiseValue);
        } else {
            this._onRejected.push(onRejected);
        }
    }

    return this;
}

Promise.all = function(iterable) {
    let promises = iterable.filter(p => p instanceof Promise),
        values = [],
        done = 0;

    return new Promise((resolve, reject) => {
        promises.forEach((promise, index) => {
            promise.then(value => {
                done++;

                values[index] = value;

                if (done === promises.length) {
                    resolve(values);
                }
            }, reject);
        });
    });
}

Promise.race = function(iterable) {
    let promises = iterable.filter(p => p instanceof Promise);

    return new Promise((resolve, reject) => {
        promises.forEach(promise => promise.then(resolve, reject));
    });
}

Promise.reject = function(reason) {
    return new Promise((resolve, reject) => {
        reject(reason);
    });
}

Promise.resolve = function(value) {
    return new Promise((resolve) => {
        resolve(value);
    });
}
