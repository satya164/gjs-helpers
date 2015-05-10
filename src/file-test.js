imports.searchPath.unshift(".");

const describe = imports.litmus.describe;
const it = imports.litmus.it;

const File = imports.file.File;

describe("file", () => {
    it("should tell if file exits", (assert, done) => {
        let file = new File("/etc/hosts");

        file.exists()
            .then(res => {
                assert.ok(res);
                done();
            })
            ["catch"](() => {
                assert.ok(false);
                done();
            });
    });

    it("should tell if file doesn't exist", (assert, done) => {
        let file = new File("/path/to/some/file");

        file.exists()
            .then(res => {
                assert.ok(!res);
                done();
            })
            ["catch"](() => {
                assert.ok(false);
                done();
            });
    });

    it("should read file contents", (assert, done) => {
        let file = new File("/etc/hosts");

        file.read()
            .then(res => {
                assert.ok(/localhost/.test(res));
                done();
            })
            ["catch"](() => {
                assert.ok(false);
                done();
            });
    });

    it("should create file with contents", (assert, done) => {
        let file = new File("/tmp/file-write-test-" + Math.random());

        file.create("Hello world!")
            .then(() => file.read())
            .then(res => {
                assert.equal(res, "Hello world!");
                done();
            })
            ["catch"](() => {
                assert.ok(false);
                done();
            });
    });

    it("should append to file", (assert, done) => {
        let file = new File("/tmp/file-append-test-" + Math.random());

        file.create("Apple, ")
            .then(() => file.append("Orange!"))
            .then(() => file.read())
            .then(res => {
                assert.equal(res, "Apple, Orange!");
                done();
            })
            ["catch"](() => {
                assert.ok(false);
                done();
            });
    });

    it("should move file", (assert, done) => {
        let oldpath = "/tmp/file-move-test-" + Math.random() + "-old",
            newpath = "/tmp/file-move-test-" + Math.random() + "-new";

        let file = new File(oldpath);

        file.create("")
            .then(() => file.moveto(newpath))
            .then(() => file.exists())
            .then(res => {
                if (!res) {
                    let newfile = new File(newpath);

                    newfile.exists()
                        .then(r => {
                            assert.ok(r);
                            done();
                        })
                        ["catch"](() => {
                            assert.ok(false);
                            done();
                        });
                } else {
                    assert.ok(res);
                    done();
                }
            })
            ["catch"](() => {
                assert.ok(false);
                done();
            });
    });

    it("should delete file", (assert, done) => {
        let file = new File("/tmp/file-delete-test-" + Math.random());

        file.create("Apple, ")
            .then(() => file["delete"]())
            .then(() => file.exists())
            .then(res => {
                assert.ok(!res);
                done();
            })
            ["catch"](() => {
                assert.ok(false);
                done();
            });
    });

    it("should create directory", (assert, done) => {
        let file = new File("/tmp/file-mkdir-test-" + Math.random());

        file.mkdir()
            .then(() => file.exists())
            .then(res => {
                assert.ok(res);
                done();
            })
            ["catch"](() => {
                assert.ok(false);
                done();
            });
    });

    it("should create symlink to file", (assert, done) => {
        let file = new File("/tmp/file-symlink-test-" + Math.random());

        file.symlinkto("/path/to/some/file")
            .then(res => {
                assert.ok(res);
                done();
            })
            ["catch"](() => {
                assert.ok(false);
                done();
            });
    });
});
