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
  birdLimit = 5,
  slingShot,
  boxes = [],
  pigs = [],
  mc,
  birdImg = [],
  boxImg,
  grassImg,
  pigImg,
  woodImg,
  volumeSlider,
  volumeIcon,
  isMuted = false;

/*Antes de todo guardamos las imágenes */
function preload() {
  /* Cargar imágenes de los pájaros, cajas,césped y cerdito */

  boxImg = loadImage("assets/box.png");
  grassImg = loadImage("assets/grass.webp");
  pigImg = loadImage("assets/pig.png");
  deathPigImg = loadImage("assets/Hurt_pig.webp");
  slingShotImg = loadImage("assets/slingshot.png");
  backgroundImg = loadImage("assets/background.jpg");
  volumeIcon = loadImage("assets/volume.png");
  woodImg = loadImage("assets/table.jpg");
  // Sonidos
  slingStretch = loadSound("assets/slingStretch.mp3");
  slingStretch.setVolume(0.2);
  slingShotSound = loadSound("assets/slingShotSound.mp3");
  slingShotSound.setVolume(8);
  ajuniga = loadSound("assets/ajuniga.mp3");
  ajuniga.setVolume(0.5);
  ikusa = loadSound("assets/ikusa.mp3");
  ikusa.setVolume(0.5);
  ui = loadSound("assets/ui.mp3");
  ui.setVolume(0.5);
  ambient = loadSound("assets/ambient.mp3");
  ambient.setVolume(0.15);

  // Informacion de los pajaros
  birds = [
    {
      // Red bird
      name: "red",
      img: loadImage("assets/red.webp"),
      flyingSound: ajuniga,
      collisionSounds: [
        loadSound("assets/colision1.mp3"),
        loadSound("assets/colision2.mp3"),
        loadSound("assets/colision3.mp3"),
        loadSound("assets/colision4.mp3"),
      ],
    },
    {
      // Stella bird
      name: "yellow",
      img: loadImage("assets/yellow.png"),
      flyingSound: ui,
      collisionSounds: [
        loadSound("assets/colisionUi1.mp3"),
        loadSound("assets/colisionUi2.mp3"),
        loadSound("assets/colisionUi3.mp3"),
        loadSound("assets/colisionUi4.mp3"),
      ],
    },
    {
      // Stella bird
      name: "stella",
      img: loadImage("assets/stella.webp"),
      flyingSound: ikusa,
      collisionSounds: [
        loadSound("assets/colisionIkusa1.mp3"),
        loadSound("assets/colisionIkusa2.mp3"),
        loadSound("assets/colisionIkusa3.mp3"),
        loadSound("assets/colisionIkusa4.mp3"),
      ],
    },
  ];
}

function setup() {
  const canvas = createCanvas(1000, 480); // Resize the window to be wider
  ambient.loop();

  // Create volume slider
  volumeSlider = createSlider(0, 0.5, 0.05, 0.01);
  volumeSlider.position(50, 15);
  volumeSlider.style("width", "100px");

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
  createLevelStructure();

  /* Crear el pájaro y la resortera */
  bird = new Bird(200, 375, 25, 2, 0); // Move the slingshot to the right
  slingShot = new SlingShot(bird);

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
  Events.on(engine, "collisionStart", function (event) {
    for (const box of boxes) {
      box.checkCollision(event);
    }
    for (const pig of pigs) {
      pig.checkCollision(event);
    }
    if (bird) {
      bird.checkCollision(event);
    }
  });

  /*----------------------------------------------------------------- */
}

function draw() {
  background(backgroundImg);
  /* Actualiza constantemente el motor de físicas */
  Engine.update(engine);

  // Update ambient volume based on slider value
  if (!isMuted) {
    ambient.setVolume(volumeSlider.value());
  }

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

  // Muestra icono de volumen para mutear/desmutear
  image(volumeIcon, 10, 10, 30, 30);

  // Display bird limit counter
  fill(255);
  textSize(16);
  text(`Birds left: ${birdLimit}`, width - 120, 30);

  if (pigs.length === 0 || birdLimit === 0) {
    endGame();
  }
}

function mousePressed() {
  // Check if the volume icon is clicked
  if (mouseX > 120 && mouseX < 150 && mouseY > 10 && mouseY < 40) {
    isMuted = !isMuted;
    if (isMuted) {
      ambient.setVolume(0);
    } else {
      ambient.setVolume(volumeSlider.value());
    }
  }
}

function createNewBird() {
  // Eliminar el pájaro actual, si existe
  if (bird && bird.body) {
    World.remove(world, bird.body);
    bird = null;
  }
  birdLimit -= 1;
  // Crear un nuevo pájaro
  const index = floor(random(0, birdImg.length));
  bird = new Bird(200, 375, 25, 2, index); // Move the slingshot to the right
  slingShot.attach(bird);
}

function keyPressed() {
  if (key == " " && birdLimit > 0) {
    // Eliminar el pájaro actual, si existe
    if (bird && bird.body) {
      World.remove(world, bird.body);
      bird = null;
      birdLimit -= 1;
    }
    // Crea indice entre 0 y birds.length
    const index = floor(random(0, birds.length));
    bird = new Bird(200, 375, 25, 2, index); // Move the slingshot to the right
    slingShot.attach(bird);
  }

  if (key == "r") {
    restartGame();
  }
}

function restartGame() {
  frameCount = 0;
  World.clear(world);
  Engine.clear(engine);

  pigs = [];
  boxes = [];

  /* Reiniciar límite de pajaros*/
  birdLimit = 5;

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
  createLevelStructure();

  /* Crear el pájaro y la resortera */
  bird = new Bird(100, 375, 25, 2, birdImg[0]);
  slingShot = new SlingShot(bird);

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
  Events.on(engine, "collisionStart", function (event) {
    for (const box of boxes) {
      box.checkCollision(event);
      for (const pig of pigs) {
        pig.checkCollision(event);
      }
    }
  });
}
