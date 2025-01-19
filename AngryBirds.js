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

/* Variables globales*/
let engine,
  world,
  ground,
  bird,
  slingShot,
  boxes = [],
  pigs = [],
  mc,
  birdImg = [],
  boxImg,
  grassImg;

/*Antes de todo guardamos las imágenes */
function preload() {
  /* Cargar imágenes de los pájaros, cajas,césped y cerdito */

  birdImg = [loadImage('assets/red.webp'), loadImage('assets/stella.webp')];
  boxImg = loadImage('assets/box.png');
  grassImg = loadImage('assets/grass.webp');
  pigImg = loadImage('assets/pig.png');
  deathPigImg = loadImage('assets/Hurt_pig.webp');

  birdImg = [loadImage('assets/red.webp'), loadImage('assets/stella.webp')];
  boxImg = loadImage('assets/box.png');
  grassImg = loadImage('assets/grass.webp');
  pigImg = loadImage('assets/pig.png');
  slingShotImg = loadImage('assets/slingshot.png');
  backgroundImg = loadImage('assets/background.jpg');
  // Sonidos
  slingStretch = loadSound('assets/slingStretch.mp3');
  slingStretch.setVolume(0.2);
  slingShotSound = loadSound('assets/slingShotSound.mp3');
  slingShotSound.setVolume(8);
  ajuniga = loadSound('assets/ajuniga.mp3');
  ajuniga.setVolume(0.5);
  ambient = loadSound('assets/ambient.mp3');
  ambient.setVolume(0.15);
}

function setup() {
  const canvas = createCanvas(640, 480);
  ambient.loop();

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

  /*CREACIÓN DE OBJETOS --------------------------------------------*/

  /* Crear el suelo */
  ground = new Ground(width / 2, height - 10, width, 20, grassImg);

  /* Crear las cajas y agregarlas al array */
  for (let j = 0; j < 1; j++) {
    for (let i = 0; i < 1; i++) {
      const y = Math.round(height - 40 * (i + 1));
      const box = new Box(250 + j * 200, y, 40, 40, 100, boxImg, {
        restitution: 0.7,
      });
      boxes.push(box);
    }
  }

  /* Crear el pájaro y la resortera */
  bird = new Bird(100, 375, 25, 2, birdImg[0]);
  slingShot = new SlingShot(bird);

  /*Crear cerdito*/
  pig = new Pig(200, 300, 25, 100, pigImg, deathPigImg);
  pigs.push(pig);

  // Crear paredes
  const wallThickness = 50;
  const walls = [
    Bodies.rectangle(width / 2, -wallThickness / 2, width, wallThickness, {
      isStatic: true,
    }), // Pared superior
    Bodies.rectangle(
      width / 2,
      height + wallThickness / 2,
      width,
      wallThickness,
      { isStatic: true }
    ), // Pared inferior
    Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, {
      isStatic: true,
    }), // Pared izquierda
    Bodies.rectangle(
      width + wallThickness / 2,
      height / 2,
      wallThickness,
      height,
      { isStatic: true }
    ), // Pared derecha
  ];

  // Añadir paredes al mundo
  World.add(world, walls);

  /*Manejador de eventos*/
  Events.on(engine, 'collisionStart', function (event) {
    for (const box of boxes) {
      box.checkCollision(event);
      for (const pig of pigs) {
        pig.checkCollision(event);
      }
    }
  });

  /*----------------------------------------------------------------- */
}

function draw() {
  background(backgroundImg);
  /* Actualiza constantemente el motor de físicas */
  Engine.update(engine);

  /*Comprueba si hay un botón del mouse presionado y si no manda al pajaro*/
  slingShot.fly(mc);

  /* Mostrar el suelo */
  ground.show();

  /* Mostrar las cajas */
  for (const box of boxes) {
    box.show();
  }

  /* Mostrar la resortera y el pájaro */
  slingShot.show();
  if (bird.body) {
    bird.show();
  }

  /*Muestra los cerditos */
  for (const pig of pigs) {
    pig.show();
  }
}

function keyPressed() {
  if (key == ' ') {
    // Eliminar el pájaro actual, si existe
    if (bird && bird.body) {
      World.remove(world, bird.body);
      bird = null;
    }
    const index = floor(random(0, birdImg.length));
    bird = new Bird(100, 375, 25, 2, birdImg[index]);
    slingShot.attach(bird);
  }
}
