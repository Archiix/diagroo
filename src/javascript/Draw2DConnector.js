
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
		/*
		this.label = new draw2d.shape.basic.Label(text);
		this.label.setColor("#0d0d0d");
		this.label.setFontColor("#0d0d0d");
		this.label.installEditor(new draw2d.ui.LabelInplaceEditor());
		
		this.addFigure(this.label, new draw2d.layout.locator.CenterLocator(this));
		*/
		
		this.locator = locator;
		this.faceIndex = faceIndex;
		this.type = ""; // "input" or "output"
	},
	
	/*
	getText: function() {
		return this.label.getText();
	},
	
	setText: function(text) {
		this.label.setText(text);
	},
	*/
	
	getLocator: function() {
		return this.locator;
	},
	
	getFaceIndex: function() {
		return this.faceIndex;
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
					case "createInputPort":
						this.createPort(0);
						break;
					case "createOutputPort":
						this.createPort(1);
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
				"createInputPort": {name: "Create Input Port", icon: ""},
				"createOutputPort": {name: "Create Output Port", icon: ""},
				"sep1": "---------",
				"delete": {name: "Delete", icon: ""}
			}
		});
	},
	
	onDoubleClick: function() {
	},
	
	createPort: function(portType) {
		var port;
		switch (portType) {
			// input port
			case 0:
				this.type = "input";
				port = new draw2d.InputPort();
				port.setVisible(false);
				break;
			// output port
			case 1:
				this.type = "output";
				port = new draw2d.OutputPort();
				port.setVisible(false);
				break;
			default:
				break;
		}
		
		
		switch (this.faceIndex) {
			// North
			case 0:
				this.addPort(port, new draw2d.layout.locator.TopLocator(this));
				break;
			// South
			case 1:
				this.addPort(port, new draw2d.layout.locator.BottomLocator(this));
				break;
			// East
			case 2:
				this.addPort(port, new draw2d.layout.locator.XYAbsPortLocator(0, 8));
				break;
			// West
			case 3:
				this.addPort(port, new draw2d.layout.locator.XYAbsPortLocator(30, 8));
				break;
			default:
				break;
		}
		return port;
	}
});