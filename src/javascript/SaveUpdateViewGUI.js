
function saveUpdateView(viewName, items, connections) { // items ==> Draw2DItem object, connections ==> Connection object
	$.ajaxSetup({async:false});
	
	for (var i = 0; i < items.getSize(); i++) {
		console.log("item i index ID = " + items.get(i).getId());
	}
	/* *************************************************************************************************************** */
	// sauvergarder + mettre � jours les blocs
	for (var i = 0; i < items.getSize(); i++) {
		var currentItem = items.get(i);
		var itemId = currentItem.getId();
		console.log(itemId);
		// est ce que l'itemView existe d�j�
		
		var itemView = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/_design/view/_view/itemViewIsExisting', {'key': '"[' + viewName + ', ' + itemId + ']"'}).responseText);
		if (itemView.rows.length == 0) {
			// viewName, x, y, itemId
			var newItemView = new ItemView(viewName, currentItem.getX(), currentItem.getY(), itemId);
			
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
				// viewName, x, y, faceIndex, connectorId
				var newConnectorView = new ConnectorView(viewName, currentConnector.getX(), currentConnector.getY(), currentConnector.faceIndex, currentConnector.getId());
				
				couchDBJQuery.couch.db("diagroo").saveDoc(newConnectorView, {
					success: function(data) { // saved !
					},
					error: function(status) {
					}
				});
				
				// $.post('https://diagroo.couchappy.com/diagroo', JSON.stringify(newConnectorView));
			}
		} else {
			console.log("mise � jour vue"); // passe pas l� !!!
			
			var itemExisting = itemView.rows[0].value;
			itemExisting.x = currentItem.getX();
			itemExisting.y = currentItem.getY();
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
				var connectorView = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/_design/view/_view/getConnectorView', {'key': '"[' + viewName + ', ' + idConnector + ']"'}).responseText);
				if (connectorView.rows.length > 0) {
					var connectorViewToUpdate = connectorView.rows[0];
					
					connectorViewToUpdate.x = currentConnector.getX();
					connectorViewToUpdate.y = currentConnector.getY();
					connectorViewToUpdate.faceIndex = currentConnector.faceIndex;
					
					couchDBJQuery.couch.db("diagroo").saveDoc(connectorViewToUpdate, {
						success: function(data) {
						},
						error: function(status) {
						}
					});
					
				} else {
					console.log("get connector view error !");
				}
			}
		}
	}
	for (var i = 0; i < connections.getSize(); i++) {
		var currentConnection = connections.get(i);
		// viewName, vertices, connectionId
		var newConnectionView = new ConnectionView(viewName, [], currentConnection.id);
		
		couchDBJQuery.couch.db("diagroo").saveDoc(newConnectionView, {
			success: function(data) {
			},
			error: function(status) {
			}
		});
	}
	/* *************************************************************************************************************** */
}