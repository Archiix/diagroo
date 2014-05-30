
var Draw2DItem = draw2d.shape.basic.Rectangle.extend({
	init: function(width, height, text) {
		this._super(width, height);
		
		// Set style from Styles.js
		this.setRadius(Styles.Radius);
		this.setColor(Styles.Color);
		this.setBackgroundColor(Styles.BackgroundColor);
		this.setStroke(Styles.Stroke);
		this.setAlpha(Styles.Alpha);
		
		this.label = new draw2d.shape.basic.Label(text);
		this.label.setColor("#000");
		this.label.setFontColor("#000");
		this.label.installEditor(new draw2d.ui.LabelInplaceEditor());
		// this.label.onMouseEnter = function() {this.mouseEntered()};
		// this.label.onMouseLeave = function() {};
		
		this.addFigure(this.label, new draw2d.layout.locator.CenterLocator(this));
		
		this.connectors = new draw2d.util.ArrayList();
		
		this.connectorsN = new draw2d.util.ArrayList(); // connectors to the north face
		this.connectorsS = new draw2d.util.ArrayList(); // connectors to the south face
		this.connectorsE = new draw2d.util.ArrayList(); // connectors to the east face
		this.connectorsW = new draw2d.util.ArrayList(); // connectors to the west face
		
		this.minWidth = 100;
		this.minHeight = 100;
		
		this.connectorWidth = 30;
		this.connectorHeight = 16;
		
		this.minSpace = 10;
		
		this.setMinWidth(this.minWidth);
		this.setMinHeight(this.minHeight);
		
		this.setResizeable(false);
		
		var currentItem = this;
		
		this.northPort = new draw2d.InputPort('northPort');
		this.northPort.onContextMenu = function() {
			contextMenuItem(currentItem, 0, 0, 0);
		};
		// this.northPort.onMouseEnter = function() {this.mouseEntered();};
		// this.northPort.onMouseLeave = function() {};
		this.southPort = new draw2d.InputPort('southPort');
		this.southPort.onContextMenu = function() {
			contextMenuItem(currentItem, 0, 0, 1);
		};
		// this.southPort.onMouseEnter = function() {this.mouseEntered();};
		// this.southPort.onMouseLeave = function() {};
		this.westPort = new draw2d.InputPort('westPort');
		this.westPort.onContextMenu = function() {
			contextMenuItem(currentItem, 0, 0, 2);
		};
		// this.westPort.onMouseEnter = function() {this.mouseEntered();};
		// this.westPort.onMouseLeave = function() {};
		this.eastPort = new draw2d.InputPort('eastPort');
		this.eastPort.onContextMenu = function() {
			contextMenuItem(currentItem, 0, 0, 3);
		};
		// this.eastPort.onMouseEnter = function() {this.mouseEntered();};
		// this.eastPort.onMouseLeave = function() {};

		this.addPort(this.northPort, new draw2d.layout.locator.XYAbsPortLocator(this.getWidth() / 2, 10));
		this.addPort(this.southPort, new draw2d.layout.locator.XYAbsPortLocator(this.getWidth() / 2, this.getHeight() - 10));
		this.addPort(this.westPort, new draw2d.layout.locator.XYAbsPortLocator(10, this.getHeight() / 2));
		this.addPort(this.eastPort, new draw2d.layout.locator.XYAbsPortLocator(this.getWidth() - 10, this.getHeight() / 2));
		
		this.tooltip = null;
	},
	
	onDoubleClick: function() {
		console.log("[Draw2DItem.js] Draw2DItem ID = " + this.getId());
	},
	
	onNewEventForDiagroo: function(relatedPort, oldX, oldY) {
		console.log("[Draw2DItem.js] onNewEventDiagroo");
		// 0 North
		// 1 South
		// 2 East
		// 3 West
		if (relatedPort.name == "northPort") {
			this.addNewItem(oldX, oldY, 0, 1);
		} else if (relatedPort.name == "southPort") {
			this.addNewItem(oldX, oldY, 1, 0);
		} else if (relatedPort.name == "westPort") {
			this.addNewItem(oldX, oldY, 2, 3);
		} else if (relatedPort.name == "eastPort") {
			this.addNewItem(oldX, oldY, 3, 2);
		}
	},
	
	searchConnectorById: function(connectorId) {
		for (var i = 0; i < this.connectors.getSize(); i++) {
			var connector = this.connectors.get(i);
			console.log("[searchConnectorById] " + connector.getId());
			if (connector.getId() == connectorId) {
				return connector;
			}
		}
		return false;
	},
	
	addNewItem: function(x, y, indexFaceA, indexFaceB) {
		var newItem = new Draw2DItem(100, 100, "Item");
		items.add(newItem);
		canvas.addFigure(newItem, x - 50, y - 50);
		
		var connectorA = this.createConnector(indexFaceA); // output connector
		var connectorB = newItem.createConnector(indexFaceB); // input connector
		
		// this.updateLayout();
		// newItem.updateLayout();
		
		var portA = connectorA.createPort(1);
		var portB = connectorB.createPort(0);
		
		var c = new Draw2DConnection();
		c.setSource(portA);
		c.setTarget(portB);
		c.setTargetDecorator(new draw2d.decoration.connection.ArrowDecorator());
		canvas.addFigure(c);
				
		// var newConnection = new Connection(c.id, connectorA.id, connectorB.id); => Warning: inversion
		var newConnection = new Connection(c.id, connectorB.id, connectorA.id);
		connections.add(newConnection);
		
		this.repaint();
		newItem.repaint();
	},
	
	mouseEntered: function() {
		this.northPort.setVisible(true);
		this.southPort.setVisible(true);
		this.eastPort.setVisible(true);
		this.westPort.setVisible(true);
	},
	
	mouseLeaved: function() {
		this.northPort.setVisible(false);
		this.southPort.setVisible(false);
		this.eastPort.setVisible(false);
		this.westPort.setVisible(false);
	},
	
	removeAllConnections: function() {
		for (var i = 0; i < this.connectors.getSize(); i++) {
			var c = this.connectors.get(i);
			var portsList = c.getPorts();
			for (var j = 0; j < portsList.getSize(); j++) {
				var p = portsList.get(j);
				c.removePort(p);
			}
		}
	},
	
	removeConnector: function(connectorId) {
		for (var i = 0; i < this.connectors.getSize(); i++) {
			var connector = this.connectors.get(i);
			if (connector.getId() == connectorId) {
				this.removeFigure(connector);
				
				this.connectors.remove(connector);
				
				this.connectorsN.remove(connector);
				this.connectorsS.remove(connector);
				this.connectorsW.remove(connector);
				this.connectorsE.remove(connector);
				break;
			}
		}
	},
	
	onMouseEnter: function() {
		// this.mouseEntered();
	},
	
	onMouseLeave: function() {
		// this.mouseLeaved();
	},
	
	getText: function() {
		return this.label.getText();
	},
	
	setText: function(text) {
		this.label.setText(text);
	},
	
	onContextMenu: function(x, y) {
		var currentItem = this;
		
		$.contextMenu({
			selector: 'body',
			build: function($trigger, e) {
				return {
					callback: function(key, options) {
						switch(key) {
							case "delete":
								console.log("delete");
								var documentsToDeleted = new draw2d.util.ArrayList();
								itemId = currentItem.getId();
								documentsToDeleted.add(itemId);
								// currentItem.getCanvas().removeFigure(currentItem);
								console.log("deleting an item");
								$.ajaxSetup({async:false});
								var response = $.get('https://diagroo.couchappy.com/diagroo/' + itemId);
								if (response.statusText == "OK") {
									var connectors = currentItem.connectors;
									/* *** */
									// Others connectors into data base ?
									var itemsNotDisplayed = new draw2d.util.ArrayList(); // des ids
									var connectorsIntoDB = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/_design/connector/_view/getConnectorsByItem', {'key': '"' + itemId + '"'}).responseText).rows;
									for (var i = 0; i < connectorsIntoDB.length; i++) {
										var connectorIntoDB = connectorsIntoDB[i].value; // connectorIntoDB._id | connectorIntoDB.type
										console.log("connector into db id = " + connectorIntoDB._id);
										console.log("connector into db type = " + connectorIntoDB.portType);
										var isDisplayed = false;
										for (var j = 0; j < connectors.getSize(); j++) {
											if (connectors.get(j).getId() == connectorIntoDB._id) {
												isDisplayed = true;
												break;
											}
										}
										if (!isDisplayed) {
											itemsNotDisplayed.add(connectorIntoDB._id);
											if (connectorIntoDB.portType == "input") { // input connector
												var connection = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/_design/connection/_view/getConnectionByInputConnector', {'key': '"' + connectorIntoDB._id + '"'}).responseText).rows[0].value;
												var outputConnector = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/' + connection.outputConnectorId).responseText);
												itemsNotDisplayed.add(connection._id);
												itemsNotDisplayed.add(outputConnector._id);
											} else { // output connector
												var connection = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/_design/connection/_view/getConnectionByOutputConnector', {'key': '"' + connectorIntoDB._id + '"'}).responseText).rows[0].value;
												var inputConnector = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/' + connection.inputConnectorId).responseText);
												itemsNotDisplayed.add(connection._id);
												itemsNotDisplayed.add(inputConnector._id);
											}
										}
									}
									console.log("items not displayed length = " + itemsNotDisplayed.getSize());
									/* *** */
									console.log("connectors size = " + connectors.getSize());
									for (var i = 0; i < connectors.getSize(); i++) {
										console.log("i = " + i);
										var connector = connectors.get(i);
										console.log("connector = " + connector.getId());
										connector.removePort(connector.getPorts().get(0));
										documentsToDeleted.add(connector.getId());
										if (connector.portType == "input") {
												var connection = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/_design/connection/_view/getConnectionByInputConnector', {'key': '"' + connector.getId() + '"'}).responseText).rows[0].value;
												console.log(connection);
												documentsToDeleted.add(connection._id);
												// get output connector
												// var outputConnector = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/' + connection.inputConnectorId).responseText)
												var outputConnector = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/' + connection.outputConnectorId).responseText);
												console.log(outputConnector);
												
												var outputConnectorId = outputConnector._id;
												var otherItemId = outputConnector.itemId;
												documentsToDeleted.add(outputConnectorId);
												// delete the connector on the canvas
												// ...
												for (var j = 0; j < items.getSize(); j++) {
													items.get(j).removeConnector(outputConnectorId);
												}
										} else {
												var connection = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/_design/connection/_view/getConnectionByOutputConnector', {'key': '"' + connector.getId() + '"'}).responseText).rows[0].value;
												console.log(connection);
												documentsToDeleted.add(connection._id);
												// get input connector
												// var inputConnector = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/' + connection.outputConnectorId).responseText);
												var inputConnector = JSON.parse($.get('https://diagroo.couchappy.com/diagroo/' + connection.inputConnectorId).responseText);
												console.log(inputConnector);
												
												var inputConnectorId = inputConnector._id;
												var otherItemId = inputConnector.itemId;
												documentsToDeleted.add(inputConnectorId);
												// delete the connector on the canvas
												// ...
												for (var j = 0; j < items.getSize(); j++) {
													items.get(j).removeConnector(inputConnectorId);
												}
										}
									}
								}
								currentItem.getCanvas().removeFigure(currentItem);
								console.log("documentsToDeleted size: " + documentsToDeleted.getSize());
								var answer = confirm("Delete into data base ?");
								if (answer) {
									documentsToDeleted.addAll(itemsNotDisplayed);
									for (var i = 0; i < documentsToDeleted.getSize(); i++) {
										var documentId = documentsToDeleted.get(i);
										console.log("id document = " + documentId);
										couchDBJQuery.couch.db("diagroo").openDoc(documentId, {
											success: function(data) {
												console.log(data);
												var docToDelete = {
													_id: data._id,
													_rev: data._rev
												};
												couchDBJQuery.couch.db("diagroo").removeDoc(docToDelete, {
													success: function(data) {
														console.log("success to delete document!");
														console.log(data);
													},
													error: function(status) {
													}
												});
											},
											error: function(status) {
											}
										});
									}
								}
								break;
						}
					},
					items: {
						"delete": {name: "Delete", icon: ""}
					}
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
	},
	
	createConnector: function(faceIndex) {
		var locator = new draw2d.layout.locator.XYAbsPortLocator(0, 0);
		
		switch (faceIndex) {
			case 0:
				var connector = new Draw2DConnector(this.connectorHeight, this.connectorWidth, "c", locator, 0);
				this.addFigure(connector, locator);
				this.connectors.add(connector);
				this.connectorsN.add(connector);
				
				locator.x = (this.getWidth() - connector.getWidth()) / 2;
				locator.y = -connector.getHeight();
				return connector;
				break;
			case 1:
				var connector = new Draw2DConnector(this.connectorHeight, this.connectorWidth, "c", locator, 1);
				this.addFigure(connector, locator);
				this.connectors.add(connector);
				this.connectorsS.add(connector);
				
				locator.x = (this.getWidth() - connector.getWidth()) / 2;
				locator.y = this.getHeight();
				return connector;
				break;
			case 2:
				var connector = new Draw2DConnector(this.connectorWidth, this.connectorHeight, "c", locator, 2);
				this.addFigure(connector, locator);
				this.connectors.add(connector);
				this.connectorsE.add(connector);
				
				locator.x = -30;
				locator.y = (this.getHeight() - connector.getHeight()) / 2;
				return connector;
				break;
			case 3:
				var connector = new Draw2DConnector(this.connectorWidth, this.connectorHeight, "c", locator, 3);
				this.addFigure(connector, locator);
				this.connectors.add(connector);
				this.connectorsW.add(connector);
				
				locator.x = this.getWidth();
				locator.y = (this.getHeight() - connector.getHeight()) / 2;
				return connector;
				break;
			default:
				break;
		}
		
		this.repaint();
	},
	
	addConnector: function(connector) {
		
		switch (connector.faceIndex) {
			case 0:
				connector.locator.x = (this.getWidth() - connector.getWidth()) / 2;
				connector.locator.y = -connector.getHeight();
				
				this.addFigure(connector, connector.locator);
				this.connectors.add(connector);
				this.connectorsN.add(connector);
				break;
			case 1:
				connector.locator.x = (this.getWidth() - connector.getWidth()) / 2;
				connector.locator.y = this.getHeight();
				
				this.addFigure(connector, connector.locator);
				this.connectors.add(connector);
				this.connectorsS.add(connector);
				break;
			case 2:
				connector.locator.x = -30;
				connector.locator.y = (this.getHeight() - connector.getHeight()) / 2;
				
				this.addFigure(connector, connector.locator);
				this.connectors.add(connector);
				this.connectorsE.add(connector);
				break;
			case 3:
				connector.locator.x = this.getWidth();
				connector.locator.y = (this.getHeight() - connector.getHeight()) / 2;
				
				this.addFigure(connector, connector.locator);
				this.connectors.add(connector);
				this.connectorsW.add(connector);
				break;
			default:
				break;
		}
		
		this.repaint();
		
		// this.updateLayout();
	},
	
	updateLayout: function() {
		var maxConnectorsWidth = Math.max(this.connectorsN.getSize(), this.connectorsS.getSize());
		var maxConnectorsHeight = Math.max(this.connectorsE.getSize(), this.connectorsW.getSize());
		
		var widthCalculate = (maxConnectorsWidth * this.connectorHeight) + ((maxConnectorsWidth + 1) * this.minSpace);
		var heightCalculate = (maxConnectorsHeight * this.connectorHeight) + ((maxConnectorsHeight + 1) * this.minSpace);
		
		var space = this.minSpace;
		
		if (widthCalculate > this.minWidth) {
			this.setMinWidth(widthCalculate);
		} else {
			widthCalculate = this.minWidth;
		}
		
		if (heightCalculate > this.minHeight) {
			this.setMinHeight(heightCalculate);
		} else {
			heightCalculate = this.minHeight;
		}
		
		this.setDimension(widthCalculate, heightCalculate);
		
		var xStart = 0;
		var yStart = -(this.connectorWidth);
		for (var i = 0; i < this.connectorsN.getSize(); i++) {
			xStart += space;
			
			var currentConnector = this.connectorsN.get(i);
			currentConnector.getLocator().x = xStart;
			currentConnector.getLocator().y = yStart;
			
			xStart += this.connectorHeight;
		}
		
		xStart = 0;
		yStart = heightCalculate;
		for (var i = 0; i < this.connectorsS.getSize(); i++) {
			xStart += space;
			
			var currentConnector = this.connectorsS.get(i);
			currentConnector.getLocator().x = xStart;
			currentConnector.getLocator().y = yStart;
			
			xStart += this.connectorHeight;
		}
		
		xStart = -(this.connectorWidth);
		yStart = 0;
		for (var i = 0; i < this.connectorsE.getSize(); i++) {
			yStart += space;
			
			var currentConnector = this.connectorsE.get(i);
			currentConnector.getLocator().x = xStart;
			currentConnector.getLocator().y = yStart;
			
			yStart += this.connectorHeight;
		}
		
		xStart = widthCalculate;
		yStart = 0;
		for (var i = 0; i < this.connectorsW.getSize(); i++) {
			yStart += space;
			
			var currentConnector = this.connectorsW.get(i);
			currentConnector.getLocator().x = xStart;
			currentConnector.getLocator().y = yStart;
			
			yStart += this.connectorHeight;
		}
		
		this.repaint();
	}
});