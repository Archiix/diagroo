
var Draw2DConnection = draw2d.Connection.extend({
    init:function()
    {
		this._super();
		this.setRouter(new draw2d.layout.connection.InteractiveManhattanConnectionRouter());
	  
	  // Set connection style
	  /*
      this.setOutlineStroke(1);
      this.setOutlineColor("#303030");
      this.setStroke(5);
      this.setColor('#00A8F0');
      this.setRadius(20);
	  */
	  
		// Set the label
		this.label = new draw2d.shape.basic.Label("connection");
		this.label.setColor("#0d0d0d");
		this.label.setFontColor("#0d0d0d");
		
		this.addFigure(this.label, new draw2d.layout.locator.ManhattanMidpointLocator(this));
		this.label.installEditor(new draw2d.ui.LabelInplaceEditor());
    },
	
	getText: function() {
		return this.label.getText();
	},
	
	setText: function(text) {
		this.label.setText(text);
	},
	
	onDoubleClick: function() {
		console.log("[Draw2DConnection.js] Draw2DConnection ID = " + this.getId());
	},
	
	setLayerStyle: function() {
		this.setAlpha(0.5);
		this.label.setAlpha(0.5);
	}
});
