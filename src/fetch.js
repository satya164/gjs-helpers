const Soup = imports.gi.Soup;

imports.searchPath.unshift(".");

const Promise = imports.promise.Promise;

function Response(message) {
    this.message = message;

    this.headers = message.response_headers;

    this.url = message.get_uri().to_string(false);

    this.status = message.status_code;
    this.statusText = Soup.Status.get_phrase(this.status);

    this.ok = (this.status === Soup.Status.OK);
}

Response.prototype.blob = function() {
    return new Promise(resolve => resolve(this.message.response_body.data));
};

Response.prototype.text = function() {
    return new Promise(resolve => resolve(this.message.response_body.data.toString()));
};

Response.prototype.json = function() {
    return new Promise(resolve => resolve(JSON.parse(this.message.response_body.data.toString())));
};

function fetch(url, options) {
    return new Promise(resolve => {
        options = typeof options === "object" ? options : {};

        options.method = options.method || "GET";

        let session = new Soup.SessionAsync({ user_agent: "Mozilla/5.0" });

        Soup.Session.prototype.add_feature.call(session, new Soup.ProxyResolverDefault());

        let request = Soup.Message.new(options.method, url);

        session.queue_message(request, (source, message) => {
            resolve(new Response(message));
        });
    });
}
