imports.searchPath.unshift(".");

const describe = imports.litmus.describe;
const it = imports.litmus.it;

const fetch = imports.fetch.fetch;

describe("fetch", () => {
    it("should fetch text", (assert, done) => {
        fetch("https://raw.githubusercontent.com/satya164/gjs-helpers/master/README.md")
            .then(response => {
                if (response.ok) {
                    response.text().then(text => {
                        assert.ok(/GNOME JavaScript/.test(text));
                        done();
                    });
                } else {
                    assert.fail();
                    done();
                }
            })
            .catch(() => {
                assert.fail();
                done();
            });
    });

    it("should fetch json", (assert, done) => {
        fetch("https://api.github.com/users/satya164")
            .then(response => {
                if (response.ok) {
                    response.json().then(json => {
                        assert.ok(json.type === "User");
                        done();
                    });
                } else {
                    assert.fail();
                    done();
                }
            })
            .catch(() => {
                assert.fail();
                done();
            });
    });

    it("should not fetch file", (assert, done) => {
        fetch("http://someinvalidurl.com")
            .then(response => {
                if (response.ok) {
                    assert.fail();
                    done();
                } else {
                    assert.ok(true);
                    done();
                }
            })
            .catch(() => {
                assert.fail();
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
                assert.fail();
                done();
            });
    });
});
