
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
		
		this.northPort = new draw2d.InputPort('northPort');
		this.southPort = new draw2d.InputPort('southPort');
		this.westPort = new draw2d.InputPort('westPort');
		this.eastPort = new draw2d.InputPort('eastPort');
		this.addPort(this.northPort, new draw2d.layout.locator.XYAbsPortLocator(this.getWidth() / 2, 10));
		this.addPort(this.southPort, new draw2d.layout.locator.XYAbsPortLocator(this.getWidth() / 2, this.getHeight() - 10));
		this.addPort(this.westPort, new draw2d.layout.locator.XYAbsPortLocator(10, this.getHeight() / 2));
		this.addPort(this.eastPort, new draw2d.layout.locator.XYAbsPortLocator(this.getWidth() - 10, this.getHeight() / 2));
	},
	
	onNewEventForDiagroo: function(relatedPort, oldX, oldY) {
		console.log("[Draw2DItem.js] onNewEventDiagroo");
		if (relatedPort.name == "northPort") {
			var newItem = new Draw2DItem(100, 100, "Item");
			items.add(newItem);
			canvas.addFigure(newItem, oldX - 50, oldY - 50);
			
			var connectorA = this.createConnector(0);
			var connectorB = newItem.createConnector(1);
			
			this.updateLayout();
			newItem.updateLayout();
			
			var portA = connectorA.createPort(0);
			var portB = connectorB.createPort(1);
			
			var c = new Draw2DConnection();
			c.setSource(portA);
			c.setTarget(portB);
			connections.add(c);
			canvas.addFigure(c);
		} else if (relatedPort.name == "southPort") {
		} else if (relatedPort.name == "westPort") {
		} else if (relatedPort.name == "eastPort") {
		}
	},
	
	getText: function() {
		return this.label.getText();
	},
	
	setText: function(text) {
		this.label.setText(text);
	},
	
	onContextMenu: function(x, y) {
		contextMenuItem(this, x, y);
	},
	
	onDoubleClick: function() {
	},
	
	createConnector: function(faceIndex) {
		var locator = new draw2d.layout.locator.XYAbsPortLocator(0, 0);
		
		switch (faceIndex) {
			case 0:
				var connector = new Draw2DConnector(this.connectorHeight, this.connectorWidth, "c", locator, 0);
				this.addFigure(connector, locator);
				this.connectors.add(connector);
				this.connectorsN.add(connector);
				return connector;
				break;
			case 1:
				var connector = new Draw2DConnector(this.connectorHeight, this.connectorWidth, "c", locator, 1);
				this.addFigure(connector, locator);
				this.connectors.add(connector);
				this.connectorsS.add(connector);
				return connector;
				break;
			case 2:
				var connector = new Draw2DConnector(this.connectorWidth, this.connectorHeight, "c", locator, 2);
				this.addFigure(connector, locator);
				this.connectors.add(connector);
				this.connectorsE.add(connector);
				return connector;
				break;
			case 3:
				var connector = new Draw2DConnector(this.connectorWidth, this.connectorHeight, "c", locator, 3);
				this.addFigure(connector, locator);
				this.connectors.add(connector);
				this.connectorsW.add(connector);
				return connector;
				break;
			default:
				break;
		}
	},
	
	addConnector: function(connector) {
		
		switch (connector.faceIndex) {
			case 0:
				this.addFigure(connector, connector.locator);
				this.connectors.add(connector);
				this.connectorsN.add(connector);
				break;
			case 1:
				this.addFigure(connector, connector.locator);
				this.connectors.add(connector);
				this.connectorsS.add(connector);
				break;
			case 2:
				this.addFigure(connector, connector.locator);
				this.connectors.add(connector);
				this.connectorsE.add(connector);
				break;
			case 3:
				this.addFigure(connector, connector.locator);
				this.connectors.add(connector);
				this.connectorsW.add(connector);
				break;
			default:
				break;
		}
		
		this.updateLayout();
		
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