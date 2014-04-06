
function getModels(modelsSelectHTML) {
	
	
	couchDBJQuery.couch.db("diagroo").view("model/getModelByName", {
		success: function(data) {
			modelsSelectHTML.empty();
			modelsList = data.rows;
			if (modelsList.length == 0) {
				modelsSelectHTML.append('<option value="">No Models</option>');
			}
			for (var i = 0; i < modelsList.length; i++) {
				id = modelsList[i].id;
				text = modelsList[i].key;
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
			itemsList = data.rows;
			if (itemsList.length == 0) {
				itemsSelectHTML.append('<option value="">No Items</option>');
			}
			for (var i = 0; i < itemsList.length; i++) {
				id = itemsList[i].id;
				text = itemsList[i].value
				itemsSelectHTML.append('<option value="' + id + '">' + text + '</option>');
			}
		},
		error: function(status) {
			console.log(status);
		},
		key: modelId
	});
	
}