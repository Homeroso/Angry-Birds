function generateStructure(startX, startY, rows, cols, boxWidth, boxHeight, boxImg) {
  
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols - j; i++) {
      const box = new Box(
        startX + j * boxWidth / 2 + i * boxWidth, 
        startY - boxHeight * (j + 1), 
        boxWidth, 
        boxHeight,
        boxImg
      );
      boxes.push(box);
    }
  }
}

function generateCustomStructure(startX, startY, blockWidth, blockHeight, woodWidth, woodHeight) {
  
  // Bloques verticales
  boxes.push(new Box(startX, startY - blockHeight / 2, blockWidth, blockHeight, boxImg));
  boxes.push(new Box(startX + blockWidth * 2, startY - blockHeight / 2, blockWidth, blockHeight, boxImg));

  // Bloque horizontal superior
  boxes.push(new Box(startX + blockWidth, startY - blockHeight - woodHeight / 2, woodWidth, woodHeight, woodImg));

  // Tabla delgada intermedia
  boxes.push(new Box(startX + blockWidth, startY - woodHeight / 2, woodWidth, woodHeight, woodImg));

}

function generateBridgeStructure(startX, startY, blockWidth, blockHeight, woodWidth, woodHeight, distance) {
  
  // Pilares del puente
  boxes.push(new Box(startX, startY - blockHeight / 2, blockWidth, blockHeight, boxImg));
  boxes.push(new Box(startX + distance, startY - blockHeight / 2, blockWidth, blockHeight, boxImg));

  // Plataforma superior del puente
  boxes.push(new Box(startX + distance / 2, startY - blockHeight - woodHeight / 2, woodWidth, woodHeight, woodImg));

  // Colocar un cerdo en la plataforma del puente
  //pigs.push(new Pig(startX + plankWidth / 2, startY - blockHeight - plankHeight, 20, pigImg));
}

function generatePyramidStructure(startX, startY, blockWidth, blockHeight, Tlevels) {
  
  let levels = Tlevels; // Número de niveles de la pirámide

  for (let i = 0; i < levels; i++) {
    let blocksInLevel = levels - i;
    let offsetX = (blockWidth / 2) * i;
    for (let j = 0; j < blocksInLevel; j++) {
      boxes.push(new Box(
        startX + offsetX + j * blockWidth,
        startY - i * blockHeight,
        blockWidth,
        blockHeight,
        boxImg
      ));
    }
  }

  // Colocar un cerdo en la cima de la pirámide
  //pigs.push(new Pig(startX + (levels - 1) * blockWidth / 2, startY - levels * blockHeight, 20, pigImg));
}

function generateTowerStructure(startX, startY, blockWidth, blockHeight, Theight) {

  let towerHeight = Theight; // Número de bloques en la altura de la torre

  for (let i = 0; i < towerHeight; i++) {
    boxes.push(new Box(
      startX,
      startY - i * blockHeight,
      blockWidth,
      blockHeight,
      boxImg
    ));
  }

  // Colocar un cerdo en la parte superior de la torre
  //pigs.push(new Pig(startX, startY - towerHeight * blockHeight - 20, 20, pigImg));
}
