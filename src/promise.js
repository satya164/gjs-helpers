const Mainloop = imports.mainloop;

const PENDING = 0,
      FULFILLED = 1,
      REJECTED = 2;

function Promise(executor) {
    if (typeof executor !== "function") {
        throw new TypeError("Promise resolver " + executor + " is not a function");
    }

    // Create arrays to add handlers
    this._handlers = {
        fulfill: [],
        reject: []
    }

    // Set the promise status
    this._state = PENDING;

    let resolve = value => {
        // Promise is fulfilled
        this._state = FULFILLED;
        this._value = value;

        // Call all fulfillment handlers one by one
        for (let handler of this._handlers.fulfill) {
            handler.call(this, value);
        }
    }

    let reject = reason => {
        // Promise is rejected
        this._state = REJECTED;
        this._value = reason;

        // If no rejection handlers attached, throw error
        if (this._handlers.reject.length === 0) {
            throw new Error("Uncaught (in promise) " + reason);
        }

        // Call all rejection handlers one by one
        for (let handler of this._handlers.reject) {
            handler.call(this, reason);
        }
    }

    // Run the executor at a delay to let all handlers attach
    Mainloop.timeout_add(10, () => {
        try {
            executor(resolve, reject);
        } catch (e) {
            reject(e);
        }

        return false; // Don't repeat
    }, null);
}

// Appends fulfillment and rejection handlers to the promise
Promise.prototype.then = function(onFulfilled, onRejected) {
    if (typeof onFulfilled === "function") {
        if (this.PromiseStatus === REJECTED) {
            // Promise is already fulfilled, call the handler with the value
            onFulfilled.call(this, this._value);
        } else {
            // Promise hasn't fulfilled, add handler to the queue
            this._handlers.fulfill.push(onFulfilled);
        }
    }

    this["catch"](onRejected);

    return this;
}

// Appends a rejection handler callback to the promise
Promise.prototype["catch"] = function(onRejected) {
    if (typeof onRejected === "function") {
        if (this.PromiseStatus === REJECTED) {
            // Promise is already rejected, call the handler with the value
            onRejected.call(this, this._value);
        } else {
            // Promise hasn't rejected, add handler to the queue
            this._handlers.reject.push(onRejected);
        }
    }

    return this;
}

// Returns a promise that resolves when all of the promises in the iterable
// argument have resolved
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

// Returns a promise that resolves or rejects as soon as one of the promises
// in the iterable resolves or rejects, with the value or reason from that
// promise
Promise.race = function(iterable) {
    let promises = iterable.filter(p => p instanceof Promise);

    return new Promise((resolve, reject) => {
        promises.forEach(promise => promise.then(resolve, reject));
    });
}

// Returns a Promise object that is rejected with the given reason
Promise.reject = function(reason) {
    return new Promise((resolve, reject) => reject(reason));
}

// Returns a Promise object that is resolved with the given value
Promise.resolve = function(value) {
    return new Promise(resolve => resolve(value));
}
