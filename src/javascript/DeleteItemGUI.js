
/*
	item => Draw2DItem objects
	items => List of Draw2DItem objects
	connections => List of Connection objects
	draw2DConnections => List of Draw2DConnection objects
*/
function deleteItem(item, canvas, items, connections, draw2DConnections, deleteOnDatabase) {
	/* 1. supprimer l'item du canvas et de la liste => items */
	/* 2. si existe sur la base de données alors supprimer item + connecteur enfant */
	/* 3. supprimer toutes les connections de ses connecteurs */
	/* 4. supprimer les vues correspondante */
	/* 5. voir s'il reste des connections pour les autres connecteurs */
	$.ajaxSetup({async:false});
	var documentsToDelete = new Array();
	var otherConnectorsToDelete = new Array();
	var draw2DItemId = item.getId();
	documentsToDelete.push(draw2DItemId);
	for (var i = item.connectors.getSize() - 1; i >= 0; i--) {
		console.log("i = " + i);
		var draw2DConnector = item.connectors.get(i);
		var draw2DConnectorId = draw2DConnector.getId();
		documentsToDelete.push(draw2DConnectorId);
		var allDraw2DConnections = draw2DConnector.getConnections();
		for (var j = 0; j < allDraw2DConnections.getSize(); j++) {
			var draw2DConnection = allDraw2DConnections.get(j);
			var draw2DConnectionId = draw2DConnection.getId();
			var sourceConnector = draw2DConnection.getSource().getParent();
			var targetConnector = draw2DConnection.getTarget().getParent();
			var otherDraw2DConnectorId = "";
			var otherDraw2DConnectorType = "";
			if (sourceConnector.getId() == draw2DConnectorId) {
				otherDraw2DConnectorId = targetConnector.getId();
				otherDraw2DConnectorType = targetConnector.type;
			} else {
				otherDraw2DConnectorId = sourceConnector.getId();
				otherDraw2DConnectorType = sourceConnector.type;
			}
			console.log("{\n[Draw2DItem ID] " + draw2DItemId +
					    "\n[Draw2DConnector ID] " + draw2DConnectorId +
						"\n[Draw2DConnection ID] " + draw2DConnectionId +
						"\n[Other Draw2DConnector ID] " + otherDraw2DConnectorId + "\n}");
			
			removeConnectionToCanvas(draw2DConnection, canvas, connections, draw2DConnections);
			removeConnectorToCanvas(draw2DConnectorId, items);
			if (removeConnectorToCanvas(otherDraw2DConnectorId, items)) {
				documentsToDelete.push(draw2DConnectionId);
				// documentsToDelete.push(otherDraw2DConnectorId);
				otherConnectorsToDelete.push(otherDraw2DConnectorId + ";" + otherDraw2DConnectorType); // traitement spécial => suppression à la fin et seulement si aucune connections sont connecté à ce connecteur
			} else {
				documentsToDelete.push(draw2DConnectionId);
			}
		}
	}
	canvas.removeFigure(item);
	items.remove(item);
	if (deleteOnDatabase) {
		// récupérer les autres connecteurs sur la base de données
		// récupérer les autres connections sur la base de données
		// récupérer les autres "other" connectors sur la base de données
		var connectors = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/_design/connector/_view/getConnectorsByItem', {'key': '"' + draw2DItemId + '"'}).responseText).rows;
		for (var i = 0; i < connectors.length; i++) {
			var connector = connectors[i].value;
			documentsToDelete.push(connector._id);
			switch (connector.portType) {
				case "output":
					var allConnections = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/_design/connection/_view/getConnectionByOutputConnector', {'key': '"' + connector._id + '"'}).responseText).rows;
					for (var j = 0; j < allConnections.length; j++) {
						var connection = allConnections[j].value;
						documentsToDelete.push(connection._id);
						var otherConnector = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/' + connection.inputConnectorId).responseText);
						otherConnectorsToDelete.push(otherConnector._id + ";" + otherConnector.portType);
					}
					break;
				case "input":
					var allConnections = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/_design/connection/_view/getConnectionByInputConnector', {'key': '"' + connector._id + '"'}).responseText).rows;
					for (var j = 0; j < allConnections.length; j++) {
						var connection = allConnections[j].value;
						documentsToDelete.push(connection._id);
						var otherConnector = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/' + connection.outputConnectorId).responseText);
						otherConnectorsToDelete.push(otherConnector._id + ";" + otherConnector.portType);
					}
					break;
			}
		}
		var documentsToDelete = documentsToDelete.filter(function(value, index, self) { return self.indexOf(value) === index; }); // permet les id "doublons" dans un tableau
		for (var i = 0; i < documentsToDelete.length; i++) {
			deleteDocument(documentsToDelete[i]);
		}
		// suppression des "other" connectors [otherConnectorsToDelete]
		for (var i = 0; i < otherConnectorsToDelete.length; i++) {
			var params = otherConnectorsToDelete[i].split(";"); // params[0] => connector id, params[1] => connector type
			var connectorId = params[0];
			var connectorType = params[1];
			switch (connectorType) {
				case "output":
					var allConnections = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/_design/connection/_view/getConnectionByOutputConnector', {'key': '"' + connectorId + '"'}).responseText).rows;
					if (allConnections.length == 0) {
						deleteDocument(connectorId);
					}
					break;
				case "input":
					var allConnections = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/_design/connection/_view/getConnectionByInputConnector', {'key': '"' + connectorId + '"'}).responseText).rows;
					if (allConnections.length == 0) {
						deleteDocument(connectorId);
					}
					break;
			}
		}
	}
}

function deleteDocument(documentId) {
	var response = $.get('https://diagroo.couchappy.com/diagroo/' + documentId);
	if (response.statusText === "OK") { // si le document existe sur la base de données
		var document = JSON.parse(response.responseText);
		var views = null;
		switch (document.type) {
			case "item":
				views = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/_design/view/_view/allItemsView', {'key': '"' + document._id + '"'}).responseText);
				break;
			case "connector":
				views = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/_design/view/_view/allConnectorsView', {'key': '"' + document._id + '"'}).responseText);
				break;
			case "connection":
				views = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/_design/view/_view/allConnectionsView', {'key': '"' + document._id + '"'}).responseText);
				break;
		}
		removeSynchronous(document._id, document._rev);
		for (var i = 0; i < views.rows.length; i++) {
			console.log("ça passe la !");
			var view = views.rows[i].value;
			removeSynchronous(view._id, view._rev);
		}
	}
}

function removeConnectorToCanvas(connectorId, items) {
	for (var i = 0; i < items.getSize(); i++) {
		var currentItem = items.get(i);
		var isDeleted = currentItem.removeConnector(connectorId);
		if (isDeleted) {
			return true;
		}
	}
	return false;
}

function removeConnectionToCanvas(draw2DConnection, canvas, connections, draw2DConnections) {
	console.assert(connections.getSize() === draw2DConnections.getSize());
	
	var index = -1;
	for (var i = 0; i < connections.getSize(); i++) {
		if (connections.get(i)._id === draw2DConnection.getId()) {
			index = i;
			break;
		}
	}
	connections.removeElementAt(index);
	index = -1;
	for (var i = 0; i < draw2DConnections.getSize(); i++) {
		if (draw2DConnections.get(i).getId() === draw2DConnection.getId()) {
			index = i;
			break;
		}
	}
	draw2DConnections.removeElementAt(index);
	canvas.removeFigure(draw2DConnection);
}

function removeSynchronous(id, rev) {
	$.ajax({
		url: "https://diagroo.couchappy.com/diagroo/" + id + "?rev=" + rev,
		type: "DELETE",
		async: false,
		success: function(result) {
			console.log("[removeSynchronous] Document ID = " + id + " with REV = " + rev + "deleted on data base.");
		}
	});
}