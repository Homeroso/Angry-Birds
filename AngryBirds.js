const {Engine, World} = Matter;

let engine, world;

function setup() {
  createCanvas(640, 480);

  engine = Engine.create();
  world = engine.world;
}


function draw() {
  background(128);
  Engine.update(engine);
}
