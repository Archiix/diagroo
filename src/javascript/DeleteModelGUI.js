
function deleteModel(modelId) {
	$.ajaxSetup({async:false});
	var layers = JSON.parse($.get(mainURL+'/diagroo/_design/layer/_view/getLayersByModel', {key: '"'+modelId+'"'}).responseText);
	for (var i = 0; i < layers.rows.length; i++) {
		var currentLayer = layers.rows[i];
		var currentLayerId = currentLayer.id;
		var allDocs = JSON.parse($.get(mainURL+'/diagroo/_design/layer/_view/getAllDocsByLayer', {key: '"'+currentLayerId+'"'}).responseText);
		// delete models and views
		for (var j = 0; j < allDocs.rows.length; j++) {
			var doc = allDocs.rows[j].value;
			removeSynchronous(doc._id, doc._rev);
		}
		// delete layer
		removeSynchronous(currentLayer.value._id, currentLayer.value._rev);
	}
	// delete model
	var model = JSON.parse($.get(mainURL+'/diagroo/'+modelId).responseText);
	removeSynchronous(model._id, model._rev);
	// delete views
	var views = JSON.parse($.get(mainURL+'/diagroo/_design/view/_view/getViewsByModel', {key: '"'+modelId+'"'}).responseText);
	for (var i = 0; i < views.rows.length; i++) {
		var view = views.rows[i].value;
		removeSynchronous(view._id, view._rev);
	}
}