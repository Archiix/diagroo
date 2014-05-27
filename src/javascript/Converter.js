
/* Convert JSON object to Draw2D object */
/* Convert Draw2D object to JSON object */

function ConverterJSON() {
	
	this.convertItem = function(obj) {
		draw2DItem = new Draw2DItem(100, 100, obj.text);
		draw2DItem.setId(obj._id);
		return draw2DItem;
	}
	
	this.convertConnector = function(obj, faceIndex) {
		var w = 0;
		var h = 0;
		switch (faceIndex) {
			case 0:
				w = 16;
				h = 30;
				break;
			case 1:
				w = 16;
				h = 30;
				break;
			case 2:
				w = 30;
				h = 16;
				break;
			case 3:
				w = 30;
				h = 16;
				break;
		}
		
		var locator = new draw2d.layout.locator.XYAbsPortLocator(0, 0);
		var draw2DConnector = new Draw2DConnector(w, h, "c", locator, faceIndex);
		draw2DConnector.setId(obj._id);
		return draw2DConnector;
	}
	
	this.convertConnection = function(obj) {
		var draw2DConnection = new Draw2DConnection();
		draw2DConnection.setId(obj._id);
		return draw2DConnection;
	}
}