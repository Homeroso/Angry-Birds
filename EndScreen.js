function showEndScreen(stars) {
  // Clear the canvas
  clear();

  // Display background
  background(0);

  // Display "Level Complete" text
  textSize(50);
  fill(255);
  textAlign(CENTER, CENTER);
  text("Level Complete!", width / 2, height / 2 - 100);
  textSize(25)
  text("Press r to play again", width /2, height - 50);

  // Display stars
  for (let i = 0; i < 3; i++) {
    if (i < stars) {
      // Draw filled star
      fill(255, 215, 0); // Gold color
    } else {
      // Draw empty star
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

// Call this function when the game ends
function endGame() {
  //let stars = calculateStars(); // Implement this function based on your game logic
  showEndScreen(2);
}
