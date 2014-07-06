
function deleteConnector(connector, item, canvas, connections, draw2DConnections, deleteOnDatabase) {
	$.ajaxSetup({async:false});
	var documentsToDelete = new Array();
	var otherConnectorsToDelete = new Array();
	var draw2DConnectorId = connector.getId();
	documentsToDelete.push(draw2DConnectorId);
	var allDraw2DConnections = connector.getConnections();
	for (var i = 0; i < allDraw2DConnections.getSize(); i++) {
		var draw2DConnection = allDraw2DConnections.get(i);
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
		removeConnectionToCanvas(draw2DConnection, canvas, connections, draw2DConnections);
		item.removeConnector(draw2DConnectorId);
		if (removeConnectorToCanvas(otherDraw2DConnectorId, items)) {
			documentsToDelete.push(draw2DConnectionId);
			// documentsToDelete.push(otherDraw2DConnectorId);
			otherConnectorsToDelete.push(otherDraw2DConnectorId + ";" + otherDraw2DConnectorType); // traitement spécial => suppression à la fin et seulement si aucune connections sont connecté à ce connecteur
		} else {
			documentsToDelete.push(draw2DConnectionId);
		}
	}
	if (deleteOnDatabase) {
		// on récupère les autres connections sur la base de données
		switch (connector.type) {
			case "output":
				var allConnections = JSON.parse($.get(mainURL+'/diagroo/_design/connection/_view/getConnectionByOutputConnector', {'key': '"' + connector.getId() + '"'}).responseText).rows;
					for (var j = 0; j < allConnections.length; j++) {
					var connection = allConnections[j].value;
					documentsToDelete.push(connection._id);
					var otherConnector = JSON.parse($.get(mainURL+'/diagroo/' + connection.inputConnectorId).responseText);
					otherConnectorsToDelete.push(otherConnector._id + ";" + otherConnector.portType);
				}
				break;
			case "input":
				var allConnections = JSON.parse($.get(mainURL+'/diagroo/_design/connection/_view/getConnectionByInputConnector', {'key': '"' + connector.getId() + '"'}).responseText).rows;
				for (var j = 0; j < allConnections.length; j++) {
					var connection = allConnections[j].value;
					documentsToDelete.push(connection._id);
					var otherConnector = JSON.parse($.get(mainURL+'/diagroo/' + connection.outputConnectorId).responseText);
					otherConnectorsToDelete.push(otherConnector._id + ";" + otherConnector.portType);
				}
				break;
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
					var allConnections = JSON.parse($.get(mainURL+'/diagroo/_design/connection/_view/getConnectionByOutputConnector', {'key': '"' + connectorId + '"'}).responseText).rows;
					if (allConnections.length == 0) {
						deleteDocument(connectorId);
					}
					break;
				case "input":
					var allConnections = JSON.parse($.get(mainURL+'/diagroo/_design/connection/_view/getConnectionByInputConnector', {'key': '"' + connectorId + '"'}).responseText).rows;
					if (allConnections.length == 0) {
						deleteDocument(connectorId);
					}
					break;
			}
		}
	}
}