
/* Convert JSON object to Draw2D object */
/* Convert Draw2D object to JSON object */

function ConverterJSON() {
	
	this.convertItem = function(obj) {
		draw2DItem = new Draw2DItem(100, 100, obj.text);
		draw2DItem.setId(obj._id);
		return draw2DItem;
	}
	
	this.convertConnector = function(obj) {
		var locator = new draw2d.layout.locator.XYAbsPortLocator(0, 0);
		var draw2DConnector = new Draw2DConnector(30, 16, "c", locator, obj.faceIndex);
		draw2DConnector.setId(obj._id);
		return draw2DConnector;
	}
	
	this.convertConnection = function(obj) {
		var draw2DConnection = new Draw2DConnection();
		return draw2DConnection;
	}
}