// fill from index.htm
int spaceBetweenLayer = 200;
void setSpaceBetweenLayer(int space) { spaceBetweenLayer = space; }

int itemHeight = 100;
void setItemHeight(int height) { itemHeight = height; }

int fontSize = 20;
void setFontSize(int size) { fontSize = size; }

ArrayList layers = new ArrayList();
ArrayList getLayers() { return layers; }

Color[] colors = new Color[6];

int cubeSize = 150;

int wWidth = 1483;
int wHeight = 733;

void setWidth(int width) { wWidth = width; }
void setHeight(int height) { wHeight = height; }

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
float theta = -40;
float phi = 60;
float initialRho = 30000;   //distance from cam to point of view
float rho = initialRho;

float dw = 0.0;
float dh = 0.0;
float dz = 0.0;

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
  
  void clear() {
    _items.clear();
	_connections.clear();
  }
}

// **********
// Class Item
// **********
class Item {
  float _x;
  float _y;
  float _width;
  float _height;
  String _text;
  
  Item(float x, float y, float width, float height, String text) {
    _x = x;
	_y = y;
	_width = width;
	_height = height;
	_text = text;
  }
  
  float getX() { return _x; }
  float getY() { return _y; }
  float getWidth() { return _width; }
  float getHeight() { return _height; }
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

// ***********
// Class Color
// ***********
class Color {
  int _r;
  int _g;
  int _b;
  
  Color(int r, int g, int b) {
    _r = r;
	_g = g;
	_b = b;
  }
  
  int getR() { return _r; }
  int getG() { return _g; }
  int getB() { return _b; }
}

// ***********
// Class Label
// ***********
class Label {
	float _x;
	float _y;
	float _z;
	String _text;
	float _width;
	float _zOffset;
	
	Label(float x, float y, float z, String text, float width, float zOffset) {
		_x = x;
		_y = y;
		_z = z;
		_text = text;
		_width = width;
		_zOffset = zOffset;
	}
	
	float getX() { return _x; }
	float getY() { return _y; }
	float getZ() { return _z; }
	String getText() { return _text; }
	float getWidth() { return _width; }
	float getZOffset() { return _zOffset; }
}

PFont font;

/* @pjs font="DosisMedium.ttf"; */

void setup() {
  size(wWidth, wHeight, OPENGL);
  
  colors[0] = new Color(211, 255, 215);
  colors[1] = new Color(237, 152, 140);
  colors[2] = new Color(252, 202, 132);
  colors[3] = new Color(161, 220, 86);
  colors[4] = new Color(255, 239, 223);
  colors[5] = new Color(163, 54, 91);
  
  font = createFont("DosisMedium.ttf", 54, false);

  textFont(font);
  textAlign(CENTER);
}

void performeGravityCenter() {
  float minX = 1000000.0;
  float maxX = -1000000.0;
  float minY = 1000000.0;
  float maxY = -1000000.0;
  float sumZ = 0.0;
  int nbItems = 0;
  for (int i = 0; i < layers.size(); i++) {
    Layer layer = (Layer)layers.get(i);
	ArrayList items = layer.getItems();
	for (int j = 0; j < items.size(); j++) {
	  Item item = (Item)items.get(j);
	  if (item.getX() < minX) minX = item.getX();
	  if (item.getX() > maxX) maxX = item.getX() + item.getWidth();
	  if (item.getY() < minY) minY = item.getY();
	  if (item.getY() > maxY) maxY = item.getY() + item.getHeight();
	  nbItems++;
	}
    sumZ += i * spaceBetweenLayer;
  }
  dw = minX + maxX / 2.0;
  dh = minY + maxY / 2.0;
  dz = sumZ / layers.size();
}

PVector shiftingText(x1, y1, z1, x2, y2, z2) {
  PVector v1 = new PVector(x1, y1, z1);
  PVector v2 = new PVector(x2, y2, z2);
  v2.sub(v1);
  v2.normalize();
  v2.mult(50);
  // translate(v2.x, v2.z, v2.y);
  return v2;
}

void drawLabels(ArrayList labels) {
	for (int i = 0; i < labels.size(); i++) {
		Label l = (Label)labels.get(i);
		pushMatrix();
		fill(0);
		translate(l.getX(), l.getZ(), l.getY());
		rotateY(radians(-phi));
		rotateZ(radians(theta));
		rotateY(radians(90));
		translate(0, 0, l.getWidth());
		text(l.getText(), 0, 0, l.getZOffset());
		popMatrix();
	}
}

void draw() {
  background(255, 255, 255);
  lights();
  noSmooth();
  updateCamPosition();
  camera(camEyeX, camEyeY, camEyeZ, viewX, viewY, viewZ, camUpX, camUpY, camUpZ);

  float fov = PI / 100.0;
  float cameraZ = (height/2.0) / tan(fov/2.0);
  perspective(fov, float(width)/float(height),cameraZ/10.0,cameraZ*10.0);
  
  textSize(fontSize * rho / initialRho);
  
  ArrayList labels = new ArrayList();
  
  // draw items and connections
  for (int i = 0; i < layers.size(); i++) {
    Layer layer = (Layer)layers.get(i);
	ArrayList items = layer.getItems();
	ArrayList connections = layer.getConnections();
	for (int j = 0; j < items.size(); j++) {
	  Item item = (Item)items.get(j);
	  pushMatrix();
	  fill(colors[i].getR(), colors[i].getG(), colors[i].getB());
	  stroke(colors[i].getR(), colors[i].getG(), colors[i].getB());
	  PVector pos = new PVector(item.getX() - dw + item.getWidth() / 2, item.getY() - dh + item.getHeight() / 2 ,i * spaceBetweenLayer - dz);
	  translate(pos.x, pos.z, pos.y);
	  box(item.getWidth(), itemHeight, item.getHeight());
	  labels.add(new Label(pos.x, pos.y, pos.z, item.getText(), item.getWidth(), 100));
	  popMatrix();
	}
	for (int j = 0; j < connections.size(); j++) {
      Connection connection = (Connection)connections.get(j);
	  ArrayList pos = connection.getPos();
	  for (int k = 0; k < pos.size(); k++) {
	    Point pt = (Point)pos.get(k);
		if (k < pos.size() - 1) {
		  Point next = (Point)pos.get(k + 1);
		  stroke(150, 150, 150);
		  pushMatrix();
		  translate(-dw, 0, -dh);
		  line(pt.getX(), i * spaceBetweenLayer - dz, pt.getY(), next.getX(), i * spaceBetweenLayer - dz, next.getY());
		  if (k == 0) {
		    // pushMatrix();
			PVector p = shiftingText(pt.getX(), pt.getY(), i * spaceBetweenLayer - dz, next.getX(), next.getY(), i * spaceBetweenLayer - dz); // test
			// translate(pt.getX() + p.x, i * spaceBetweenLayer - dz + p.z, pt.getY() + p.y);
			
			labels.add(new Label(pt.getX() + p.x - dw, pt.getY() + p.y - dh, i * spaceBetweenLayer - dz + p.z, connection.getOutputConnectorText(), 0, 0));
			
			/*
		    rotateY(radians(-phi));
		    rotateZ(radians(theta));
		    rotateY(radians(90));
		    fill(0);
		    text(connection.getOutputConnectorText(), 0, 0, 0);
			popMatrix();
			*/
		  }
		  if (k == pos.size() - 2) {
		    //pushMatrix();
		    //translate(next.getX(), i * spaceBetweenLayer - dz, next.getY());
			
			PVector p = shiftingText(next.getX(), next.getY(), i * spaceBetweenLayer - dz, pt.getX(), pt.getY(), i * spaceBetweenLayer - dz); // test
			
			labels.add(new Label(next.getX() + p.x - dw, next.getY() + p.y - dh, i * spaceBetweenLayer - dz + p.z, connection.getInputConnectorText(), 0, 0));
			
			/*
		    rotateY(radians(-phi));
		    rotateZ(radians(theta));
		    rotateY(radians(90));
		    fill(0);
		    text(connection.getInputConnectorText(), 0, 0, 0);
			popMatrix();
			*/
		  }
		  // if pos.size() >= 3
		  if (k == 1) {
		    // pushMatrix();
			// translate(pt.getX(), i * spaceBetweenLayer - dz, pt.getY());
			labels.add(new Label(pt.getX() - dw, pt.getY() - dh, i * spaceBetweenLayer - dz, connection.getText(), 0, 0));
		    // rotateY(radians(-phi));
		    // rotateZ(radians(theta));
		    // rotateY(radians(90));
		    // fill(0);
		    // text(connection.getText(), 0, 0, 0);
			// popMatrix();
		  }
		  // cas particulier !!!
		  if (k == 0 && pos.size() == 2) {
		    // pushMatrix();
			var newX = (pt.getX() + next.getX()) / 2.0;
			var newY = (pt.getY() + next.getY()) / 2.0;
			// translate(newX, i * spaceBetweenLayer - dz, newY);
			labels.add(new Label(newX - dw, newY - dh, i * spaceBetweenLayer - dz, connection.getText(), 0, 0));
			// rotateY(radians(-phi));
		    // rotateZ(radians(theta));
		    // rotateY(radians(90));
		    // fill(0);
		    // text(connection.getText(), 0, 0, 0);
			// popMatrix();
		  }
		  popMatrix();
		  noStroke();
		}
	  }
	}
  }
  drawLabels(labels);
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
    rho = rho - (pmouseY - mouseY) * 10.0;
  }
}

void zoom(value) {
    rho = rho -value * 10;
}
