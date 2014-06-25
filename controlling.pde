// fill from index.htm
ArrayList layers = new ArrayList();
ArrayList getLayers() { return layers; }

int cubeSize = 150;

int wWidth = 1483;
int wHeight = 733;

void setWidth(int width) { wWidth = width; }
void setHeight(int height) { wHeight = height; }

//center
//int cx = wWidth/2;
//int cy = wHeight/2;
//int cz = -cubeSize/2;

//camera positions
float camEyeX = 0;
float camEyeY = 0;
float camEyeZ = 0;
float viewX = 0;
float viewY = 0;
float viewZ = 0;
float camUpX = 0;
float camUpY = 1;
float camUpZ = 0;

//Polar coordinates
float theta = 90;      
float phi = 0;       
float rho = 300;   //distance from cam to point of view

float dw = 0.0;
float dh = 0.0;

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

void setup() {
  size(wWidth,wHeight, P3D);
  
  println("dw = " + dw + ", " + "dh = " + dh);
}

void performeGravityCenter() {
  float minX = 1000000.0;
  float maxX = -1000000.0;
  float minY = 1000000.0;
  float maxY = -1000000.0;
  for (int i = 0; i < layers.size(); i++) {
    Layer layer = (Layer)layers.get(i);
	ArrayList items = layer.getItems();
	for (int j = 0; j < items.size(); j++) {
	  Item item = (Item)items.get(j);
	  float x = item.getX();
	  float y = item.getY();
	  if (x < minX) { minX = x; }
	  if (x > maxX) { maxX = x; }
	  if (y < minY) { minY = y; }
	  if (y > maxY) { maxY = y; }
	}
  }
  viewX = (minX + maxX) / 2.0;
  viewY = 0;
  viewZ = (minY + maxY) / 2.0;
}

void draw() {
  background(0);
  pointLight(150,255,255,200,200,200);
  // noLights();
  lights();
  noStroke();
  noSmooth();
  fill(160);
  // performeGravityCenter();
  updateCamPosition();
  camera(camEyeX,camEyeY,camEyeZ,viewX,viewY,viewZ,camUpX,camUpY,camUpZ);
  drawAxis();
  translate(0.0, 0.0, 0.0);
  // draw items and connections
  for (int i = 0; i < layers.size(); i++) {
    Layer layer = (Layer)layers.get(i);
	ArrayList items = layer.getItems();
	fill((i + 1) * 100, 0, 0);
	ArrayList connections = layer.getConnections();
	for (int j = 0; j < items.size(); j++) {
	  Item item = (Item)items.get(j);
	  pushMatrix();
	  translate(item.getX() + dw, i * 100.0, item.getY() + dh);
	  box(50);
	  popMatrix();
	}
	for (int j = 0; j < connections.size(); j++) {
      Connection connection = (Connection)connections.get(j);
	  ArrayList pos = connection.getPos();
	  for (int k = 0; k < pos.size(); k++) {
	    Point pt = (Point)pos.get(k);
		if (k < pos.size() - 1) {
		  Point next = (Point)pos.get(k + 1);
		  stroke(255,255,255);
		  line(pt.getX(), i * 100.0, pt.getY(), next.getX(), i * 100.0, next.getY());
		  noStroke();
		}
	  }
	}
  }
}

void drawAxis() {
  stroke(0,255,0);
  line(0,0,0,200,0,0);
  stroke(0,0,255);
  line(0,0,0,0,200,0);
  stroke(255,0,0);
  line(0,0,0,0,0,-200);
  noStroke();
}

void updateCamPosition() {
    camEyeX = rho * cos(radians(theta)) * cos(radians(phi));
    camEyeY = rho * sin(radians(theta));
    camEyeZ = rho * cos(radians(theta)) * sin(radians(phi));
    
    //Prevent flipping if camera moves past top or bottom of cube
    if ((theta > 90.0 && theta < 270.0) || (theta < -90.0 && theta > -270.0)) {
      camUpY = -1.0;
    } else {
      camUpY = 1.0;
    }
}

void mouseDragged() {
  if (mouseButton == LEFT) {
    theta = theta + (pmouseY - mouseY);
    phi = phi - (pmouseX - mouseX);
  }
  if (mouseButton == RIGHT) {
    rho = rho - (pmouseY - mouseY);    
  }
}