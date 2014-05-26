
function loadView(viewName, items, connections, canvas) {
	/* *************************************************************************************** */
	// pour les items
	couchDBJQuery.couch.db("diagroo").view("view/getItemViewByViewName", {
		success: function(data) {
			for (var i = 0; i < data.rows.length; i++) {
				var currentItemView = data.rows[i].value;
				
				var x = currentItemView.x;
				var y = currentItemView.y;
				var itemId = currentItemView.itemId;
				
				// get item model
				couchDBJQuery.couch.db("diagroo").openDoc(itemId, {
					success: function(data) {
						var text = data.text;
						
						// create a new Draw2DItem
						console.log(text);
						console.log(x);
						console.log(y);
						
						var newDraw2DItem = new Draw2DItem(100, 100, text);
						newDraw2DItem.setPosition(x, y);
						
						items.add(newDraw2DItem);
						canvas.addFigure(newDraw2DItem);
					},
					error: function(status) {
					}
				});
			}
		},
		error: function(status) {
		},
		key: viewName
	});
	/* *************************************************************************************** */
}