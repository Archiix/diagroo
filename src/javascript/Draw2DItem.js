
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
		this.label.setStroke(0);
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
		
		// this.setResizeable(false);
		this.setDeleteable(false);
		
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
		
		this.attachMoveListener(this);
		this.attachResizeListener(this);
		
		this.upperLayerItem = null;
	},
	
	setRedBorder: function() {
		this.setAlpha(0.5);
		this.setColor("#f00");
	},
	
	clearBorder: function() {
		this.setAlpha(0.2);
		this.setColor("#000");
	},
	
	/* awesome */
	onOtherFigureIsMoving:function(figure) {
		// console.log(figure.getText());
		this.upperLayerItem = null;
		if (layerMode) { // chercher dans items => List of Draw2DItem
			for (var i = 0; i < items.getSize(); i++) {
				var currentItem = items.get(i);
				currentItem.clearBorder();
			}
			for (var i = 0; i < items.getSize(); i++) {
				var currentItem = items.get(i);
				var x1 = currentItem.getAbsoluteX();
				var y1 = currentItem.getAbsoluteY();
				var x2 = this.getAbsoluteX();
				var y2 = this.getAbsoluteY();
				var w1 = currentItem.getWidth();
				var h1 = currentItem.getHeight();
				if (x2 >= x1 && (x2 <= (x1 + w1)) && y2 >= y1 && (y2 <= (y1 + h1))) {
					this.upperLayerItem = currentItem;
					currentItem.setRedBorder();
					break;
				}
			}
		}
	},
	
	onOtherFigureIsResizing: function(figure) {
		console.log(figure.getText());
		/*
		this.addPort(this.northPort, new draw2d.layout.locator.XYAbsPortLocator(this.getWidth() / 2, 10));
		this.addPort(this.southPort, new draw2d.layout.locator.XYAbsPortLocator(this.getWidth() / 2, this.getHeight() - 10));
		this.addPort(this.westPort, new draw2d.layout.locator.XYAbsPortLocator(10, this.getHeight() / 2));
		this.addPort(this.eastPort, new draw2d.layout.locator.XYAbsPortLocator(this.getWidth() - 10, this.getHeight() / 2));
		*/
		var northPortLocator = this.northPort.getLocator();
		northPortLocator.x = this.getWidth() / 2;
		northPortLocator.y = 10;
		var westPortLocator = this.westPort.getLocator();
		westPortLocator.x = 10;
		westPortLocator.y = this.getHeight() / 2;
		var eastPortLocator = this.eastPort.getLocator();
		eastPortLocator.x = this.getWidth() - 10;
		eastPortLocator.y = this.getHeight() / 2;
		var southPortLocator = this.southPort.getLocator();
		southPortLocator.x = this.getWidth() / 2;
		southPortLocator.y = this.getHeight() - 10;
		for (var i = 0; i < this.connectors.getSize(); i++) {
			var c = this.connectors.get(i);
			var locator = c.getLocator();
			switch (c.faceIndex) {
				case 1:
					locator.y = this.getHeight();
					break;
				case 3:
					locator.x = this.getWidth();
					break;
				default:
					break;
			}
			this.repaint();
		}
	},
	
	setLayerStyle: function() {
		console.log("[Draw2DItem] setLayerStyle");
		var alpha = 0.1;
		this.setAlpha(alpha);
		this.label.setAlpha(alpha);
		for (var i = 0; i < this.connectors.getSize(); i++) {
			this.connectors.get(i).setAlpha(alpha);
		}
		/*
		this.northPort.setAlpha(0.5);
		this.southPort.setAlpha(0.5);
		this.westPort.setAlpha(0.5);
		this.eastPort.setAlpha(0.5);
		*/
		this.northPort.setVisible(false);
		this.southPort.setVisible(false);
		this.westPort.setVisible(false);
		this.eastPort.setVisible(false);
		this.setDraggable(false);
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
			// console.log("[searchConnectorById] " + connector.getId());
			if (connector.getId() == connectorId) {
				return connector;
			}
		}
		return false;
	},
	
	addNewItem: function(x, y, indexFaceA, indexFaceB) {
		// var connectorA = this.createConnector(indexFaceA); // output connector
		// var portA = connectorA.createPort(1); // output port
		var connectorA = null;
		var portA = null;
		var connectorB = null; // input connector
		var portB = null; // input port
		
		var bestFigure = canvas.getBestFigure(x, y);
		if (bestFigure != null) {
			if (bestFigure instanceof draw2d.shape.basic.Label) {
				bestFigure = bestFigure.getParent();
			}
			if (bestFigure instanceof Draw2DItem) {
				connectorA = this.createConnector(indexFaceA);
				portA = connectorA.createPort(1);
				connectorB = bestFigure.createConnector(indexFaceB);
				portB = connectorB.createPort(0);
				
				this.repaint();
				bestFigure.repaint();
			} else if (bestFigure instanceof Draw2DConnector) {
				if (bestFigure.type == "input") {
					connectorA = this.createConnector(indexFaceA);
					portA = connectorA.createPort(1);
					connectorB = bestFigure;
					portB = connectorB.getPorts().get(0);
					
					this.repaint();
					bestFigure.getParent().repaint();
				} else {
					alert("Only input port !");
					// on ne créer pas la connection
					return;
				}
			} else {
				alert("Only input port !");
				// On ne créer pas la connection
				return;
			}
		} else {
			var newItem = new Draw2DItem(100, 100, "Item");
			items.add(newItem);
			canvas.addFigure(newItem, x - 50, y - 50);
			
			connectorA = this.createConnector(indexFaceA);
			portA = connectorA.createPort(1);
			connectorB = newItem.createConnector(indexFaceB); // input connector
			portB = connectorB.createPort(0); // input port
			
			this.repaint();
			newItem.repaint();
		}
		
		var c = new Draw2DConnection();
		c.setSource(portA);
		c.setTarget(portB);
		c.setTargetDecorator(new draw2d.decoration.connection.ArrowDecorator());
		canvas.addFigure(c);
		
		var layerId = $("#layersSelect option:first").val(); // get the current layer first by the user
		var newConnection = new Connection(c.id, connectorB.id, connectorA.id, layerId, c.getText());
		connections.add(newConnection);
		draw2DConnections.add(c);
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
				if (connector.getConnections().getSize() == 0) { // seulement si il n'y plus de connection
					this.removeFigure(connector); // on supprime le connecteur du canvas
					this.connectors.remove(connector); // on supprime le connecteur de la liste interne de Draw2DItem
					return true;
					// connector.removePort(connector.getPorts().get(0)); // on supprime les connections de ce connecteur sur le canvas
					// mettre à jour les connections et draw2DConnections liste
					// TODO ...
					/*
					this.connectorsN.remove(connector);
					this.connectorsS.remove(connector);
					this.connectorsW.remove(connector);
					this.connectorsE.remove(connector);
					*/
				}
				//break;
			}
		}
		return false;
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
							case "removeFromView":
								deleteItem(currentItem, canvas, items, connections, draw2DConnections, false);
								break;
							case "remove":
								var result = confirm("Remove permanently ?");
								if (result) {
									deleteItem(currentItem, canvas, items, connections, draw2DConnections, true);
								}
						}
					},
					items: {
						"removeFromView": {name: "Remove From View", icon: ""},
						"remove": {name: "Remove", icon: ""}
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