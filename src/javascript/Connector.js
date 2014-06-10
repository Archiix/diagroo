
function Connector(id, itemId, layerId, portType) {
	this._id = id;
	this.type = "connector";
	
	this.itemId = itemId;
	this.layerId = layerId;
	this.portType = portType;
}