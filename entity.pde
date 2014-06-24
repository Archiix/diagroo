
// ***********
// Class Layer
// ***********
class Layer {
  ArrayList _items;
  ArrayList _connections;
  
  Layer() {
    _items = new ArrayList();
	_connections = new ArrayList();
  }
  
  ArrayList getItems() { return _items; }
  ArrayList getConnections() { return _connections; }
}

// **********
// Class Item
// **********
class Item {
  float _x;
  float _y;
  String _text;
  
  Item(float x, float y, String text) {
    _x = x;
	_y = y;
	_text = text;
  }
  
  float getX() { return _x; }
  float getY() { return _y; }
  String getText() { return _text; }
}

// ****************
// Class Connection
// ****************
class Connection {
  ArrayList _pos;
  String _text;
  String _outputConnectorText;
  String _inputConnectorText;
  
  Connection(ArrayList pos, String text, String outputConnectorText, String inputConnectorText) {
    _pos = pos;
	_text = text;
	_outputConnectorText = outputConnectorText;
	_inputConnectorText = inputConnectorText;
  }
  
  ArrayList getPos() { return _pos; }
  String getText() { return _text; }
  String getOutputConnectorText() { return _outputConnectorText; }
  String getInputConnectorText() { return _inputConnectorText; }
}

// ***********
// Class Point
// ***********
class Point {
  float _x;
  float _y;
  
  Point(float x, float y) {
	_x = x;
	_y = y;
  }
  
  float getX() { return _x; }
  float getY() { return _y; }
}