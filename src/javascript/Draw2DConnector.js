
var Draw2DConnector = draw2d.shape.basic.Rectangle.extend({
	init: function(width, height, text, locator, faceIndex) {
		this._super(width, height);
		
		// Set style from Styles.js
		this.setRadius(Styles.Radius);
		this.setColor(Styles.Color);
		this.setBackgroundColor(Styles.BackgroundColor);
		this.setStroke(Styles.Stroke);
		this.setAlpha(Styles.Alpha);
		
		// Display a text ?
		this.label = new draw2d.shape.basic.Label(text);
		this.label.setColor("#0d0d0d");
		this.label.setFontColor("#0d0d0d");
		this.label.installEditor(new draw2d.ui.LabelInplaceEditor());
		this.label.setStroke(0);
		
		var instance = this;
		
		this.label.onContextMenu = function(x, y) {
			instance.displayContextMenu(0, 0);
		};
		
		this.addFigure(this.label, new draw2d.layout.locator.CenterLocator(this));
		
		this.locator = locator;
		this.port = null;
		this.portLocator = null;
		this.faceIndex = faceIndex;
		this.type = ""; // "input" or "output"
	},
	
	getText: function() {
		return this.label.getText();
	},
	
	setText: function(text) {
		this.label.setText(text);
	},
	
	getLocator: function() {
		return this.locator;
	},
	
	getFaceIndex: function() {
		return this.faceIndex;
	},
	
	displayContextMenu: function(x, y) {
		var currentConnector = this;
		$.contextMenu({
			selector: 'body',
			events: {
				hide: function() {
					$.contextMenu('destroy');
				}
			},
			callback: $.proxy(function(key, options) {
				switch(key) {
					case "removeFromView":
						deleteConnector(currentConnector, currentConnector.getParent(), canvas, connections, draw2DConnections, false);
						break;
					case "remove":
						var result = confirm("Remove permanently ?");
						if (result) {
							deleteConnector(currentConnector, currentConnector.getParent(), canvas, connections, draw2DConnections, true);
						}
						break;
					case "nextFace":
						this.nextFace();
						break;
					default:
						break;
				}
			}, this),
			x: x,
			y: y,
			items: {
				"removeFromView": {name: "Remove From View", icon: ""},
				"remove": {name: "Remove", icon: ""},
				"nextFace": {name: "Next Face", icon: ""}
			}
		});
	},
	
	onContextMenu: function(x, y) {
		this.displayContextMenu(x, y);
	},
	
	nextFace: function() {
		// w, h = 30, 16 or w, h = 16, 30
		// change de face le connecteur 0, 1, 2, 3 | N S E W
		var itemWidth = this.getParent().getWidth();
		var itemHeight = this.getParent().getHeight();
		var connectorWidth = this.getWidth();
		var connectorHeight = this.getHeight();
		
		switch (this.faceIndex) {
			case 0:
				this.faceIndex = 3;
				this.port.getLocator().x = 30;
				this.port.getLocator().y = 8;
				this.setDimension(30, 16);
				this.locator.x = itemWidth;
				this.locator.y = ((itemHeight - connectorHeight) / 2) + connectorHeight / 4;
				break;
			case 1:
				this.faceIndex = 2;
				this.port.getLocator().x = 0;
				this.port.getLocator().y = 8;
				this.setDimension(30, 16);
				this.locator.x = -30;
				this.locator.y = ((itemHeight - connectorHeight) / 2) + connectorHeight / 4;
				break;
			case 2:
				this.faceIndex = 0;
				this.port.getLocator().x = 8;
				this.port.getLocator().y = 0;
				this.setDimension(16, 30);
				this.locator.x = ((itemWidth - connectorWidth) / 2) + connectorWidth / 4;
				this.locator.y = -30;
				break;
			case 3:
				this.faceIndex = 1;
				this.port.getLocator().x = 8;
				this.port.getLocator().y = 30;
				this.setDimension(16, 30);
				this.locator.x = ((itemWidth - connectorWidth) / 2) + connectorWidth / 4;
				this.locator.y = this.getParent().getHeight();
				break;
		}
		this.getParent().repaint();
	},
	
	onDoubleClick: function() {
		this.nextFace();
	},
	
	createPort: function(portType) {
		switch (portType) {
			// input port
			case 0:
				this.type = "input";
				this.port = new draw2d.InputPort();
				this.port.setVisible(false);
				break;
			// output port
			case 1:
				this.type = "output";
				this.port = new draw2d.OutputPort();
				this.port.setVisible(false);
				break;
			default:
				break;
		}
		
		
		switch (this.faceIndex) {
			// North
			case 0:
				var portLocator = new draw2d.layout.locator.XYAbsPortLocator(8, 0);
				this.addPort(this.port);
				this.port.setLocator(portLocator);
				break;
			// South
			case 1:
				var portLocator = new draw2d.layout.locator.XYAbsPortLocator(8, 30);
				this.addPort(this.port);
				this.port.setLocator(portLocator);
				break;
			// East
			case 2:
				var portLocator = new draw2d.layout.locator.XYAbsPortLocator(0, 8);
				this.addPort(this.port);
				this.port.setLocator(portLocator);
				break;
			// West
			case 3:
				var portLocator = new draw2d.layout.locator.XYAbsPortLocator(30, 8);
				this.addPort(this.port);
				this.port.setLocator(portLocator);
				break;
			default:
				break;
		}
		return this.port;
	}
});