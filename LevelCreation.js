function generateBridgeStructure(
  startX,
  startY,
  blockWidth,
  blockHeight,
  woodWidth,
  woodHeight,
  distance
) {
  // Pilares del puente
  boxes.push(
    new Box(
      startX,
      startY - blockHeight / 2,
      blockWidth,
      blockHeight,
      300,
      boxImg
    )
  );
  boxes.push(
    new Box(
      startX + distance,
      startY - blockHeight / 2,
      blockWidth,
      blockHeight,
      300,
      boxImg
    )
  );

  // Plataforma superior del puente
  boxes.push(
    new Box(
      startX + distance / 2,
      startY - blockHeight - woodHeight / 2,
      woodWidth,
      woodHeight,
      300,
      woodImg
    )
  );

  // Colocar un cerdo en la plataforma del puente
  pigs.push(
    new Pig(
      startX + woodWidth / 2,
      startY - blockHeight - woodHeight,
      15,
      30,
      pigImg,
      deathPigImg
    )
  );
}

function generateTowerStructure(
  startX,
  startY,
  blockWidth,
  blockHeight,
  Theight
) {
  let towerHeight = Theight; // Número de bloques en la altura de la torre

  for (let i = 0; i < towerHeight; i++) {
    boxes.push(
      new Box(
        startX,
        startY - i * blockHeight,
        blockWidth,
        blockHeight,
        50,
        boxImg
      )
    );
  }

  // Colocar un cerdo en la parte superior de la torre
  pigs.push(
    new Pig(
      startX,
      startY - towerHeight * blockHeight - 10,
      15,
      30,
      pigImg,
      deathPigImg
    )
  );
}

function createLevelStructure() {
  //Create level structures
  generateBridgeStructure(800, height - 20, 30, 30, 90, 5, 60);
  generateTowerStructure(770, height - 20, 30, 30, 2);
  generateTowerStructure(740, height - 20, 30, 30, 3);
  generateTowerStructure(710, height - 20, 30, 30, 5);
  generateTowerStructure(650, height - 20, 30, 30, 5);
  generateTowerStructure(680, height - 20, 30, 30, 4);
  generateTowerStructure(620, height - 20, 30, 30, 3);
  generateTowerStructure(590, height - 20, 30, 30, 2);
  generateBridgeStructure(500, height - 20, 30, 30, 90, 5, 60);
}
