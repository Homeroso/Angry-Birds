const { Engine, World, Bodies, Body, Constraint, Mouse, MouseConstraint } =
  Matter;
/* Motor de físicas y es el mundo sobre el que se agregan los elementos. */

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
  /* Cargar imágenes de los pájaros, cajas y césped */
  birdImg = [loadImage("assets/red.webp"), loadImage("assets/stella.webp")];
  boxImg = loadImage("assets/box.png");
  grassImg = loadImage("assets/grass.webp");
}

function setup() {
  const canvas = createCanvas(640, 480);

  /* Instanciar motor de físicas y mundo */
  engine = Engine.create();
  world = engine.world;

  /* Crear y configurar el ratón */
  const mouse = Mouse.create(canvas.elt);
  mouse.pixelRatio = pixelDensity();

  /* Crear y agregar la restricción del ratón al mundo */
  mc = MouseConstraint.create(engine, {
    mouse: mouse,
    collisionFilter: {
      mask: 2,
    },
  });
  World.add(world, mc);

  /* Crear el suelo */
  ground = new Ground(width / 2, height - 10, width, 20, grassImg);

  /* Crear las cajas y agregarlas al array */
  for (let j = 0; j < 2; j++) {
    for (let i = 0; i < 4; i++) {
      const box = new Box(250 + j * 200, height - 40 * (i + 1), 40, 40, boxImg);
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
  slingShot.fly(mc);

  /* Mostrar el suelo */
  ground.show();

  /* Mostrar las cajas */
  for (const box of boxes) {
    box.show();
  }

  /* Mostrar la resortera y el pájaro */
  slingShot.show();
  bird.show();
}

function keyPressed() {
  if (key == " ") {
    /* Reiniciar el pájaro cuando se presiona la barra espaciadora */
    World.remove(world, bird.body);
    const index = floor(random(0, birdImg.length));
    bird = new Bird(100, 375, 25, 2, birdImg[index]);
    slingShot.attach(bird);
  }
}
