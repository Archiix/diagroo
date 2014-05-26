
function saveUpdateView(viewName, items, connections) { // items ==> Draw2DItem object, connections ==> Connection object
	/* *************************************************************************************************************** */
	// sauvergarder + mettre � jours les blocs
	for (var i = 0; i < items.getSize(); i++) {
		var currentItem = items.get(i);
		var itemId = currentItem.getId();
		// est ce que l'itemView existe d�j�
		couchDBJQuery.couch.db("diagroo").view("view/itemViewIsExisting", {
			success: function(data) {
				if (data.rows.length == 0) { // n'existe pas !
					
					// viewName, x, y, itemId
					var newItemView = new ItemView(viewName, currentItem.getX(), currentItem.getY(), itemId);
					
					couchDBJQuery.couch.db("diagroo").saveDoc(newItemView, {
						success: function(data) { // saved !
						},
						error: function(status) {
						}
					});
				} else { // existe d�j� !
					var itemExisting = data.rows[0].value;
					itemExisting.x = currentItem.getX();
					itemExisting.y = currentItem.getY();
					couchDBJQuery.couch.db("diagroo").saveDoc(itemExisting, {
						success: function(data) { // re-saved !
						},
						error: function(status) {
						}
					});
				}
			},
			error: function(status) {
				console.log(status);
			},
			key: [viewName, itemId]
		});
	}
	/* *************************************************************************************************************** */
}