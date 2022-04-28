let vs = []
let stars = []
function setup() {
  createCanvas(windowWidth, windowHeight);
  v = new Vehicle(300,300);
  for (i=0; i<100; i++){
    let star ={
      m: random (0, width), 
      n: random (0, height)
    };
    stars.push(star);
  }
}

function draw() {
  background(0);
  
  //Bintang
  for (i=1; i<100; i++){
       let m = stars [i].m;
       let n = stars [i].n;
  fill (255);
  noStroke();
  ellipse (m, n, random(1,3), random (1,3));
       }
  
  v.display()
  v.edges()
  v.update();
  v.wander();
  
}

class Vehicle{
  constructor(x,y){
    this.location = createVector(x,y);
    this.velocity = createVector(10,10);
    this.acceleration = createVector(0,0);
    this.l = 20.0;
    this.maxspeed = 4;
    this.maxforce = 0.2;
    this.wanderTheta = PI/8;
  }
  
  wander(){
    let projVector = this.velocity.copy(); 
    projVector.setMag(100);     
    let projPoint = projVector.add(this.location);
    let wanderRadius = 50;
    let theta = this.wanderTheta + this.velocity.heading();
    let xBar = wanderRadius * cos(theta);
    let yBar = wanderRadius * sin(theta);

    let wanderPoint = p5.Vector.add(projPoint, createVector(xBar,yBar));
    
    let debug = true;
    if(debug){
      push()
      noStroke();
      
      //Api
      fill (255,56,26);
      ellipse (projPoint.x + 28, projPoint.y + 27.5, 30, 45);
      ellipse (projPoint.x + 10, projPoint.y + 17.5, 25, 40);
      ellipse (projPoint.x + 46, projPoint.y + 17.5, 25, 40);
      fill (255,124,0);
      ellipse (projPoint.x + 28, projPoint.y + 17.5, 30, 45);
      ellipse (projPoint.x + 15, projPoint.y + 7.5, 25, 40);
      ellipse (projPoint.x + 41, projPoint.y + 7.5, 25, 40);
      fill (255,175,0);
      ellipse (projPoint.x + 28, projPoint.y + 7.5, 20, 45);
      ellipse (projPoint.x + 15, projPoint.y + 2.5, 15, 40);
      ellipse (projPoint.x + 41, projPoint.y + 2.5, 15, 40);
      
      //Bagian keluar api
      fill (152,152,152);
      quad (projPoint.x + 5, projPoint.y - 7.5, projPoint.x - 10, projPoint.y + 12.5, projPoint.x + 65, projPoint.y +12.5, projPoint.x + 50, projPoint.y -7.50);
      
      //Badan roket
      fill (250);
      rect (projPoint.x - 3, projPoint.y - 137.5, 60, 130, 20, 20, 10,10);
      
      //Jendela roket
      fill (152,152, 152);
      ellipse (projPoint.x + 27, projPoint.y - 97.5, 45, 45);
      fill (100,149,237);
      ellipse (projPoint.x + 27, projPoint.y - 97.5, 35, 35);
      
      //Ujung Roket
      fill (235, 5, 5);
      stroke (235, 5, 5);
      strokeWeight (10);
      strokeJoin (round);
      triangle (projPoint.x + 26, projPoint.y - 174.5, projPoint.x + 4, projPoint.y - 134.5, projPoint.x + 48, projPoint.y - 134.5);
      
      //Sayap Roket
      noStroke();
      fill (0, 0, 139);
      quad (projPoint.x - 48, projPoint.y - 52.5, projPoint.x - 48, projPoint.y - 22.5, projPoint.x - 3, projPoint.y - 22.5, projPoint.x - 3, projPoint.y - 92.5);
      quad (projPoint.x + 57, projPoint.y - 92.5, projPoint.x + 57, projPoint.y - 22.5, projPoint.x +100, projPoint.y - 22.5, projPoint.x + 100, projPoint.y - 52.5);
      rect (projPoint.x +23, projPoint.y - 37.5, 10, 35, 10, 10,10,10);
      fill (250);
      rect (projPoint.x +25, projPoint.y - 19.5, 6, 15, 10, 10,10,10)
      
      
      
      noFill();
      noStroke ();
      console.log(wanderRadius)
      circle(projPoint.x+150, projPoint.y+150,wanderRadius*1.5)
     
      pop()
  }
  let steeringForce = wanderPoint.sub(this.location);
    steeringForce.setMag(this.maxforce);
    this.applyForce(steeringForce);
    
    this.wanderTheta += random(-0.3 , 0.3);
}


  seek(vektorTarget){
    // percieve target location
    var desired = p5.Vector.sub(vektorTarget, this.location);
    desired.normalize();
    desired.mult(this.maxspeed);
    
    //kemudi
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    this.applyForce(steer);
  }
  
  arrive(vektorTarget){
    // percieve target location
    var desired = p5.Vector.sub(vektorTarget, this.location);
    var jarak = desired.mag()

    if (jarak < 150){
      var m = map(jarak, 0, 150, 0, this.maxspeed);
      desired.normalize();
      desired.mult(m);
      
    }
    else{
      desired.normalize();
      desired.mult(this.maxspeed);    
    }

    
    //kemudi
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    this.applyForce(steer);
  }
  
  
  update(){
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);
    this.location.add(this.velocity);
    this.acceleration.mult(0);
  }
  applyForce(force){
    this.acceleration.add(force);
  }
  display(){
    var theta = this.velocity.heading()// + PI/2;
    push();
    stroke(0);
    translate(this.location.x, this.location.y)
    rotate(theta+20)
    
    
    fill (152,152,152);
    stroke("white");
    ellipse (this.l + 10, this.l+80, 80, 20);
    noStroke ();
    ellipse (this.l + 10, this.l+70, 40, 25);
    pop();
  }

  edges() {
    if (this.location.x > width + 10) {
      this.location.x = -10;
    } else if (this.location.x < -10) {
      this.location.x = width + 10;
    }
    if (this.location.y > height + 10) {
      this.location.y = -10;
    } else if (this.location.y < -10) {
      this.location.y = height + 10;
    }
  }

}