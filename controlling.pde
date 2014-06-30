// fill from index.htm
ArrayList layers = new ArrayList();
ArrayList getLayers() { return layers; }

Color[] colors = new Color[3];

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
float theta = 0;      
float phi = 90;       
float rho = 900;   //distance from cam to point of view

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

PFont font;

void setup() {
  size(wWidth,wHeight, P3D);
  
  colors[0] = new Color(255, 0, 0);
  colors[1] = new Color(0, 255, 0);
  colors[2] = new Color(0, 0, 255);
  
  font = loadFont("_sans");
  textFont(font, 32);
}

void performeGravityCenter() {
  float sumX = 0.0;
  float sumY = 0.0;
  float sumZ = 0.0;
  int nbItems = 0;
  for (int i = 0; i < layers.size(); i++) {
    Layer layer = (Layer)layers.get(i);
	ArrayList items = layer.getItems();
	for (int j = 0; j < items.size(); j++) {
	  Item item = (Item)items.get(j);
	  sumX += item.getX();
	  sumY += item.getY();
	  sumZ += i * 200;
	  nbItems++;
	}
  }
  dw = sumX / nbItems;
  dh = sumY / nbItems;
  dz = sumZ / nbItems;
}

void YRotation(float x, float y, float z, float angle) {
  float res[] = new float[3];
  /*
  z' = z*cos q - x*sin q
  x' = z*sin q + x*cos q
  y' = y
  */
  res[0] = z * sin(angle) + x * cos(angle);
  res[1] = y;
  res[2] = z * cos(angle) - x * sin(angle);
  return res;
}

void draw() {
  // text test
  // ...
  // println("text");
  background(0);
  pointLight(150,255,255,200,200,200);
  // noLights();
  lights();
  noStroke();
  noSmooth();
  fill(160);
  updateCamPosition();
  camera(camEyeX,camEyeY,camEyeZ,viewX,viewY,viewZ,camUpX,camUpY,camUpZ);
  drawAxis();
  // translate(0.0, 0.0, 0.0);
  
  /*
  pushMatrix();
  rotateY(radians(-phi));
  rotateZ(radians(theta));
  rotateY(radians(90));
  // rotateY(phi);
  fill(255, 255, 255);
  text("The quick brown fox jumped over the lazy dog.", -100, 0, 0);
  popMatrix();
  */
  
  // draw items and connections
  for (int i = 0; i < layers.size(); i++) {
    Layer layer = (Layer)layers.get(i);
	ArrayList items = layer.getItems();
	ArrayList connections = layer.getConnections();
	for (int j = 0; j < items.size(); j++) {
	  Item item = (Item)items.get(j);
	  pushMatrix();
	  fill(colors[i].getR(), colors[i].getG(), colors[i].getB());
	  translate(item.getX() - dw + item.getWidth() / 2, i * 200.0 - dz, item.getY() - dh + item.getHeight() / 2);
	  // box(100);
	  box(item.getWidth(), item.getHeight(), item.getHeight());
	  rotateY(radians(-phi));
      rotateZ(radians(theta));
	  rotateY(radians(90));
	  fill(255, 255, 255);
	  noStroke();
	  pushMatrix();
	  translate(0, 0, item.getWidth());
	  text(item.getText(), 0, 0, 0);
	  popMatrix();
	  // float res[] = YRotation(item.getX(), -item.getY(), i * 105.0, radians(-90));
      // text(item.getText(), res[0], res[2], res[1]);
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
		  pushMatrix();
		  translate(-dw, 0, -dh);
		  line(pt.getX(), i * 200.0 - dz, pt.getY(), next.getX(), i * 200.0 - dz, next.getY());
		  if (k == 0) {
		    pushMatrix();
		    translate(pt.getX(), i * 200.0 - dz, pt.getY());
		    rotateY(radians(-phi));
		    rotateZ(radians(theta));
		    rotateY(radians(90));
		    fill(0, 255, 0);
		    text(connection.getOutputConnectorText(), 0, 0, 0);
			popMatrix();
		  }
		  if (k == pos.size() - 2) {
		    pushMatrix();
		    translate(next.getX(), i * 200.0 - dz, next.getY());
		    rotateY(radians(-phi));
		    rotateZ(radians(theta));
		    rotateY(radians(90));
		    fill(0, 255, 0);
		    text(connection.getInputConnectorText(), 0, 0, 0);
			popMatrix();
		  }
		  // if pos.size() >= 3
		  if (k == 1) {
		    pushMatrix();
			translate(pt.getX(), i * 200.0 - dz, pt.getY());
		    rotateY(radians(-phi));
		    rotateZ(radians(theta));
		    rotateY(radians(90));
		    fill(0, 0, 255);
		    text(connection.getText(), 0, 0, 0);
			popMatrix();
		  }
		  // cas particulier !!!
		  if (k == 0 && pos.size() == 2) {
		    pushMatrix();
			var newX = (pt.getX() + next.getX()) / 2.0;
			var newY = (pt.getY() + next.getY()) / 2.0;
			translate(newX, i * 200.0 - dz, newY);
			rotateY(radians(-phi));
		    rotateZ(radians(theta));
		    rotateY(radians(90));
		    fill(0, 0, 255);
		    text(connection.getText(), 0, 0, 0);
			popMatrix();
		  }
		  popMatrix();
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