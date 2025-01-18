const { Engine, World, Bodies, Body, Constraint, Mouse, MouseConstraint } =
  Matter;

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
  birdImg = [loadImage("assets/red.webp"), loadImage("assets/stella.webp")];
  boxImg = loadImage("assets/box.png");
  grassImg = loadImage("assets/grass.webp");
}

function setup() {
  const canvas = createCanvas(640, 480);

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
  bird = new Bird(100, 375, 25, 2, birdImg[0]);

  slingShot = new SlingShot(bird);
}

function draw() {
  background(128);
  Engine.update(engine);
  slingShot.fly(mc);

  ground.show();

  for (const box of boxes) {
    box.show();
  }

  slingShot.show();
  bird.show();
}

function keyPressed() {
  if (key == " ") {
    World.remove(world, bird.body);
    const index = floor(random(0, birdImg.length));
    bird = new Bird(100, 375, 25, 2, birdImg[index]);
    slingShot.attach(bird);
  }
}
