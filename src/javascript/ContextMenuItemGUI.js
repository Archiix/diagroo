
// type = Input ou Output
function selectConnectors(itemId, listOfConnectors, listOfOtherConnectors, listOfConnections, listOfOtherItem, listOfActions, type) {
	var connectors = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/_design/connector/_view/get' + type + 'ConnectorsByItem', {'key': '"' + itemId + '"'}).responseText);
	for (var i = 0; i < connectors.rows.length; i++) {
		var connector = connectors.rows[i].value;
		listOfConnectors.push(connector);
		var connections = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/_design/connection/_view/getConnectionBy' + type + 'Connector', {'key': '"' + connector._id + '"'}).responseText);
		for (var j = 0; j < connections.rows.length; j++) {
			var connection = connections.rows[j].value;
			listOfConnections.push(connection);
			var otherConnector = null;
			if (type == "Output") {
				otherConnector = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/' + connection.inputConnectorId).responseText);
			} else {
				otherConnector = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/' + connection.outputConnectorId).responseText);
			}
			listOfOtherConnectors.push(otherConnector);
			var otherItem = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/' + otherConnector.itemId).responseText);
			listOfOtherItem.push(otherItem);
			
			var prefix = type == "Output" ? ";output" : ";input";
			
			var newAction = {}
			newAction[otherItem._id + prefix] = {name: otherItem.text, icon: ""};
			listOfActions.push(newAction);
		}
	}
}

function contextMenuItem(item, x, y, faceIndex) {

	var tempOutputConnectors = new Array();
	var tempConnections = new Array();
	var tempInputConnectors = new Array();
	var tempItems = new Array();
	
	var actions =
	{
		"outputItems" : {name: "Output Items", icon: ""},
		"sep1": "---------"
	};
	
	$.ajaxSetup({async:false});
	
	var outputConnectorsAction = new Array();
	var inputConnectorsAction = new Array();
	
	/*
	var result1 = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/_design/connector/_view/getOutputConnectorsByItem', {'key': '"' + item.getId() + '"'}).responseText);
	console.log(result1);
	if (result1.rows.length != 0) {
		outputConnectors = result1.rows;
		for (var i = 0; i < outputConnectors.length; i++) {
			var outputConnector = outputConnectors[i].value;
			tempOutputConnectors.push(outputConnector);
			var result2 = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/_design/connection/_view/getConnectionByOutputConnector', {'key': '"' + outputConnector._id + '"'}).responseText);
			console.log(result2);
			outputConnections = result2.rows;
			for (var j = 0; j < outputConnections.length; j++) {
				var outputConnection = outputConnections[j].value;
				tempConnections.push(outputConnection);
				var result3 = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/' + outputConnection.inputConnectorId).responseText);
				tempInputConnectors.push(result3);
				var result4 = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/' + result3.itemId).responseText);
				tempItems.push(result4);
				var newAction = {}
				newAction[result4._id] = {name: result4.text, icon: ""};
				// $.extend(actions, newAction);
				outputConnectorsAction.push(newAction);
			}
		}
	}
	*/
	
	selectConnectors(item.getId(), tempOutputConnectors, tempInputConnectors, tempConnections, tempItems, outputConnectorsAction, "Output");
	selectConnectors(item.getId(), tempInputConnectors, tempOutputConnectors, tempConnections, tempItems, inputConnectorsAction, "Input");
	
	for (var i = 0; i < outputConnectorsAction.length; i++) {
		$.extend(actions, outputConnectorsAction[i]);
	}
	
	var title = {}; title["inputItems"] = {name: "Input Items", icon: ""};
	$.extend(actions, title);
	var sep = {}; sep["sep2"] = "---------";
	$.extend(actions, sep);
	
	for (var i = 0; i < inputConnectorsAction.length; i++) {
		$.extend(actions, inputConnectorsAction[i]);
	}
	
	$.contextMenu({
		selector: 'body',
		build: function($trigger, e) {
			return {
				callback: function(key, options) {
					switch(key) {
						case "outputItems":
							console.log("outputItems title");
							break;
						case "inputItems":
							console.log("inputItems title");
							break;
						default:
							var params = key.split(';');
							var otherItemId = params[0];
							var type = params[1];
							console.log(otherItemId);
							console.log(type);
							// return;
							
							console.log('test');
							console.log(tempOutputConnectors);
							console.log(tempConnections);
							console.log(tempInputConnectors);
							console.log(tempItems);
							
							var outputConnector = tempOutputConnectors[0]; // outputConnector (connector item)
							var connection = tempConnections[0];
							var inputConnector = tempInputConnectors[0];   // inputConnector (connector other item)
							var otherItem = tempItems[0];
							
							// key id other item
							
							// search otherItem
							for (var i = 0; i < tempItems.length; i++) {
								if (tempItems[i]._id == otherItemId) {
									otherItem = tempItems[i];
									break;
								}
							}
							if (type == "output") {
								// search inputConnector
								for (var i = 0; i < tempInputConnectors.length; i++) {
									if (tempInputConnectors[i].itemId == otherItemId) {
										inputConnector = tempInputConnectors[i];
										break;
									}
								}
								// search connection
								for (var i = 0; i < tempConnections.length; i++) {
									// if (tempConnections[i].outputConnectorId == inputConnector._id) {
									if (tempConnections[i].inputConnectorId == inputConnector._id) {
										connection = tempConnections[i];
										break;
									}
								}
								// search outputConnector
								for (var i = 0; i < tempOutputConnectors.length; i++) {
									// if (tempOutputConnectors[i]._id == connection.inputConnectorId) {
									if (tempOutputConnectors[i]._id == connection.outputConnectorId) {
										outputConnector = tempOutputConnectors[i];
										break;
									}
								}
							} else { // input
								// search outputConnector
								for (var i = 0; i < tempOutputConnectors.length; i++) {
									if (tempOutputConnectors[i].itemId == otherItemId) {
										outputConnector = tempOutputConnectors[i];
										break;
									}
								}
								// search connection
								for (var i = 0; i < tempConnections.length; i++) {
									// if (tempConnections[i].outputConnectorId == inputConnector._id) {
									if (tempConnections[i].outputConnectorId == outputConnector._id) {
										connection = tempConnections[i];
										break;
									}
								}
								// search outputConnector
								for (var i = 0; i < tempInputConnectors.length; i++) {
									// if (tempOutputConnectors[i]._id == connection.inputConnectorId) {
									if (tempInputConnectors[i]._id == connection.inputConnectorId) {
										inputConnector = tempInputConnectors[i];
										break;
									}
								}
							}
							
							// TODO resolve bug here
							console.log("output connector id " + outputConnector._id);
							console.log("input connector id " + inputConnector._id);
							
							var outputDraw2DConnector = converter.convertConnector(outputConnector, faceIndex);
							var inputDraw2DConnector = converter.convertConnector(inputConnector, faceIndex);
							var draw2DConnection = converter.convertConnection(connection);
							var draw2DOtherItem = converter.convertItem(otherItem);
							
							var itemExisting = itemIsExists(draw2DOtherItem);
							
							if (!itemExisting) {
							
								outputDraw2DConnector.createPort(1); // create output port
								inputDraw2DConnector.createPort(0); // create input port
								
								canvas.addFigure(draw2DOtherItem);
								
								item.addConnector(outputDraw2DConnector);
								draw2DOtherItem.addConnector(inputDraw2DConnector);
								
								// add a connection between item and draw2DOtherItem
								draw2DConnection.setSource(outputDraw2DConnector.getOutputPort(0));
								draw2DConnection.setTarget(inputDraw2DConnector.getInputPort(0));
								draw2DConnection.setTargetDecorator(new draw2d.decoration.connection.ArrowDecorator());
								canvas.addFigure(draw2DConnection);
								
								// add to items list and connections list
								items.add(draw2DOtherItem);
								connections.add(draw2DConnection);
								// addItemVGlobal(draw2DOtherItem);
							
							// already exists
							} else {
								error("Block already exists ! [ID = " + itemExisting.getId() + "]");
								
								outputDraw2DConnector.createPort(1);
								inputDraw2DConnector.createPort(0);
								
								item.addConnector(outputDraw2DConnector);
								itemExisting.addConnector(inputDraw2DConnector);
								
								draw2DConnection.setSource(outputDraw2DConnector.getOutputPort(0));
								draw2DConnection.setTarget(inputDraw2DConnector.getInputPort(0));
								draw2DConnection.setTargetDecorator(new draw2d.decoration.connection.ArrowDecorator());
								
								connections.add(draw2DConnection);
								canvas.addFigure(draw2DConnection);
							}
							
							break;
					}
				},
				items: actions
			}
		},
		x: 0,
		y: 0,
		events: {
			hide: function() {
				$.contextMenu('destroy');
			}
		}
	});
}