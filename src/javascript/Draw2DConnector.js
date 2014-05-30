
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
		this.port = null;
		this.portLocator = null;
		this.faceIndex = faceIndex;
		this.type = ""; // "input" or "output"
		
		/*
		this.policy = new draw2d.policy.canvas.SelectionPolicy();
		policy.onMouseMove = function(c, x, y, shiftKey, ctrlKey) {
			console.log("[x = " + x + "y = " + y + "]");
		};
		this.installEditPolicy(policy);
		*/
	},
	
	onMouseMove: function(x, y) {
		console.log("test");
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
		console.log("[Draw2DConnector.js] Draw2DConnector ID = " + this.getId());
		// w, h = 30, 16 or w, h = 16, 30
		// change de face le connecteur
		switch (this.faceIndex) {
			case 0:
				this.faceIndex = 3;
				this.port.getLocator().x = 30;
				this.port.getLocator().y = 8;
				this.setDimension(30, 16);
				this.locator.x = this.getParent().getWidth();
				this.locator.y = 0;
				break;
			case 1:
				this.faceIndex = 2;
				this.port.getLocator().x = 0;
				this.port.getLocator().y = 8;
				this.setDimension(30, 16);
				this.locator.x = -30;
				this.locator.y = 0;
				break;
			case 2:
				this.faceIndex = 0;
				this.port.getLocator().x = 8;
				this.port.getLocator().y = 0;
				this.setDimension(16, 30);
				this.locator.x = 0;
				this.locator.y = -30;
				break;
			case 3:
				this.faceIndex = 1;
				this.port.getLocator().x = 8;
				this.port.getLocator().y = 30;
				this.setDimension(16, 30);
				this.locator.x = this.getParent().getWidth() - 16;
				this.locator.y = this.getParent().getHeight();
				break;
		}
		this.getParent().repaint();
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
				// this.portLocator = new draw2d.layout.locator.TopLocator(this);
				var portLocator = new draw2d.layout.locator.XYAbsPortLocator(8, 0);
				// this.addPort(this.port, portLocator);
				this.addPort(this.port);
				this.port.setLocator(portLocator);
				break;
			// South
			case 1:
				// this.portLocator = new draw2d.layout.locator.BottomLocator(this)
				var portLocator = new draw2d.layout.locator.XYAbsPortLocator(8, 30);
				// this.addPort(this.port, portLocator);
				this.addPort(this.port);
				this.port.setLocator(portLocator);
				break;
			// East
			case 2:
				var portLocator = new draw2d.layout.locator.XYAbsPortLocator(0, 8);
				// this.addPort(this.port, portLocator);
				this.addPort(this.port);
				this.port.setLocator(portLocator);
				break;
			// West
			case 3:
				var portLocator = new draw2d.layout.locator.XYAbsPortLocator(30, 8);
				// this.addPort(this.port, portLocator);
				this.addPort(this.port);
				this.port.setLocator(portLocator);
				break;
			default:
				break;
		}
		return this.port;
	}
});