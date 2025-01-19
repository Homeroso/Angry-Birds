class Box {
  constructor(x, y, w, h, life, img, options = {}) {
    /* Crear un cuerpo rectangular */
    this.body = Bodies.rectangle(x, y, w, h, options);
    this.isDeath = false;
    this.w = w;
    this.h = h;
    this.img = img;
    this.initialPosition = { x: x, y: y };
    this.life = life;
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

  checkCollision(event) {
    const pairs = event.pairs;
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      if (pair.bodyA === this.body || pair.bodyB === this.body) {
        const penetrationX = pair.collision.penetration.x;
        const penetrationY = pair.collision.penetration.y;
        const impactForce =
          penetrationX * penetrationX + penetrationY * penetrationY;

        console.log(
          `Penetration X: ${penetrationX}, Penetration Y: ${penetrationY}, Impact Force: ${impactForce}`
        );

        this.life -= impactForce;
        if (this.life <= 0) {
          this.isDeath = true;
          setTimeout(() => {
            World.remove(world, this.body);
            const index = boxes.indexOf(this);
            if (index > -1) {
              boxes.splice(index, 1);
            }
          }, 3000);
        }
      }
    }
  }
}

class Ground extends Box {
  constructor(x, y, w, h, img) {
    /* Crear un cuerpo estático para el suelo */
    super(x, y, w, h, 0, img, { isStatic: true });
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
    this.img = slingShotImg;
    this.isStretched = false;
    /* Agregar la restricción al mundo */
    World.add(world, this.sling);
  }

  show() {
    push();
    imageMode(CENTER);
    // Resize the slingshot image to 50x100 pixels
    image(this.img, this.sling.pointA.x, this.sling.pointA.y + 50, 80, 130);
    pop();
    if (this.sling.bodyB) {
      const pointA = this.sling.pointA;
      const pointB = this.sling.bodyB.position;

      // Calculate the distance between pointA and pointB
      const distance = dist(pointA.x, pointA.y, pointB.x, pointB.y);

      // Play the slingStretch sound if the slingshot is stretched
      if (distance > 10 && !this.isStretched) {
        slingStretch.play();
        this.isStretched = true;
      }
      strokeWeight(4);
      stroke(196, 1, 42);
      /* Dibujar la línea de la resortera */
      line(
        this.sling.pointA.x - 20,
        this.sling.pointA.y,
        this.sling.bodyB.position.x,
        this.sling.bodyB.position.y
      );
      line(
        this.sling.pointA.x + 20,
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
      // Reproduce el sonido de tiro la resortera
      slingShotSound.play();
      // Pausa sonido de estiramiento de la resortera
      slingStretch.stop();

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
class Pig {
  constructor(x, y, r, life, img, options = {}) {
    /* Crear un cuerpo circular para el cerdito */
    this.body = Bodies.circle(x, y, r, options);
    this.isHit = false;
    this.r = r;
    this.img = img;
    this.life = life;
    /* Agregar el cuerpo al mundo */
    World.add(world, this.body);
  }

  show() {
    push();
    imageMode(CENTER);
    /* Trasladar y rotar el cuerpo */
    translate(this.body.position.x, this.body.position.y);
    rotate(this.body.angle);
    /* Mostrar la imagen del cerdito */
    image(this.img, 0, 0, 2 * this.r, 2 * this.r);
    pop();
  }

  checkCollision(event) {
    const pairs = event.pairs;
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      if (pair.bodyA === this.body || pair.bodyB === this.body) {
        const penetrationX = pair.collision.penetration.x;
        const penetrationY = pair.collision.penetration.y;
        const impactForce =
          penetrationX * penetrationX + penetrationY * penetrationY;

        // Imprimir los valores de penetración y la fuerza del impacto
        console.log(
          `Penetration X: ${penetrationX}, Penetration Y: ${penetrationY}, Impact Force: ${impactForce}`
        );

        this.life -= impactForce; // Ajusta el factor según sea necesario
        if (this.life <= 0) {
          this.isHit = true;
          setTimeout(() => {
            World.remove(world, this.body);
            const index = pigs.indexOf(this);
            if (index > -1) {
              pigs.splice(index, 1);
            }
          }, 3000);
        }
      }
    }
  }
}
