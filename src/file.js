const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;

imports.searchPath.unshift(".");

const Promise = imports.promise.Promise;

function File(path) {
    this.file = Gio.File.new_for_path(path);
}

File.prototype.exists = function() {
    return new Promise(resolve => resolve(this.file.query_exists(null)));
}

File.prototype.read = function() {
    return new Promise(resolve => {
        let size = this.file.query_info("standard::size",
                                        Gio.FileQueryInfoFlags.NONE,
                                        null).get_size();

        this.file.read_async(GLib.PRIORITY_DEFAULT, null, function(file, res) {
            resolve(file.read_finish(res).read_bytes(size, null).get_data().toString());
        });
    });
}

File.prototype.create = function(text, replace) {
    return new Promise(resolve => {
        let outputstream = this.file.create(Gio.FileCreateFlags[replace ? "REPLACE_DESTINATION" : "NONE"], null);

        outputstream.write_all(typeof text === "string" ? text : "", null);

        outputstream.close(null);

        resolve();
    });
}

File.prototype.append = function(text) {
    return new Promise(resolve => {
        let outputstream = this.file.append_to(Gio.FileCreateFlags.NONE, null);

        outputstream.write_all(text, null);

        outputstream.close(null);

        resolve();
    });
}

File.prototype.copyto = function(path, replace) {
    return new Promise(resolve => resolve(this.file.copy(new File(path).file, Gio.FileCopyFlags[replace ? "OVERWRITE" : "NONE"], null, null)));
}

File.prototype.moveto = function(path) {
    return new Promise(resolve => resolve(this.file.move(new File(path).file, Gio.FileCopyFlags.NONE, null, null)));
}

File.prototype.rename = function(name) {
    return new Promise(resolve => {
        this.file.set_display_name_async(name, GLib.PRIORITY_DEFAULT, null, (source, res) => resolve(source.set_display_name_finish(res)));
    });
}

File.prototype["delete"] = function() {
    return new Promise(resolve => {
        this.file.delete_async(GLib.PRIORITY_DEFAULT, null, (source, res) => resolve(source.delete_finish(res)));
    });
}

File.prototype.mkdir = function() {
    return new Promise(resolve => {
        this.file.make_directory_async(GLib.PRIORITY_DEFAULT, null, (source, res) => resolve(source.make_directory_finish(res)));
    });
}

File.prototype.symlinkto = function(path) {
    return new Promise(resolve => resolve(this.file.make_symbolic_link(path, null)));
}
