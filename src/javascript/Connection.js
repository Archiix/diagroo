
function Connection(id, inputConnectorId, outputConnectorId, layerId, text) {
	this._id = id;
	this.type = "connection";
	
	this.inputConnectorId = inputConnectorId;
	this.outputConnectorId = outputConnectorId;
	
	this.layerId = layerId;
	this.text = text;
}