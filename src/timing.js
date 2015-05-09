// Timing events from - https://github.com/optimisme/gjs-examples

const Mainloop = imports.mainloop;

const setTimeout = (func, millis) => {
    return Mainloop.timeout_add(millis, () => {
        func();

        return false; // Don't repeat
    }, null);
};

const clearTimeout = id => Mainloop.source_remove(id);

const setInterval = (func, millis) => {
    let id = Mainloop.timeout_add(millis, () => {
        func();

        return true; // Repeat
    }, null);

    return id;
};

const clearInterval = id => Mainloop.source_remove(id);
