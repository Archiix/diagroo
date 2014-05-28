
function loadView(viewName, items, connections, canvas) {
	$.ajaxSetup({async:false});
	
	/* for the items */
	
	var itemsByViewName = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/_design/view/_view/getItemViewByViewName', {'key': '"' + viewName + '"'}).responseText);
	for (var i = 0; i < itemsByViewName.rows.length; i++) {
		var currentItemView = itemsByViewName.rows[i].value;
		
		var x = currentItemView.x;
		var y = currentItemView.y;
		var itemId = currentItemView.itemId;
		
		// get item model
		var currentItemModel = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/' + itemId).responseText);
		
		var text = currentItemModel.text;
		
		var newDraw2DItem = new Draw2DItem(100, 100, text);
		newDraw2DItem.setPosition(x, y);
		newDraw2DItem.setId(itemId);
		
		items.add(newDraw2DItem);
		canvas.addFigure(newDraw2DItem);
	}
	
	/* for the connectors */
	var connectorsByViewName = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/_design/view/_view/getConnectorViewByViewName', {'key': '"' + viewName + '"'}).responseText);
	for (var i = 0; i < connectorsByViewName.rows.length; i++) {
		var currentConnectorView = connectorsByViewName.rows[i].value;
		
		var x = currentConnectorView.x;
		var y = currentConnectorView.y;
		var faceIndex = currentConnectorView.faceIndex;
		var connectorId = currentConnectorView.connectorId;
		var connectorModel = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/' + connectorId).responseText);
		var parentIdItem = connectorModel.itemId;
		
		// chercher le parent concerné par le connecteur (itemParent) => Draw2DItem
		var parentItem = searchDraw2DItemById(items, parentIdItem);
		var newDraw2DConnector = parentItem.createConnector(faceIndex);
		newDraw2DConnector.setId(connectorId);
		
		parentItem.updateLayout();
	}
	
	/* for the connections */
	var connectionsByViewName = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/_design/view/_view/getConnectionViewByViewName', {'key': '"' + viewName + '"'}).responseText);
	for (var i = 0; i < connectionsByViewName.rows.length; i++) {
		var currentConnectionView = connectionsByViewName.rows[i].value;
		var connectionId = currentConnectionView.connectionId;
		var connectionModel = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/' + connectionId).responseText);
		var inputConnectorId = connectionModel.inputConnectorId;
		var outputConnectorId = connectionModel.outputConnectorId;
		// get two connectors
		// Draw2DItem::searchConnectorById(connectorId)
		var outputConnector = searchDraw2DConnectorById(items, outputConnectorId);
		var inputConnector = searchDraw2DConnectorById(items, inputConnectorId);
		
		console.log(inputConnectorId);
		console.log(outputConnectorId);
		console.log(outputConnector);
		console.log(inputConnector);
		
		// create the connection (graphic)
		outputConnector.createPort(1); // create output port
		inputConnector.createPort(0); // create input port
		var newDraw2DConnection = new Draw2DConnection();
		newDraw2DConnection.setId(connectionId);
		newDraw2DConnection.setSource(outputConnector.getOutputPort(0));
		newDraw2DConnection.setTarget(inputConnector.getInputPort(0));
		// id, inputConnectorId, outputConnectorId
		connections.add(new Connection(connectionId, inputConnectorId, outputConnectorId));
		canvas.addFigure(newDraw2DConnection);
		
		outputConnector.repaint();
		inputConnector.repaint();
	}
}

function searchDraw2DConnectorById(listOfItems, idConnector) {
	for (var i = 0; i < listOfItems.getSize(); i++) {
		var item = listOfItems.get(i);
		var result = item.searchConnectorById(idConnector);
		if (result) {
			return result;
		}
	}
	return false;
}

function searchDraw2DItemById(listOfItems, idItem) {
	for (var i = 0; i < listOfItems.getSize(); i++) {
		var item = listOfItems.get(i);
		if (item.getId() == idItem) {
			return item;
		}
	}
	return false;
}