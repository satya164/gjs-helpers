const Soup = imports.gi.Soup;

imports.searchPath.unshift(".");

const Promise = imports.promise.Promise;

function Response(message) {
    this._message = message;

    this.headers = message.response_headers;

    this.url = message.get_uri().to_string(false);

    this.status = message.status_code;
    this.statusText = Soup.Status.get_phrase(this.status);

    this.ok = (this.status === Soup.Status.OK);
}

Response.prototype.blob = function() {
    return new Promise(resolve => resolve(this._message.response_body.data));
};

function fetch(url, options) {
    return new Promise(resolve => {
        options = typeof options === "object" ? options : {};

        options.method = options.method || "GET";

        let session = new Soup.SessionAsync();

        Soup.Session.prototype.add_feature.call(session, new Soup.ProxyResolverDefault());

        let request = Soup.Message.new(options.method, url);

        session.queue_message(request, (source, message) => {
            resolve(new Response(message));
        });
    });
}
