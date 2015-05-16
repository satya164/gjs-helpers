imports.searchPath.unshift(".");

const describe = imports.litmus.describe;
const it = imports.litmus.it;

const fetch = imports.fetch.fetch;

describe("fetch", () => {
    it("should fetch file", (assert, done) => {
        fetch("https://raw.githubusercontent.com/satya164/gjs-helpers/master/README.md")
            .then(response => {
                if (response.ok) {
                    response.blob().then(blob => {
                        assert.ok(/GNOME JavaScript/.test(blob));
                        done();
                    });
                } else {
                    assert.ok(false);
                    done();
                }
            })
            .catch(() => {
                assert.ok(false);
                done();
            });
    });

    it("should not fetch file", (assert, done) => {
        fetch("http://someinvalidurl.com")
            .then(response => {
                if (response.ok) {
                    assert.ok(false);
                    done();
                } else {
                    assert.ok(true);
                    done();
                }
            })
            .catch(() => {
                assert.ok(false);
                done();
            });
    });

    it("should have correct response object", (assert, done) => {
        fetch("http://someinvalidurl.com")
            .then(response => {
                assert.ok("headers" in response && "url" in response && "status" in response &&
                          "statusText" in response && "ok" in response);
                done();
            })
            .catch(() => {
                assert.ok(false);
                done();
            });
    });
});
