
function saveUpdateModel(modelName, items, connections) { // items ==> Draw2DItem object, connections ==> Connection object
	
	couchDBJQuery.couch.db("diagroo").view("model/getModelByName", {
		success: function(data) {
			console.log(data);
			if (data.rows.length == 0) {
				success("Model doesn't exists !");
				var uuid = couchDBJQuery.couch.newUUID();
				var newModel = new Model(uuid, modelName);
				couchDBJQuery.couch.db("diagroo").saveDoc(newModel, {
					success: function(data) {
						console.log(data);
						// save Item, Connector and Connection
						for (var i = 0; i < items.getSize(); i++) {
							var currentDraw2DItem = items.get(i);
							var draw2DConnectors = currentDraw2DItem.connectors;
							
							var currentItem = new Item(currentDraw2DItem.id, data.id, currentDraw2DItem.getText());
							save(currentItem);
							
							for (var j = 0; j < draw2DConnectors.getSize(); j++) {
								var current2DConnectors = draw2DConnectors.get(j);
								
								var connector = new Connector(current2DConnectors.id, currentDraw2DItem.id, /* current2DConnectors.faceIndex, */ current2DConnectors.type);
								save(connector);
							}
						}
						for (var i = 0; i < connections.getSize(); i++) {
							save(connections.get(i));
						}
						// end save Item, Connector and Connection
					},
					error: function(status) {
						console.log(status);
					}
				});
			} else {
				error("Model already exists !");
				// TODO update Item, Connector and Connection
			}
		},
		error: function(status) {
			console.log(status);
		},
		key: modelName
	});
	
}