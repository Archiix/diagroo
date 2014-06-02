
function Connection(id, inputConnectorId, outputConnectorId, text) {
	this._id = id;
	this.type = "connection";
	
	this.inputConnectorId = inputConnectorId;
	this.outputConnectorId = outputConnectorId;
	
	this.text = text;
}