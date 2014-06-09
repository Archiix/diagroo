
function getModels(modelsSelectHTML) {
	
	
	couchDBJQuery.couch.db("diagroo").view("model/getModelByName", {
		success: function(data) {
			modelsSelectHTML.empty();
			var modelsList = data.rows;
			if (modelsList.length == 0) {
				modelsSelectHTML.append('<option value="">No Models</option>');
			}
			for (var i = 0; i < modelsList.length; i++) {
				var id = modelsList[i].id;
				var text = modelsList[i].key;
				modelsSelectHTML.append('<option value="' + id + '">' + text + '</option>');
			}
		},
		error: function(status) {
			console.log(status);
		}
	});
	
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
	couchDBJQuery.couch.db("diagroo").view("layer/getLayersByModel", {
		success: function(data) {
			layersSelectHTML.empty();
			console.log(data);
			var layersList = data.rows;
			if (layersList.length == 0) {
				layersSelectHTML.append('<option value="">No Layers</option>');
			}
			for (var i = 0; i < layersList.length; i++) {
				var id = layersList[i].id;
				var text = layersList[i].value;
				layersSelectHTML.append('<option value="' + id + '">' + text + '</option>');
			}
		},
		error: function(status) {
		},
		key: modelId
	});
}