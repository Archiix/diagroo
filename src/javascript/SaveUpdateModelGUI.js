
function saveUpdateModel(modelId, layerId, items, connections, draw2DConnections) {
	$.ajaxSetup({async:false});
	
	// pour tous les blocs
	for (var i = 0; i < items.getSize(); i++) {
		var currentItem = items.get(i);
		console.log("[Item ID] " + currentItem.getId());
		var item = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/' + currentItem.getId()).responseText);
		if (item.error && item.error == "not_found") {
			var newItem = new Item(currentItem.getId(), modelId, layerId, currentItem.getText());
			save(newItem);
			for (var j = 0; j < currentItem.connectors.getSize(); j++) {
				var currentConnector = currentItem.connectors.get(j);
				var newConnector = new Connector(currentConnector.getId(), currentItem.getId(), layerId, currentConnector.type);
				save(newConnector);
			}
		} else { // existe déjâ
			item.modelId = modelId;
			item.text = currentItem.getText(); // mise à jour du text du bloc
			save(item); // mise à jour
			for (var j = 0; j < currentItem.connectors.getSize(); j++) {
				var currentConnector = currentItem.connectors.get(j);
				console.log("[Connector ID] " + currentConnector.getId());
				var connector = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/' + currentConnector.getId()).responseText);
				if (connector.error && connector.error == "not_found") {
					var newConnector = new Connector(currentConnector.getId(), currentItem.getId(), layerId, currentConnector.type);
					save(newConnector);
				} else {
					// TODO => mise à jour du texte (label du connecteur)
					save(connector);
				}
			}
		}
	}
	// pour toutes les connections
	console.log(connections.getSize());
	for (var i = 0; i < connections.getSize(); i++) {
		var currentConnection = connections.get(i);
		console.log("[Connection ID] " + currentConnection._id);
		var connection = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/' + currentConnection._id).responseText);
		if (connection.error && connection.error == "not_found") {
			for (var j = 0; j < draw2DConnections.getSize(); j++) {
				var currentDraw2DConnection = draw2DConnections.get(j);
				if (currentDraw2DConnection.getId() == currentConnection._id) {
					console.log("[SaveUpdateModelGUI] Text updated !");
					currentConnection.text = currentDraw2DConnection.getText();
				}
			}
			save(currentConnection);
		} else {
			// TODO => mise à jour du texte !!!
			// draw2DConnections list
			console.log(draw2DConnections.getSize());
			for (var j = 0; j < draw2DConnections.getSize(); j++) {
				var currentDraw2DConnection = draw2DConnections.get(j);
				if (currentDraw2DConnection.getId() == connection._id) {
					console.log("[SaveUpdateModelGUI] Text updated !");
					connection.text = currentDraw2DConnection.getText();
				}
			}
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