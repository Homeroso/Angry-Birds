class Box {
  constructor(x, y, w, h, img, options = {}) {
    /* Crear un cuerpo rectangular */
    this.body = Bodies.rectangle(x, y, w, h, options);
    this.w = w;
    this.h = h;
    this.img = img;
    /* Agregar el cuerpo al mundo */
    World.add(world, this.body);
  }

  show() {
    push();
    /* Trasladar y rotar el cuerpo */
    translate(this.body.position.x, this.body.position.y);
    rotate(this.body.angle);
    imageMode(CENTER);
    /* Mostrar la imagen de la caja */
    image(this.img, 0, 0, this.w, this.h);
    pop();
  }
}

class Ground extends Box {
  constructor(x, y, w, h, img) {
    /* Crear un cuerpo estático para el suelo */
    super(x, y, w, h, img, { isStatic: true });
  }
}

class Bird {
  constructor(x, y, r, mass, img) {
    /* Crear un cuerpo circular para el pájaro */
    this.body = Bodies.circle(x, y, r, {
      restitution: 0.7,
      collisionFilter: {
        category: 2,
      },
    });
    this.img = img;
    /* Establecer la masa del pájaro */
    Body.setMass(this.body, mass);
    /* Agregar el cuerpo al mundo */
    World.add(world, this.body);
  }

  show() {
    push();
    imageMode(CENTER);
    /* Trasladar y rotar el cuerpo */
    translate(this.body.position.x, this.body.position.y);
    rotate(this.body.angle);
    /* Mostrar la imagen del pájaro */
    image(
      this.img,
      0,
      0,
      2 * this.body.circleRadius,
      2 * this.body.circleRadius
    );
    pop();
  }
}

class SlingShot {
  constructor(bird) {
    /* Crear una restricción para la resortera */
    this.sling = Constraint.create({
      pointA: {
        x: bird.body.position.x,
        y: bird.body.position.y,
      },
      bodyB: bird.body,
      stiffness: 0.05,
      length: 5,
    });
    /* Agregar la restricción al mundo */
    World.add(world, this.sling);
  }

  show() {
    if (this.sling.bodyB) {
      /* Dibujar la línea de la resortera */
      line(
        this.sling.pointA.x,
        this.sling.pointA.y,
        this.sling.bodyB.position.x,
        this.sling.bodyB.position.y
      );
    }
  }

  fly(mc) {
    if (
      this.sling.bodyB &&
      mc.mouse.button === -1 &&
      this.sling.bodyB.position.x > this.sling.pointA.x + 10
    ) {
      /* Soltar el pájaro de la resortera */
      this.sling.bodyB.collisionFilter.category = 1;
      this.sling.bodyB = null;
    }
  }

  attach(bird) {
    /* Volver a unir el pájaro a la resortera */
    this.sling.bodyB = bird.body;
  }
}
