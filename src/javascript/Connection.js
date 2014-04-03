
function Connection(id, inputConnectorId, outputConnectorId) {
	this._id = id;
	this.type = "connection";
	
	this.inputConnectorId = inputConnectorId;
	this.outputConnectorId = outputConnectorId;
}