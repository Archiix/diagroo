
var Draw2DItem = draw2d.shape.basic.Rectangle.extend({
	init: function(width, height, text) {
		this._super(width, height);
		
		this.label = new draw2d.shape.basic.Label(text);
		this.label.setColor("#0d0d0d");
		this.label.setFontColor("#0d0d0d");
		this.label.installEditor(new draw2d.ui.LabelInplaceEditor());
		
		this.addFigure(this.label, new draw2d.layout.locator.CenterLocator(this));
		
		this.connectorsPerFace = 2;
		this.connectorMax = this.connectorsPerFace * 4;
		this.spaceBetweenConnector = 10;
		this.numberOfConnectors = 0;
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
					case "newConnectorStart":
						console.log("New Connector (Start) onContextMenu");
						this.newConnectorStart();
						break;
					case "newConnectorEnd":
						console.log("New Connector (End) onContextMenu");
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
				"newConnectorStart": {name: "New Connector (Start)", icon: ""},
				"newConnectorEnd" : {name: "New Connector (End)", icon: ""},
				"sep1": "---------",
				"delete": {name: "Delete", icon: ""}
			}
		});
	},
	
	newConnectorStart: function() {
		console.log("newConnectorStart callback");
		var connectorStart = new Draw2DConnector(75, 30, "c1");
		this.addFigure(connectorStart, new draw2d.layout.locator.XYAbsPortLocator(0, 0));
		
		var remainder = this.numberOfConnectors % this.connectorsPerFace;
		var indexFace = (this.numberOfConnectors - remainder) / this.connectorsPerFace;
		
		console.log("indexFace: " + indexFace);
		
		this.numberOfConnectors++;
	}
});