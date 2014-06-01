
function saveUpdateModel(modelName, items, connections) {
	var models = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/_design/model/_view/getModelByName', {'key': '"' + modelName + '"'}).responseText);
	// sauver le modèle s'il n'existe pas
	var modelId = couchDBJQuery.couch.newUUID();
	if (models.rows.length == 0) {
		var newModel = new Model(modelId, modelName);
	} else {
		modelId = models.rows[0]._id;
	}
	// pour tous les blocs
	for (var i = 0; i < items.getSize(); i++) {
		var currentItem = items.get(i);
		var item = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/' + currentItem.getId()).responseText);
		if (item.error && item.error == "not_found") {
			var newItem = Item(currentItem.id, modelId, currentItem.getText());
			save(newItem);
			for (var j = 0; j < currentItem.connectors.getSize(); j++) {
				var currentConnector = currentItem.connectors.get(j);
				var newConnector = new Connector(currentConnector.getId(), currentItem.getId(), currentConnector.type);
				save(newConnector);
			}
		} else { // existe déjâ
			item.modelId = modelId;
			item.text = currentItem.getText(); // mise à jour du text du bloc
			save(item); // mise à jour
			for (var j = 0; j < currentItem.connectors.getSize(); j++) {
				var currentConnector = currentItem.connectors.get(j);
				var connector = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/' + currentConnector.getId()).responseText);
				if (connector.error && connector.error == "not_found") {
					var newConnector = new Connector(currentConnector.getId(), currentItem.getId(), currentConnector.type);
					save(newConnector);
				} else {
					save(connector);
				}
			}
		}
	}
	// pour toutes les connections
	for (var i = 0; i < connections.getSize(); i++) {
		var currentConnection = connections.get(i);
		var connection = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/' + currentConnection.getId()).responseText);
		if (connection.error && connection.error == "not_found") {
			save(currentConnection);
		} else {
			// TODO => mise à jour du texte !!!
			save(connection);
		}
	}
}

// function saveUpdateModel(modelName, items, connections) { // items ==> Draw2DItem object, connections ==> Connection object
	
	// couchDBJQuery.couch.db("diagroo").view("model/getModelByName", {
		// success: function(data) {
			// console.log(data);
			// if (data.rows.length == 0) {
				// success("Model doesn't exists !");
				// var uuid = couchDBJQuery.couch.newUUID();
				// var newModel = new Model(uuid, modelName);
				// couchDBJQuery.couch.db("diagroo").saveDoc(newModel, {
					// success: function(data) {
						// console.log(data);
						// save Item, Connector and Connection
						// for (var i = 0; i < items.getSize(); i++) {
							// var currentDraw2DItem = items.get(i);
							// var draw2DConnectors = currentDraw2DItem.connectors;
							
							// var currentItem = new Item(currentDraw2DItem.id, data.id, currentDraw2DItem.getText());
							// save(currentItem);
							
							// for (var j = 0; j < draw2DConnectors.getSize(); j++) {
								// var current2DConnectors = draw2DConnectors.get(j);
								
								// var connector = new Connector(current2DConnectors.id, currentDraw2DItem.id, /* current2DConnectors.faceIndex, */ current2DConnectors.type);
								// save(connector);
							// }
						// }
						// for (var i = 0; i < connections.getSize(); i++) {
							// save(connections.get(i));
						// }
						// end save Item, Connector and Connection
					// },
					// error: function(status) {
						// console.log(status);
					// }
				// });
			// } else {
				// error("Model already exists !");
				// TODO update Item, Connector and Connection
			// }
		// },
		// error: function(status) {
			// console.log(status);
		// },
		// key: modelName
	// });
	
// }