
function deleteConnection(connection, canvas, connections, draw2DConnections, deleteOnDatabase) {
	$.ajaxSetup({async:false});
	var documentsToDelete = new Array();
	var connectorsToDelete = new Array();
	documentsToDelete.push(connection.getId());
	var sourceConnector = connection.getSource().getParent();
	var targetConnector = connection.getTarget().getParent();
	var sourceItem = sourceConnector.getParent();
	var targetItem = targetConnector.getParent();
	removeConnectionToCanvas(connection, canvas, connections, draw2DConnections);
	if (sourceItem.removeConnector(sourceConnector.getId())) {
		connectorsToDelete.push(sourceConnector.getId() + ";" + sourceConnector.type);
	}
	if (targetItem.removeConnector(targetConnector.getId())) {
		connectorsToDelete.push(targetConnector.getId() + ";" + targetConnector.type);
	}
	var documentsToDelete = documentsToDelete.filter(function(value, index, self) { return self.indexOf(value) === index; }); // permet les id "doublons" dans un tableau
	var connectorsToDelete = connectorsToDelete.filter(function(value, index, self) { return self.indexOf(value) === index; }); // permet les id "doublons" dans un tableau
	if (deleteOnDatabase) {
		for (var i = 0; i < documentsToDelete.length; i++) {
			deleteDocument(documentsToDelete[i]);
		}
		// suppression des "other" connectors [otherConnectorsToDelete]
		console.log(connectorsToDelete.length);
		for (var i = 0; i < connectorsToDelete.length; i++) {
			var params = connectorsToDelete[i].split(";"); // params[0] => connector id, params[1] => connector type
			var connectorId = params[0];
			var connectorType = params[1];
			console.log(connectorId);
			console.log(connectorType);
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