
// couchDBJQuery.couch.urlPrefix = "http://localhost:5984";
couchDBJQuery.couch.urlPrefix = "https://diagroo.couchappy.com";

// get a new UUID from CouchDB
function newUUID() {
	return couchDBJQuery.couch.newUUID();
}

// Save an document JavaScript
// [Asynchrone]
function save(obj) {
	couchDBJQuery.couch.db("diagroo").saveDoc(obj, {
		success: function(data) {
			console.log(data);
		},
		error: function(status) {
			console.log(status);
		}
	});
}