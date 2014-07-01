
function saveUpdateView(layerId, viewId, items, connections) { // items ==> Draw2DItem object, connections ==> Connection object
	$.ajaxSetup({async:false});
	
	for (var i = 0; i < items.getSize(); i++) {
		console.log("item i index ID = " + items.get(i).getId());
	}
	/* *************************************************************************************************************** */
	// sauvergarder + mettre à jours les blocs
	for (var i = 0; i < items.getSize(); i++) {
		var currentItem = items.get(i);
		var itemId = currentItem.getId();
		console.log(itemId);
		// est ce que l'itemView existe déjà
		
		var itemView = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/_design/view/_view/getItemView', {'key': '["'+layerId+'","'+viewId+'","'+itemId+'"]'}).responseText);
		if (itemView.rows.length == 0) {
			// layerId, x, y, itemId
			var newItemView = new ItemView(layerId, viewId, currentItem.getX(), currentItem.getY(), currentItem.getWidth(), currentItem.getHeight(), itemId);
			
			couchDBJQuery.couch.db("diagroo").saveDoc(newItemView, {
				success: function(data) { // saved !
				},
				error: function(status) {
				}
			});
			
			// $.post('https://diagroo.couchappy.com/diagroo', JSON.stringify(newItemView));
			
			// on sauve aussi les connecteurs
			for (var j = 0; j < currentItem.connectors.getSize(); j++) {
				var currentConnector = currentItem.connectors.get(j);
				// layerId, x, y, faceIndex, connectorId
				var newConnectorView = new ConnectorView(layerId, viewId, currentConnector.getX(), currentConnector.getY(), currentConnector.faceIndex, currentConnector.getId());
				
				couchDBJQuery.couch.db("diagroo").saveDoc(newConnectorView, {
					success: function(data) { // saved !
					},
					error: function(status) {
					}
				});
				
				// $.post('https://diagroo.couchappy.com/diagroo', JSON.stringify(newConnectorView));
			}
		} else {
			console.log("mise à jour vue"); // passe pas là !!!
			
			var itemExisting = itemView.rows[0].value;
			itemExisting.x = currentItem.getX();
			itemExisting.y = currentItem.getY();
			itemExisting.width = currentItem.getWidth();
			itemExisting.height = currentItem.getHeight();
			couchDBJQuery.couch.db("diagroo").saveDoc(itemExisting, {
				success: function(data) { // re-saved !
				},
				error: function(status) {
				}
			});
			// suppression des connecteurs
			for (var j = 0; j < currentItem.connectors.getSize(); j++) {
				var currentConnector = currentItem.connectors.get(j);
				var idConnector = currentConnector.getId();
				// get ConnectorView object
				var connectorView = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/_design/view/_view/getConnectorView', {'key': '["'+layerId+'","'+viewId+'","'+idConnector+'"]'}).responseText);
				if (connectorView.rows.length > 0) {
					var connectorViewToUpdate = connectorView.rows[0].value;
					
					connectorViewToUpdate.x = currentConnector.getX();
					connectorViewToUpdate.y = currentConnector.getY();
					connectorViewToUpdate.faceIndex = currentConnector.faceIndex;
					
					couchDBJQuery.couch.db("diagroo").saveDoc(connectorViewToUpdate, {
						success: function(data) {
							console.log("mise à jour des connecteurs");
						},
						error: function(status) {
						}
					});
					
				} else {
					console.log("get connector view error !");
					var newConnectorView = new ConnectorView(layerId, viewId, currentConnector.getX(), currentConnector.getY(), currentConnector.faceIndex, currentConnector.getId());
					couchDBJQuery.couch.db("diagroo").saveDoc(newConnectorView, {
						success: function(data) {
						},
						error: function(status) {
						}
					});
				}
			}
		}
	}
	for (var i = 0; i < connections.getSize(); i++) {
		var currentConnection = connections.get(i);
		console.log(currentConnection._id);
		/* search draw2DConnection */
		var currentDraw2DConnection = null;
		for (var j = 0; j < draw2DConnections.getSize(); j++) {
			currentDraw2DConnection = draw2DConnections.get(i);
			if (currentDraw2DConnection.getId() == currentConnection._id) {
				break; // on sort de la boucle
			}
		}
		console.assert(currentConnection._id === currentDraw2DConnection.getId()); // il faut que les deux correspondent
		/* ended */
		var connectionView = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/_design/view/_view/getConnectionView', {'key': '["'+layerId+'","'+viewId+'","'+currentConnection._id+'"]'}).responseText);
		if (connectionView.rows.length == 0) {
			// layerId, vertices, connectionId
			// var newConnectionView = new ConnectionView(layerId, viewId, [], currentConnection._id);
			var points = new Array();
			var verticies = currentDraw2DConnection.getVertices();
			for (var j = 0; j < verticies.getSize(); j++) {
				var vertice = verticies.get(j);
				console.log(vertice);
				points.push({"x": vertice.getX(), "y": vertice.getY()});
			}
			console.log(points.length);
			updateVertices(points, currentDraw2DConnection);
			var newConnectionView = new ConnectionView(layerId, viewId, points, currentConnection._id);
			
			couchDBJQuery.couch.db("diagroo").saveDoc(newConnectionView, {
				success: function(data) {
				},
				error: function(status) {
				}
			});
		} else {
			// mise à jour
			console.log("mise à jours des connections");
			var connectionViewToUpdate = connectionView.rows[0].value;
			console.log(connectionViewToUpdate);
			// mettre à jour les vertices
			var points = new Array();
			var verticies = currentDraw2DConnection.getVertices();
			for (var j = 0; j < verticies.getSize(); j++) {
				var vertice = verticies.get(j);
				console.log(vertice);
				points.push({"x": vertice.getX(), "y": vertice.getY()});
			}
			updateVertices(points, currentDraw2DConnection);
			connectionViewToUpdate.vertices = points;
			console.log(points.length);
			couchDBJQuery.couch.db("diagroo").saveDoc(connectionViewToUpdate, {
				success: function(data) {
				},
				error: function(status) {
				}
			});
		}
	}
}

function updateVertices(vertices, draw2DConnection) {
	var targetPort = draw2DConnection.getTarget();
	var sourcePort = draw2DConnection.getSource();
	var targetConnector = targetPort.getParent();
	var sourceConnector = sourcePort.getParent();
	var targetItem = targetConnector.getParent();
	var sourceItem = sourceConnector.getParent();
	var length = vertices.length;
	
	switch (sourceConnector.faceIndex) {
		case 0: // n
			vertices[0].y += 30;
			break;
		case 1: // s
			vertices[0].y -= 30;
			break;
		case 2: // e
			vertices[0].x += 30;
			break;
		case 3: // w
			vertices[0].x -= 30;
			break;
	}
	switch (targetConnector.faceIndex) {
		case 0: // n
			vertices[length - 1].y += 30;
			break;
		case 1: // s
			vertices[length - 1].y -= 30;
			break;
		case 2: // e
			vertices[length - 1].x += 30;
			break;
		case 3: // w
			vertices[length - 1].x -= 30;
			break;
	}
	/*
	vertices[0].x = sourceItem.getX();
	vertices[0].y = sourceItem.getY();
	vertices[length - 1].x = targetItem.getX();
	vertices[length - 1].y = targetItem.getY();
	switch (sourceConnector.faceIndex) {
		case 0: // n
			vertices[0].y -= sourceItem.getHeight() / 2;
			break;
		case 1: // s
			vertices[0].y += sourceItem.getHeight() / 2;
			break;
		case 2: // e
			vertices[0].x -= sourceItem.getWidth() / 2;
			break;
		case 3: // w
			vertices[0].x += sourceItem.getWidth() / 2;
			break;
	}
	switch (targetConnector.faceIndex) {
		case 0: // n
			vertices[length - 1].y -= targetItem.getHeight() / 2;
			break;
		case 1: // s
			vertices[length - 1].y += targetItem.getHeight() / 2;
			break;
		case 2: // e
			vertices[length - 1].x -= targetItem.getWidth() / 2;
			break;
		case 3: // w
			vertices[length - 1].x -= targetItem.getWidth() / 2;
			break;
	}
	if (length > 2) {
		vertices[1].y = vertices[0].y;
		vertices[length - 2].y = vertices[length - 1].y;
	}
	*/
	/*
	if (length > 2) {
		if ((vertices[0].x != vertices[1].x) && (vertices[0].y != vertices[1].y)) {
			if (vertices[1].x > vertices[0].x) vertices[1].x = vertices[0].x;
		}
	}
	/*
	/*
	if (length > 2) {
		if ((vertices[0].x != vertices[1].x) && (vertices[0].y != vertices[1].y)) { // correction !
			if (Math.abs(vertices[0].x - vertices[1].x) > Math.abs(vertices[0].y - vertices[1].y)) {
				vertices[1].x = vertices[0].x;
			} else {
				vertices[1].y = vertices[0].y;
			}
		}
		if ((vertices[length - 1].x != vertices[length - 2].x) && (vertices[length - 1].y != vertices[length - 2].y)) { // correction !
			if (Math.abs(vertices[length - 1].x - vertices[length - 2].x) > Math.abs(vertices[length - 1].y - vertices[length - 2].y)) {
				vertices[length - 2].x = vertices[length - 1].x;
			} else {
				vertices[length - 2].y = vertices[length - 1].y;
			}
		}
	}
	*/
	/*
	if (length > 3) {
		var p0x = vertices[0].x;
		var p0y = vertices[0].y;
		var p1x = vertices[1].x;
		var p1y = vertices[1].y;
		if (p0x === p1x) {
			vertices[1].x = vertices[0].x;
		} else if (p0y === p1y) {
			vertices[1].y = vertices[0].y;
		}
		p0x = vertices[length - 1].x;
		p0y = vertices[length - 1].y;
		p1x = vertices[length - 2].x;
		p1y = vertices[length - 2].y;
		if (p0x === p1x) {
			vertices[length - 2].x = vertices[length - 1].x;
		} else if (p0y === p1y){
			vertices[length - 2].y = vertices[length - 1].y;
		}
	}
	else if (length === 3) {
		var p0x = vertices[0].x;
		var p0y = vertices[0].y;
		var p1x = vertices[1].x;
		var p1y = vertices[1].y;
		if (p0x === p1x) {
			vertices[1].x = vertices[0].x;
			vertices[1].y = vertices[2].y;
		} else {
			vertices[1].x = vertices[2].x;
			vertices[1].y = vertices[0].y;
		}
	}
	*/
}
