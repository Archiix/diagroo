
function Connector(id, itemId, faceIndex, portType) {
	this._id = id;
	this.type = "connector";
	
	this.itemId = itemId;
	this.faceIndex = faceIndex;
	this.portType = portType;
}