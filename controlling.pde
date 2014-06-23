// http://codelab.fr/4104

ArrayList blocs = new ArrayList();

ArrayList getBlocs() { return blocs; }

Led[] ledCube = new Led[125];

int cubeSize = 150;

int wWidth = 1680;
int wHeight = 882;

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

void setup(){
    int c = 0;
  for (int i = -2; i < 3; i++) {
    for (int j = -2; j < 3; j++) {
      for (int k = -2; k < 3; k++) {
        ledCube[c] = new Led(j, -i, -k, false, 120);
        c++;
      }
    }
  }
  size(wWidth,wHeight, P3D);
}

void draw(){
  background(0);
  pointLight(150,255,255,200,200,200);
  // noLights();
  lights();
  noStroke();
  noSmooth();
  fill(160);
  // drawAxis();
  updateCamPosition();
  camera(camEyeX,camEyeY,camEyeZ,viewX,viewY,viewZ,camUpX,camUpY,camUpZ);
  // drawCube();
  drawAxis();
  translate(0.0, 0.0, 0.0);
  // box(50);
  for (int i = 0; i < blocs.size(); i++) {
    Led led = (Led)blocs.get(i);
    led.display();
  }
}

class Led {
  int x;
  int y;
  int z;
  boolean isOn;
  color bColor;

  Led (int xPos, int yPos, int zPos, boolean state, color col) {
    x = xPos;
    y = yPos;
    z = zPos;
    isOn = state;
    bColor = col;
  }
  void display() {
    pushMatrix();
    translate(x * (cubeSize / 3), y * (cubeSize / 3), z * (cubeSize / 3));
    fill(bColor);
    box(30);
    popMatrix();
  }
}

void drawAxis(){
  stroke(0,255,0);
  line(0,0,0,200,0,0);
  stroke(0,0,255);
  line(0,0,0,0,200,0);
  stroke(255,0,0);
  line(0,0,0,0,0,-200);
  noStroke();
}

void drawCube() {
   for (int i = 0; i < 125; i++) {
   /*
    switch (i) {
     case 0 : ledCube[i].bColor = color(255,255,255); break;
     case 12 : ledCube[i].bColor = color(255,0,0); break;
     case 48 : ledCube[i].bColor = color(0,255,0); break;
     case 60 : ledCube[i].bColor = color(0,0,255); break;
    }
	*/
    ledCube[i].display();
  } 
}

void updateCamPosition(){
    camEyeX = rho * cos(radians(theta)) * cos(radians(phi));
    camEyeY = rho * sin(radians(theta));
    camEyeZ = rho * cos(radians(theta)) * sin(radians(phi));
    
      //Prevent flipping if camera moves past top or bottom of cube
      if ((theta > 90.0 && theta < 270.0) || (theta < -90.0 && theta > -270.0))
    {
      camUpY = -1.0;
    }
    else
    {
      camUpY = 1.0;
    }
}

void mouseDragged(){
  if (mouseButton == LEFT){
    theta = theta + (pmouseY - mouseY);
    phi = phi - (pmouseX - mouseX);
  }
  if (mouseButton == RIGHT){
    rho = rho - (pmouseY - mouseY);    
  }
}