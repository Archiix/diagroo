
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
	},
	
	getText: function() {
		return this.label.getText();
	},
	
	setText: function(text) {
		this.label.setText(text);
	},
	
	onContextMenu: function(x, y) {
		$.contextMenu({
			selector: 'body',
			events: {
				hide: function() {
					$.contextMenu('destroy');
				}
			},
			callback: $.proxy(function(key, options) {
				switch(key) {
					case "newConnectorN":
						this.createConnector(0);
						break;
					case "newConnectorS":
						this.createConnector(1);
						break;
					case "newConnectorE":
						this.createConnector(2);
						break;
					case "newConnectorW":
						this.createConnector(3);
						break;
					case "delete":
						this.getCanvas().removeFigure(this);
						break;
					default:
						break;
				}
			}, this),
			x: x,
			y: y,
			items: {
				"newConnectorN": {name: "New Connector (North)", icon: ""},
				"newConnectorS" : {name: "New Connector (South)", icon: ""},
				"newConnectorE" : {name: "New Connector (East)", icon: ""},
				"newConnectorW" : {name: "New Connector (West)", icon: ""},
				"sep1": "---------",
				"delete": {name: "Delete", icon: ""}
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
				break;
			case 1:
				var connector = new Draw2DConnector(this.connectorHeight, this.connectorWidth, "c", locator, 1);
				this.addFigure(connector, locator);
				this.connectors.add(connector);
				this.connectorsS.add(connector);
				break;
			case 2:
				var connector = new Draw2DConnector(this.connectorWidth, this.connectorHeight, "c", locator, 2);
				this.addFigure(connector, locator);
				this.connectors.add(connector);
				this.connectorsE.add(connector);
				break;
			case 3:
				var connector = new Draw2DConnector(this.connectorWidth, this.connectorHeight, "c", locator, 3);
				this.addFigure(connector, locator);
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