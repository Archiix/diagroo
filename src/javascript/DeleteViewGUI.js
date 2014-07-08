
function deleteView(viewId) {
	$.ajaxSetup({async:false});
	// delete item, connector and connection view
	var allDocs = JSON.parse($.get(mainURL+'/diagroo/_design/view/_view/getAllDocsByView', {key: '"'+viewId+'"'}).responseText);
	for (var i = 0; i < allDocs.rows.length; i++) {
		var doc = allDocs.rows[i].value;
		console.log(doc);
		removeSynchronous(doc._id, doc._rev);
	}
	// delete view
	var view = JSON.parse($.get(mainURL+'/diagroo/'+viewId).responseText);
	removeSynchronous(view._id, view._rev);
}