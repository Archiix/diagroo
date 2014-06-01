
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
    },
	
	onDoubleClick: function() {
		console.log("[Draw2DConnection.js] Draw2DConnection ID = " + this.getId());
	}
});
