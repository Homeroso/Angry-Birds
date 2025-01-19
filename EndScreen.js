function showEndScreen(stars) {
  // Clear the canvas
  clear();

  // Display background
  background(0);

  // Display "Level Complete" text
  textSize(50);
  fill(255);
  textAlign(CENTER, CENTER);
  if (stars > 0)
    text("Level Complete!", width / 2, height / 2 - 100);
  else
    text("Game over", width / 2, height / 2 - 100);
  textSize(25)
  text("Press r to play again", width /2, height - 50);

  // Mostrar estrellas
  for (let i = 0; i < 3; i++) {
    if (i < stars) {
      // Dibujar estrella llena
      fill(255, 215, 0); 
    } else {
      // Dibujar estrella vacia
      noFill();
      stroke(255, 215, 0); // Gold color
    }
    star(width / 2 - 100 + i * 100, height / 2, 30, 15, 5);
  }
}

// Function to draw a star
function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function calculateStars() {
  let stars = 0;

  if (pigs.length === 0){
    if (birdLimit >= 4) {
      stars = 3; 
    } else if (4 > birdLimit >= 2) {
      stars = 2; 
    } else if (birdLimit < 2) {
      stars = 1; 
    } 
  }
  else {
    stars = 0;
  }

  return stars;
}

// Función para el funal del nivel
function endGame() {
  let stars = calculateStars();
  showEndScreen(stars);
}
