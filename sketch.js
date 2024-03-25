var ySpeed;
var gravity = 0.5; // Gravité
var rotationAngle = 0;
var numberRotate = 0;
var backFlip = false;
var projectils;
var particules;
var posX = 10;
var posY = 280;
var isGrounded = true;
var rotation = 0;
var pivot_x = -5;
var pivot_y = 15;
var start = false;
var button;
var score = 0;
var img;
var img2;
var img3;
var gif;
var bonus;
var delais;
var resetVitesse = false;
var totalVitesse;

function preload() {
  img = loadImage('SpaceShip.png');
  img2 = loadImage('meteors.png');
  img3 = loadImage('bonus.png');
  gif = createImg("comet3.gif");
  gif.hide()
}
function setup() {
    createCanvas(400, 400);
    background(0)
    imageMode(CENTER)
    ySpeed = 0;
    delais = 0;
    bonus = new SlowBonus()
    projectils = new Array(10)
    particules = new Array(10)
    for(var i=0;i<10;i++){
      let unProjectil = new Projectil()
      projectils[i] = unProjectil
    }
    if(!start){
      button = createButton("START!");
      button.mouseClicked(setStart);
      button.size(200, 100);
      button.position(100, 150);
      button.style("font-family", "Comic Sans MS");
      button.style("font-size", "48px");
    }
    textSize(32);
    fill(255);
    text(score, 300, 50);
}

function draw() {
  if(!start){
    return
  }
    button.remove()
    score+=1
    if(bonus.picked){
      delais = score + 200
      for(var i=0;i<10;i++){
        projectils[i].speed = projectils[i].speed/3
      }
      resetVitesse = true
    }
    if(delais>=score){
      background(0,50);
    }
    else{
      background(0);
      if(resetVitesse){
        for(var i=0;i<10;i++){
          projectils[i].speed = projectils[i].speed*3
        }
        resetVitesse = false
      }
    }
    text(score, 300, 50);
    // Gestion des mouvements
    if (keyIsDown(RIGHT_ARROW) && posX< width) {
        posX += 3;
        //rotationAngle = -100
        //gif.hide()
    }
    if (keyIsDown(LEFT_ARROW) && posX>0) {
        posX -= 3;
        //rotationAngle = 100
        //gif.hide()
    }
    if (keyIsDown(UP_ARROW) && isGrounded) {
        ySpeed = -10; // Sauter vers le haut
        isGrounded = false; // Le joueur n'est plus au sol
    }
    if (keyIsDown(DOWN_ARROW) && !isGrounded && !backFlip) {
        backFlip = true
    }
    if(!keyIsDown(RIGHT_ARROW) && !keyIsDown(LEFT_ARROW)){
      gif.show()
    }
    if(backFlip){
      switch(numberRotate){
          case(0):
            rotationAngle += 45;
            numberRotate++;
            print(numberRotate)
            break;
            
          case(1):
            rotationAngle += 45;
            numberRotate++;
            print(numberRotate)
          
            break;
          case(2):
            rotationAngle += 45;
            numberRotate++;
            print(numberRotate)
          
            break;
          case(3):
            numberRotate = 0;
            rotationAngle = 0;
            backFlip = false;
            print(numberRotate)
          
            break;
      }
    }
    push(); // Enregistrer la configuration actuelle de la transformation
    translate(posX + 5, posY + 12.5);
    rotate(rotationAngle); // Rotation par rapport à l'angle
    //rect(-5, -12.5, 10, 25); // Dessiner le rectangle au centre
    image(img, 0, -4, 25, 25);
    gif.position(posX-19, posY+8.5);
    gif.size(50, 50);
    pop();
    rotationAngle = 0

    // Appliquer la gravité tout le temps
    ySpeed += gravity;
    posY += ySpeed;
  
  //Appliquer la gravité uniquement quand le joueur saute
  /*if(!isGrounded){
      ySpeed += gravity;
      posY += ySpeed;
    }*/
    // Limiter le joueur en bas de l'écran
    if (posY > 280) {
        posY = 280;
        ySpeed = 0;
        isGrounded = true; // Le joueur est au sol
    }
  totalVitesse = 0;
  for(var i=0;i<10;i++){
    totalVitesse += projectils[i].speed
  }
  if(totalVitesse/10<7){
    for(var i=0;i<10;i++){
      projectils[i].speed += 0.001
    }
  }
    else{
      console.log(score)
    }
  for(var i=0;i<10;i++){
    projectils[i].move()
    projectils[i].draw(delais>=score)
    if(projectils[i].kill(posX,posY,10, 25)){
      start = false;
      gif.hide();
      console.log("VOUS AVEZ PERDU");
      background(255,0,0);
      setup();
    }
  }
  /*if(true){
    for(var i=0;i<10;i++){
          let uneParticule = new Particule(posX,posY)
          particules[i] = uneParticule
          particules[i].move()
          particules[i].draw()
    }
  }*/
    bonus.draw()
    bonus.move()
    bonus.pickBonus(posX,posY,10, 25)
}

class Projectil{
  constructor(){
    this.x = random(0,width)
    this.y = random(0,-1000)
    this.speed = random(1,3)
  }
  draw(picked){
    if(picked){
      strokeWeight(3);
      stroke(255,0,0);
      ellipse(this.x,this.y,20,20);
    }
    image(img2, this.x,this.y,20,20);
  }
  move(){
    this.y += this.speed
    if(this.y>=420){
      this.y = random(0,-1000)
      this.x = random(0,width)
    }
  }
  kill(paramX,paramY,paramH,paramW){
    let hit = collideRectCircle(paramX, paramY, paramH, paramW, this.x, this.y,20);
    return hit
  }
}

class Particule{
  constructor(posX,posY){
    this.x = random(posX-10,posX+10)
    this.y = random(posY-20,posY-15)
    this.speed = random(1,3)
  }
  move(){
      this.y += this.speed
  }
  draw(){
    rect(this.x,this.y+30,3,3)
  }
}
function setStart(){
  start = true;
  gravity = 0.5; // Gravité
  rotationAngle = 0;
  numberRotate = 0;
  backFlip = false;
  posX = 10;
  posY = 280;
  isGrounded = true;
  rotation = 0;
  pivot_x = -5;
  pivot_y = 15;
  score = 0
  gif.show()
}

class SlowBonus{
  constructor(){
    this.x = 410
    this.y = 220
    this.speed = random(1,3)
    this.spawn = random(1,1200)
    this.picked = false
  }
  draw(){
    noStroke();
    //ellipse(this.x,this.y,20,20);
    image(img3, this.x,this.y,20,30);
  }
  move(){
    if(Math.trunc(this.spawn) == 3){
      this.x -= this.speed
    }
    else{
      this.spawn = random(1,1200)
    }
    if(this.x<= -5 || this.picked){
      this.x = 410
      this.picked = false
      this.spawn = random(1,1200)
    }
  }
  pickBonus(paramX,paramY,paramH,paramW){
    let pick = collideRectCircle(paramX, paramY, paramH, paramW, this.x, this.y,20);
    if(pick){
      this.picked = true
    }
  }
}