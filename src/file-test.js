imports.searchPath.unshift(".");

const describe = imports.litmus.describe;
const it = imports.litmus.it;

const File = imports.file.File;

describe("file", () => {
    it("should tell if file exits", (assert, done) => {
        let file = new File("/etc/hosts");

        file.exists().then(res => {
            assert.ok(res);
            done();
        })
    });

    it("should tell if file doesn't exist", (assert, done) => {
        let file = new File("/path/to/some/file");

        file.exists().then(res => {
            assert.ok(!res);
            done();
        })
    });

    it("should read file contents", (assert, done) => {
        let file = new File("/etc/hosts");

        file.read().then(res => {
            assert.ok(/localhost/.test(res));
            done();
        })
    });

    it("should create file with contents", (assert, done) => {
        let file = new File("/tmp/file-test-" + Math.random());

        file.create("Hello world!")
            .then(() => file.read())
            .then(res => {
                assert.equal(res, "Hello world!");
                done();
            });
    });

    it("should append to file", (assert, done) => {
        let file = new File("/tmp/file-test-" + Math.random());

        file.create("Apple, ")
            .then(() => file.append("Orange!"))
            .then(() => file.read())
            .then(res => {
                assert.equal(res, "Apple, Orange!");
                done();
            });
    });

    it("should rename file", (assert, done) => {
        let oldname = "/tmp/file-test-" + Math.random() + "-old",
            newname = "/tmp/file-test-" + Math.random() + "-new";

        let file = new File(oldname);

        file.create("")
            .then(() => file.rename(newname))
            .then(() => file.exists())
            .then(res => {
                if (!res) {
                    let newfile = new File(newname);

                    newfile.exists().then(r => {
                        assert.ok(r);
                        done();
                    })
                } else {
                    assert.ok(res);
                    done();
                }
            });
    });

    it("should delete file", (assert, done) => {
        let file = new File("/tmp/file-test-" + Math.random());

        file.create("Apple, ")
            .then(() => file["delete"]())
            .then(() => file.exists())
            .then(res => {
                assert.ok(!res);
                done();
            });
    });
});
