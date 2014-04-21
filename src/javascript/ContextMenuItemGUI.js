
function contextMenuItem(item, x, y) {

	var tempOutputConnectors = new Array();
	var tempConnections = new Array();
	var tempInputConnectors = new Array();
	var tempItems = new Array();
	
	// static actions
	var actions =
	{
		"newConnectorN": {name: "New Connector (North)", icon: ""},
		"newConnectorS" : {name: "New Connector (South)", icon: ""},
		"newConnectorE" : {name: "New Connector (East)", icon: ""},
		"newConnectorW" : {name: "New Connector (West)", icon: ""},
		"sep1": "---------",
		"delete": {name: "Delete", icon: ""}
	};
	
	$.ajaxSetup({async:false});
	var result1 = $.get('https://diagroo.couchappy.com/diagroo/_design/connector/_view/getOutputConnectorsByItem', {'key': '"' + item.getId() + '"'});
	if (JSON.parse(result1.responseText).rows != 0) {
		outputConnectors = result1.responseJSON.rows;
		for (var i = 0; i < outputConnectors.length; i++) {
			var outputConnector = outputConnectors[i].value;
			tempOutputConnectors.push(outputConnector);
			var result2 = $.get('https://diagroo.couchappy.com/diagroo/_design/connection/_view/getConnectionByOutputConnector', {'key': '"' + outputConnector._id + '"'}).responseJSON;
			outputConnections = result2.rows;
			for (var j = 0; j < outputConnections.length; j++) {
				var outputConnection = outputConnections[j].value;
				tempConnections.push(outputConnection);
				var result3 = $.get('https://diagroo.couchappy.com/diagroo/' + outputConnection.outputConnectorId).responseJSON;
				tempInputConnectors.push(result3);
				var result4 = $.get('https://diagroo.couchappy.com/diagroo/' + result3.itemId).responseJSON;
				tempItems.push(result4);
				var newAction = {}
				newAction[result4._id] = {name: result4.text, icon: ""};
				$.extend(actions, newAction);
			}
		}
	}
	/*
	couchDBJQuery.couch.db("diagroo").view("connector/getOutputConnectorsByItem", {
		success: function(data) {
			outputConnectors = data.rows;
			// console.log(item.getId());
			console.log(outputConnectors);
			for (var i = 0; i < outputConnectors.length; i++) {
				var outputConnector = outputConnectors[i].value;
				// console.log(outputConnector._id);
				tempOutputConnectors.push(outputConnector);
				// get connections
				couchDBJQuery.couch.db("diagroo").view("connection/getConnectionByOutputConnector", {
					success: function(data) {
						outputConnections = data.rows;
						// console.log(outputConnections);
						for (var j = 0; j < outputConnections.length; j++) {
							var outputConnection = outputConnections[j].value;
							tempConnections.push(outputConnection);
							// get output connector
							couchDBJQuery.couch.db("diagroo").openDoc(outputConnection.outputConnectorId, {
								success: function(data) {
									tempInputConnectors.push(data);
									// get other item
									couchDBJQuery.couch.db("diagroo").openDoc(data.itemId, {
										success: function(data) {
											// add new actions to context menu
											console.log(data.text);
											tempItems.push(data);
											
											var newAction = {}
											newAction[data._id] = {name: data.text, icon: ""};
											$.extend(actions, newAction);
										},
										error: function(status) {
											console.log(status);
										}
									});
								},
								error: function(status) {
									console.log(status);
								}
							});
						}
					},
					error: function(status) {
						console.log(status);
					},
					key: outputConnector._id
				});
			}
		},
		error: function(status) {
			console.log(status);
		},
		key: item.getId()
	});
	*/
	// end call synchronous
	
	$.contextMenu({
		selector: 'body',
		build: function($trigger, e) {
			return {
				callback: function(key, options) {
					switch(key) {
						case "newConnectorN":
							item.createConnector(0);
							break;
						case "newConnectorS":
							item.createConnector(1);
							break;
						case "newConnectorE":
							item.createConnector(2);
							break;
						case "newConnectorW":
							item.createConnector(3);
							break;
						case "delete":
							item.getCanvas().removeFigure(item);
							break;
						default:
							console.log('test');
							console.log(tempOutputConnectors);
							console.log(tempConnections);
							console.log(tempInputConnectors);
							console.log(tempItems);
							
							var outputConnector = tempOutputConnectors[0];
							var connection = tempConnections[0];
							var inputConnector = tempInputConnectors[0];
							var otherItem = tempItems[0];
							
							// search otherItem
							for (var i = 0; i < tempItems.length; i++) {
								if (tempItems[i]._id == key) {
									otherItem = tempItems[i];
									break;
								}
							}
							// search inputConnector
							for (var i = 0; i < tempInputConnectors.length; i++) {
								if (tempInputConnectors[i].itemId == key) {
									inputConnector = tempInputConnectors[i];
									break;
								}
							}
							// search connection
							for (var i = 0; i < tempConnections.length; i++) {
								if (tempConnections[i].inputConnectorId == key) {
									connection = tempConnections[i];
									break;
								}
							}
							// search outputConnector
							for (var i = 0; i < tempOutputConnectors.length; i++) {
								if (tempOutputConnectors[i] == item._id) {
									outputConnector = tempOutputConnectors[i];
									break;
								}
							}
							
							var outputDraw2DConnector = converter.convertConnector(outputConnector);
							var inputDraw2DConnector = converter.convertConnector(inputConnector);
							var draw2DConnection = converter.convertConnection(connection);
							var draw2DOtherItem = converter.convertItem(otherItem);
							
							outputDraw2DConnector.createPort(1); // create output port
							inputDraw2DConnector.createPort(0); // create input port
							
							canvas.addFigure(draw2DOtherItem);
							
							item.addConnector(outputDraw2DConnector);
							draw2DOtherItem.addConnector(inputDraw2DConnector);
							
							// add a connection between item and draw2DOtherItem
							draw2DConnection.setSource(outputDraw2DConnector.getOutputPort(0));
							draw2DConnection.setTarget(inputDraw2DConnector.getInputPort(0));
							canvas.addFigure(draw2DConnection);
							
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