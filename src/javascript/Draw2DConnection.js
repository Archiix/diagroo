
var Draw2DConnection = draw2d.Connection.extend({
    init:function()
    {
		this._super();
		this.setRouter(new draw2d.layout.connection.InteractiveManhattanConnectionRouter());
		// this.setRouter(new draw2d.layout.connection.SplineConnectionRouter());
		// this.setRouter(new draw2d.layout.connection.ManhattanBridgedConnectionRouter());
	  
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
		this.setColor("#0d0d0d");
		this.label.setFontColor("#0d0d0d");
		
		this.addFigure(this.label, new draw2d.layout.locator.ManhattanMidpointLocator(this));
		this.label.installEditor(new draw2d.ui.LabelInplaceEditor());
		
		this.setDeleteable(false);
		// this.setDraggable(false);
		// this.setSelectable(false);
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
	
	onContextMenu: function(x, y) {
		currentConnection = this;
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
						var result = confirm("Delete on the data base ?");
						deleteConnection(currentConnection, canvas, connections, draw2DConnections, result);
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
	},
	
	setLayerStyle: function() {
		var alpha = 0.2;
		this.setAlpha(alpha);
		this.label.setAlpha(alpha);
	}
});
