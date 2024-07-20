var trex ,trex_running, trex_collided;
var groundImage;
var invisibleGround;
var cloud, cloudImage;
var obstacle, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6
var score = 0;
var PLAY = 1;
var END = 0;
var gameState = PLAY; 
var obstaclesGroup, cloudsGroup;
var restar, restarImg, gameOver, gameOverImg;
var jumpSound, dieSound, checkSound;
function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");  
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  restarImg = loadImage("restart.png");
 gameOverImg = loadImage("gameOver.png");

trex_collided = loadImage("trex_collided.png")

 jumpSound = loadSound("jump.wav");
dieSound = loadSound("die.wav");
checkSound = loadSound("checkpoint.wav");
}


function setup(){
  createCanvas(600,200)
  
  //crear sprite de Trex
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  

  //crear sprite del suelo
  ground = createSprite(200,180,400,20);
  ground.addImage("ground", groundImage);

  //crear sprite del suelo invisible
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;

  // crear gurupos de obstaculos y nubes
 obstaclesGroup = new Group()
  cloudsGroup = new Group();
  
restar = createSprite(300,140);
restar.addImage(restarImg);

gameOver = createSprite(300,100);
gameOver.addImage(gameOverImg);

restar.scale = 0.5;
gameOver.scale = 0.5

  var rango = Math.round(random(1,20));
  console.log(rango);

 
}

function draw(){
  background("white");
  //console.log(trex.y);
  text("puntuación "+score,500,50);
 
  if(gameState === PLAY){
    //mover el piso
    ground.velocityX = -(6 + score/100);
    
    //generar puntos
    score = score + Math.round(frameCount/60);
if(score > 0 && score % 100 === 0){
  checkSound.play();
}


//reiniciar le suelo
    if(ground.x < 0){
      ground.x = ground.width/2;
    }


    
  //salto del trex
  if(keyDown("space") && trex.y >= 100){
    trex.velocityY = -10;
jumpSound.play();
  }
  //caida/gravedad del trex
  trex.velocityY = trex.velocityY + 0.8;
//aparecer nubes
  spawnClouds();
  //aparecer obstaculos en el suelo
  spawnobstacles();

  //cambiar el estado a game over
  if(obstaclesGroup.isTouching(trex)){
  gameState = END;
  dieSound.play();
  }
  gameOver.visible = false;
  restar.visible = false;
}
  else if (gameState === END){
  //detener el suelo
    ground.velocityX = 0; 
    trex.velocityY = 0;

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0)

//cambir la animacion del trex
trex.changeAnimation("collided", trex_collided);

gameOver.visible = true;
restar.visible = true;
//establecer lifatime de los ogjetos para que no sean destrudos
obstaclesGroup.setLifetimeEach(-1)
cloudsGroup.setLifetimeEach(-1);

if(mousePressedOver(restar)){
  reset();
}


  }
 
 
 



  //evitar que el trex caiga
  trex.collide(invisibleGround);

  drawSprites();
}

function spawnClouds(){
  if(frameCount % 60 === 0){ 
  cloud = createSprite(600, 100, 40, 10);
  cloud.addImage(cloudImage);
  cloud.y = Math.round(random(10,60))
  cloud.scale = 0.4;
  cloud.velocityX = -(6 + score/100);


  //ajustar la profundidad
  cloud.depth = trex.depth
  trex.depth = trex.depth + 1;

//asignar ciclo de vida
 cloud.lifetine = 210;


 ////agregar cada obstaculo al grupo
 cloudsGroup.add(cloud);
  }
}

function spawnobstacles(){
  if(frameCount % 60 === 0){
   obstacle = createSprite(600, 165, 10, 40);
 obstacle.velocityX = -(6 + score/100);

 //generar obtaculos al alazar
 var rand = Math.round(random(1,6));
 switch(rand) {
  case 1: obstacle.addImage(obstacle1);
  break
  case 2: obstacle.addImage(obstacle2);
  break
  case 3: obstacle.addImage(obstacle3);
  break
  case 4: obstacle.addImage(obstacle4);
  break
  case 5: obstacle.addImage(obstacle5);
  break
  case 6: obstacle.addImage(obstacle6);
  break
  default: break;

 }
 //asignar escala y tienpo de vida
 obstacle.scale = 0.5;
 obstacle.lifetime = 210;

 //agregar cada obstaculo al grupo
 obstaclesGroup.add(obstacle);
}
}
function reset (){
  gameState = PLAY;
  gameOver.visible = false;
  restar.visible = false;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
}