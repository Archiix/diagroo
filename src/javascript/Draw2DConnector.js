
var Draw2DConnector = draw2d.shape.basic.Rectangle.extend({
	init: function(width, height, text) {
		this._super(width, height);
		
		this.label = new draw2d.shape.basic.Label(text);
		this.label.setColor("#0d0d0d");
		this.label.setFontColor("#0d0d0d");
		this.label.installEditor(new draw2d.ui.LabelInplaceEditor());
		
		this.addFigure(this.label, new draw2d.layout.locator.CenterLocator(this));
		
		// TODO: Add port here (start port or end port)
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
				"delete": {name: "Delete", icon: ""}
			}
		});
	}
});