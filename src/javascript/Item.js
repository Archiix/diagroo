
function Item(id, modelId, layerId, text) {
	this._id = id;
	this.type = "item";
	
	this.modelId = modelId;
	this.layerId = layerId;
	this.text = text;
}