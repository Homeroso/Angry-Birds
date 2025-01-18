const { Engine, World, Bodies, Body, Constraint, Mouse, MouseConstraint } =
  Matter;
/*Variables de Matter*/
const {
  Engine,
  World,
  Bodies,
  Body,
  Constraint,
  Mouse,
  MouseConstraint,
  Collision,
  Events,
} = Matter;

let engine,
  world,
  ground,
  bird,
  slingShot,
  boxes = [],
  mc,
  birdImg = [],
  boxImg,
  grassImg;

function preload() {
  birdImg = [loadImage('assets/red.webp'), loadImage('assets/stella.webp')];
  boxImg = loadImage('assets/box.png');
  grassImg = loadImage('assets/grass.webp');
  pigImg = loadImage('assets/pig.png');
  background1 = loadImage('assets/background.jpg');
  slingShot = loadImage('assets/slingshot.png');
}

function setup() {
  const canvas = createCanvas(640, 480);

  /* Instanciar motor de físicas y mundo */
  engine = Engine.create();
  world = engine.world;

  const mouse = Mouse.create(canvas.elt);
  mouse.pixelRatio = pixelDensity();

  mc = MouseConstraint.create(engine, {
    mouse: mouse,
    collisionFilter: {
      mask: 2,
    },
  });
  World.add(world, mc);

  ground = new Ground(width / 2, height - 10, width, 20, grassImg);

  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 10; i++) {
      const box = new Box(400 + j * 60, height - 40 * (i + 1), 40, 40, boxImg);
      boxes.push(box);
    }
  }

  /* Crear el pájaro y la resortera */
  bird = new Bird(100, 375, 25, 2, birdImg[0]);

  slingShot = new SlingShot(bird);
}

function draw() {
  background(128);
  /* Actualiza constantemente el motor de físicas */
  Engine.update(engine);

  /*Comprueba si hay un botón del mouse presionado y si no manda al pajaro*/
  slingShot.fly(mc);

  ground.show();

  for (const box of boxes) {
    box.show();
  }

  slingShot.show();
  bird.show();
}

function keyPressed() {
  if (key == ' ') {
  if (key == " ") {
    /* Reiniciar el pájaro cuando se presiona la barra espaciadora */
    World.remove(world, bird.body);
    const index = floor(random(0, birdImg.length));
    bird = new Bird(100, 375, 25, 2, birdImg[index]);
    slingShot.attach(bird);
  }
}
