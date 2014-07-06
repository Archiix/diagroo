
function getModels(modelsSelectHTML) {
	$.ajaxSetup({async:false});
	var models = JSON.parse($.get(mainURL+'/diagroo/_design/model/_view/getModelByName').responseText);
	modelsSelectHTML.empty();
	if (models.rows.length == 0) {
		modelsSelectHTML.append('<option value="">No Models</option>');
	}
	for (var i = 0; i < models.rows.length; i++) {
		var model = models.rows[i];
		var id = model.id;
		var text = model.key;
		modelsSelectHTML.append('<option value="' + id + '">' + text + '</option>');
	}
}

function getItems(modelId, itemsSelectHTML) {
	couchDBJQuery.couch.db("diagroo").view("model/getItemsByModel", {
		success: function(data) {
			itemsSelectHTML.empty();
			var itemsList = data.rows;
			if (itemsList.length == 0) {
				itemsSelectHTML.append('<option value="">No Items</option>');
			}
			for (var i = 0; i < itemsList.length; i++) {
				var id = itemsList[i].id;
				var text = itemsList[i].value
				itemsSelectHTML.append('<option value="' + id + '">' + text + '</option>');
			}
		},
		error: function(status) {
			console.log(status);
		},
		key: modelId
	});
}

function getLayers(modelId, layersSelectHTML) {
	$.ajaxSetup({async:false});
	var layers = JSON.parse($.get(mainURL+'/diagroo/_design/layer/_view/getLayersByModel', {key: '"'+modelId+'"'}).responseText);
	layersSelectHTML.empty();
	if (layers.rows.length == 0) {
		layersSelectHTML.append('<option value="">No Layers</option>');
	}
	layers.rows = layers.rows.sort(function(a, b) { return a.value.index - b.value.index; } );
	for (var i = 0; i < layers.rows.length; i++) {
		var layer = layers.rows[i];
		var id = layer.id;
		var text = layer.value.name + ' - ' + layer.value.index;
		layersSelectHTML.append('<option value="' + id + '">' + text + '</option>');
	}
}

function getViews(modelId, viewsSelectHTML) {
	$.ajaxSetup({async:false});
	var views = JSON.parse($.get(mainURL+'/diagroo/_design/view/_view/getViewsByModel', {key: '"'+modelId+'"'}).responseText);
	viewsSelectHTML.empty();
	if (views.rows.length == 0) {
		viewsSelectHTML.append('<option value="">No Views</option>');
	}
	for (var i = 0; i < views.rows.length; i++) {
		var view = views.rows[i];
		var id = view.id;
		var text = view.value;
		viewsSelectHTML.append('<option value="' + id + '">' + text + '</option>');
	}
}