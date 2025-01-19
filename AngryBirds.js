const {Engine, World, Bodies, Body, Constraint, Mouse, MouseConstraint} = Matter;

let engine, world, ground, bird, slingShot,
  boxes = [], mc,
  birdImg = [], boxImg, grassImg, woodImg, birdLimit = 5;

function preload(){
  birdImg = [
    loadImage("assets/red.webp"),
    loadImage("assets/stella.webp"),
  ]
  boxImg = loadImage("assets/box.png");
  grassImg = loadImage("assets/grass.webp");
  woodImg = loadImage("assets/table.jpg");
}

function setup() {
  const canvas = createCanvas(750, 480);
  
  handleLose();
  
  engine = Engine.create();
  world = engine.world;
  
  const mouse = Mouse.create(canvas.elt);
  mouse.pixelRatio = pixelDensity();
  
  mc = MouseConstraint.create(
    engine, {
      mouse: mouse,
      collisionFilter: {
        mask: 2
      }
    });
  World.add(world, mc)
  ground = new Ground(width/2, height - 10, width, 20, grassImg);
  
  //Create level structures)
  generateBridgeStructure(670, height - 20, 30, 30, 90, 5, 60)
  generateTowerStructure(640, height - 20, 30, 30, 2);
  generateTowerStructure(610, height - 20, 30, 30, 3);
  generateTowerStructure(580, height - 20, 30, 30, 5);
  generateTowerStructure(520, height - 20, 30, 30, 5);
  generateTowerStructure(550, height - 20, 30, 30, 4);
  generateTowerStructure(490, height - 20, 30, 30, 3);
  generateTowerStructure(460, height - 20, 30, 30, 2);
  generateBridgeStructure(370, height - 20, 30, 30, 90, 5, 60)
  
  bird = new Bird(100, 375, 15, 2, birdImg[0]);
  
  slingShot = new SlingShot(bird);
}


function draw() {
  
  background(128);
  Engine.update(engine);
  slingShot.fly(mc);
  
  ground.show();
  
  for(const box of boxes){
    box.show();
  }
  
  slingShot.show();
  bird.show();
  
  if(birdLimit <= 0){
    endGame();
  }
}

function keyPressed() {
  if (key == ' '){
    World.remove(world, bird.body);
    const index = floor(random(0, birdImg.length));
    bird = new Bird(100, 375, 25, 2, birdImg[index]); 
    slingShot.attach(bird)  
  }
}

function handleLose() {
  if (birdLimit <= 0){
    console.log('lost!')
  }
}
