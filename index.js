var Game = function () {
  var colsInput = document.querySelector("#colsInput");
  var rowsInput = document.querySelector("#rowsInput");
  var roadsInput = document.querySelector("#roadsInput");
  var roomsInput = document.querySelector("#roomsInput");
  var potionsInput = document.querySelector("#potionsInput");
  var weaponsInput = document.querySelector("#weaponsInput");
  var enemiesInput = document.querySelector("#enemiesInput");
  var applyButton = document.querySelector("#applyButton");
  var fieldElement;
  var cameraOffsetX = 0;
  var cameraOffsetY = 0;
  var tileSize = 50;
  var currentRow, currentCol;
  var playerHealth = 100;
  var playerWeaponDamage = 25;
  var enemies = [];
  var modalCreated = false;
  var maptileW = updateMapSize();

  var toggleMusicButton = document.getElementById("toggleMusicButton");
  var backgroundMusic = document.getElementById("backgroundMusic");
  var isPlaying = false;
  toggleMusicButton.addEventListener("click", function () {
    if (!isPlaying) {
      backgroundMusic
        .play()
        .then(function () {
          isPlaying = true;
          toggleMusicButton.textContent = "Pause Music";
        })
        .catch(function (error) {
          console.error("Error playing audio:", error);
        });
    } else {
      backgroundMusic.pause();
      currentPosition = backgroundMusic.currentTime;
      isPlaying = false;
      toggleMusicButton.textContent = "Play Music";
    }
  });
  backgroundMusic.addEventListener("ended", function () {
    backgroundMusic.currentTime = 0;
    backgroundMusic
      .play()
      .then(function () {
        isPlaying = true;
      })
      .catch(function (error) {
        console.error("Error playing audio:", error);
      });
  });

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("sizeForm");
    var toggleButton = document.getElementById("toggleFormButton");

    toggleButton.addEventListener("click", function () {
      form.classList.toggle("hidden");
    });
  });

  function updateMapSize() {
    var cols = parseInt(colsInput.value);
    var rows = parseInt(rowsInput.value);
    var rooms = parseInt(roomsInput.value);
    var roads = parseInt(roadsInput.value);
    var maxPotionCount = parseInt(potionsInput.value);
    var maxWeaponCount = parseInt(weaponsInput.value);
    var maxEnemyCount = parseInt(enemiesInput.value);
    var worldArray = createTileWArray(rows, cols);
    var dungeonArray = drawRectangles(
      worldArray,
      rooms,
      roads,
      maxPotionCount,
      maxWeaponCount,
      maxEnemyCount
    );

    function createTileWArray(rows, cols) {
      var tileWArray = [];
      for (var i = 0; i < rows; i++) {
        var row = Array(cols).fill("tileW");
        tileWArray.push(row);
      }
      return tileWArray;
    }
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function replaceRandomTile(array, fromTile, toTile) {
      var rows = array.length;
      var cols = array[0].length;

      var randomRow = getRandomInt(0, rows - 1);
      var randomCol = getRandomInt(0, cols - 1);

      if (array[randomRow][randomCol] === fromTile) {
        array[randomRow][randomCol] = toTile;
      } else {
        replaceRandomTile(array, fromTile, toTile);
      }
    }
    function drawRectangles(
      worldArray,
      rooms,
      roads,
      maxPotionCount,
      maxWeaponCount,
      maxEnemyCount
    ) {
      var dungeonArray = worldArray;
      for (var k = 0; k < rooms; k++) {
        var startX = getRandomInt(0, cols - 8);
        var startY = getRandomInt(0, rows - 8);
        var rectWidth = getRandomInt(3, 8);
        var rectHeight = getRandomInt(3, 8);

        for (var i = startY; i < startY + rectHeight; i++) {
          for (var j = startX; j < startX + rectWidth; j++) {
            dungeonArray[i][j] = "tile";
          }
        }
      }

      for (var l = 0; l < roads; l++) {
        if (Math.random() < 0.5) {
          var y = getRandomInt(0, rows - 1);
          for (var x = 0; x < cols; x++) {
            dungeonArray[y][x] = "tile";
          }
        } else {
          var x = getRandomInt(0, cols - 1);
          for (var y = 0; y < rows; y++) {
            dungeonArray[y][x] = "tile";
          }
        }
      }

      for (var p = 0; p < 1; p++) {
        replaceRandomTile(dungeonArray, "tile", "tileP");
      }

      for (var hp = 0; hp < maxPotionCount; hp++) {
        replaceRandomTile(dungeonArray, "tile", "tileHP");
      }

      for (var en = 0; en < maxEnemyCount; en++) {
        replaceRandomTile(dungeonArray, "tile", "tileE");
      }

      for (var sw = 0; sw < maxWeaponCount; sw++) {
        replaceRandomTile(dungeonArray, "tile", "tileSW");
      }
      return dungeonArray;
    }

    return dungeonArray;
  }
  function updateGame() {
    var updatedCols = parseInt(colsInput.value);
    var updatedRows = parseInt(rowsInput.value);
    var updatedRooms = parseInt(roomsInput.value);
    var updatedRoads = parseInt(roadsInput.value);
    var updatedMaxPotionCount = parseInt(potionsInput.value);
    var updatedMaxWeaponCount = parseInt(weaponsInput.value);
    var updatedMaxEnemyCount = parseInt(enemiesInput.value);

    maptileW = updateMapSize(
      updatedCols,
      updatedRows,
      updatedRooms,
      updatedRoads,
      updatedMaxPotionCount,
      updatedMaxWeaponCount,
      updatedMaxEnemyCount
    );

    function findPlayerPosition(map) {
      for (var i = 0; i < map.length; i++) {
        for (var j = 0; j < map[i].length; j++) {
          if (map[i][j] === "tileP") {
            return { row: i, col: j };
          }
        }
      }
      return { row: -1, col: -1 };
    }
    var playerPosition = findPlayerPosition(maptileW);
    currentRow = playerPosition.row;
    currentCol = playerPosition.col;
    playerHealth = 100;
    playerWeaponDamage = 25;
    enemies = [];
    fieldElement.innerHTML = "";
    createEnemyAndHeath(maptileW);
    renderField(maptileW);
  }

  var applyButton = document.querySelector("#applyButton");
  applyButton.addEventListener("click", updateGame);

  function updateCamera() {
    var playerTile = document.querySelector(".tileP");
    if (playerTile) {
      var playerRow = parseInt(playerTile.getAttribute("data-row"), 10);
      var playerCol = parseInt(playerTile.getAttribute("data-col"), 10);

      var centerX = window.innerWidth / 2;
      var centerY = window.innerHeight / 2;

      cameraOffsetX = Math.max(
        0,
        Math.min(
          playerCol * tileSize - centerX,
          maptileW[0].length * tileSize - window.innerWidth
        )
      );
      cameraOffsetY = Math.max(
        0,
        Math.min(
          playerRow * tileSize - centerY,
          maptileW.length * tileSize - window.innerHeight
        )
      );

      fieldElement.style.transform =
        "translate(" + -cameraOffsetX + "px, " + -cameraOffsetY + "px)";
    }
  }

  function createEnemyAndHeath(map) {
    for (var row = 0; row < map.length; row++) {
      for (var col = 0; col < map[row].length; col++) {
        var currentTile = map[row][col];
        if (currentTile === "tileE") {
          var enemyId = row + col;
          var enemy = {
            id: enemyId,
            type: "tileE",
            health: 100,
            damage: 10,
            row,
            col,
          };
          enemies.push(enemy);
        }
      }
    }
  }
  for (var i = 0; i < maptileW.length; i++) {
    for (var j = 0; j < maptileW[i].length; j++) {
      if (maptileW[i][j] === "tileP") {
        currentRow = i;
        currentCol = j;
        break;
      }
    }
  }
  function createTileElement(className, row, col) {
    var tile = document.createElement("div");
    tile.className = "tile " + className;
    tile.setAttribute("data-row", row);
    tile.setAttribute("data-col", col);
    return tile;
  }
  function createTile(row, col) {
    var tile = document.createElement("div");
    tile.className = "tile ";
    tile.setAttribute("data-row", row);
    tile.setAttribute("data-col", col);
    return tile;
  }
  function createHealthElement(healthPercentage) {
    var healthElement = document.createElement("div");
    healthElement.classList.add("health");
    healthElement.style.width = healthPercentage + "%";
    return healthElement;
  }
  function renderField(map) {
    fieldElement.innerHTML = "";
    for (var row = 0; row < map.length; row++) {
      for (var col = 0; col < map[row].length; col++) {
        var currentTile = map[row][col];
        if (currentTile !== "tile") {
          var tileElement = createTileElement(currentTile, row, col);
          tileElement.style.left = col * 50 + "px";
          tileElement.style.top = row * 50 + "px";
          if (currentTile === "tileP") {
            var healthElement = createHealthElement(playerHealth);
            tileElement.appendChild(healthElement);
          }
          if (currentTile === "tileE") {
            var enemy = enemies.find(function (enemy) {
              return enemy.row === row && enemy.col === col;
            });
            if (enemy) {
              var healthElement = createHealthElement(enemy.health);
              tileElement.appendChild(healthElement);
            }
          }
          fieldElement.appendChild(tileElement);
        } else {
          var tileElement = createTile(row, col);
          tileElement.style.left = col * 50 + "px";
          tileElement.style.top = row * 50 + "px";
          fieldElement.appendChild(tileElement);
        }
      }
    }
    updateCamera();
  }

  //
  function battle() {
    var nearbyEnemies = [];

    for (var rowOffset = -1; rowOffset <= 1; rowOffset++) {
      for (var colOffset = -1; colOffset <= 1; colOffset++) {
        var targetRow = currentRow + rowOffset;
        var targetCol = currentCol + colOffset;

        if (
          targetRow >= 0 &&
          targetRow < maptileW.length &&
          targetCol >= 0 &&
          targetCol < maptileW[targetRow].length
        ) {
          var targetTile = maptileW[targetRow][targetCol];

          if (targetTile === "tileE") {
            nearbyEnemies.push(
              enemies.find(
                (enemy) => enemy.row === targetRow && enemy.col === targetCol
              )
            );
          }
        }
      }
    }

    if (nearbyEnemies.length > 0) {
      console.log("Бой начался!");
      nearbyEnemies.forEach(function (enemy) {
        enemy.health -= playerWeaponDamage;
        playerHealth -= enemy.damage;
        console.log(
          "Игрок получил урон от врага с id",
          enemy.id,
          ":",
          enemy.damage
        );
        console.log(
          "Врагу с id",
          enemy.id,
          "нанесено урона:",
          playerWeaponDamage
        );
        if (enemy.health <= 0) {
          console.log("Враг с id", enemy.id, "повержен!");
          enemies = enemies.filter(function (e) {
            return e.id !== enemy.id;
          });
        }
        if (playerHealth <= 0) {
          console.log("Игра окончена. Герой повержен.");
          showGameOverModal();
        }
      });
      nearbyEnemies.forEach(function (enemy) {
        if (enemy.health <= 0) {
          console.log("Враг с id", enemy.id, "повержен!");
          enemies = enemies.filter(function (e) {
            return e.id !== enemy.id;
          });
          var randomTile = Math.random();
          if (randomTile < 0.4) {
            maptileW[enemy.row][enemy.col] = "tile";
          } else if (randomTile < 0.7) {
            maptileW[enemy.row][enemy.col] = "tileHP";
          } else {
            maptileW[enemy.row][enemy.col] = "tileSW";
          }
        }
      });
      console.log("Текущее здоровье игрока:", playerHealth);
      renderField(maptileW);
    } else {
      console.log("Нет врагов рядом!");
    }
  }

  function showGameOverModal() {
    if (modalCreated) {
      var modal = document.querySelector(".modal");
      return;
    }
    var modal = document.createElement("div");
    modal.className = "modal";
    var youDiedText = document.createElement("div");
    youDiedText.className = "game-over-text";
    youDiedText.textContent = "YOU DIED";
    youDiedText.color = "black";
    youDiedText.style.fontSize = "100px";
    modal.appendChild(youDiedText);
    var startAgainButton = document.createElement("button");
    startAgainButton.textContent = "START AGAIN";
    startAgainButton.style.fontSize = "50px";
    startAgainButton.className = "start-again-button";
    startAgainButton.addEventListener("click", function () {
      updateGame();
      modal.style.display = "none";
    });
    modal.appendChild(startAgainButton);
    document.body.appendChild(modal);
    modalCreated = true;
  }

  function move(direction) {
    var nextRow = currentRow;
    var nextCol = currentCol;

    switch (direction) {
      case "up":
        nextRow = currentRow - 1;
        break;
      case "left":
        nextCol = currentCol - 1;
        break;
      case "down":
        nextRow = currentRow + 1;
        break;
      case "right":
        nextCol = currentCol + 1;
        break;
    }

    if (isValidMove(nextRow, nextCol) && !isOccupiedByEnemy(nextRow, nextCol)) {
      var nextTile = maptileW[nextRow][nextCol];

      if (nextTile === "tileHP") {
        healed();
      }
      if (nextTile === "tileSW") {
        empowered();
      }

      maptileW[currentRow][currentCol] = "tile";
      currentRow = nextRow;
      currentCol = nextCol;
      maptileW[currentRow][currentCol] = "tileP";
      moveEnemies();
      renderField(maptileW);
    }
  }

  function isValidMove(row, col) {
    return (
      row >= 0 &&
      row < maptileW.length &&
      col >= 0 &&
      col < maptileW[row].length &&
      maptileW[row][col] !== "tileW"
    );
  }

  function healed() {
    console.log("Вылечился!");
    playerHealth += 20;
    if (playerHealth > 100) {
      playerHealth = 100;
    }
    console.log("Здоровье игрока:", playerHealth);
    if (playerHealth <= 0) {
      console.log("Игра окончена. Здоровье закончилось.");
    }
  }

  function empowered() {
    console.log("Усилился!");
    playerWeaponDamage += 25;
    console.log("Наносимый урон игроком:", playerWeaponDamage);
  }

  function moveEnemies() {
    enemies.forEach(function (enemy) {
      maptileW[enemy.row][enemy.col] = "tile";

      if (!enemy.targetRow || Math.random() < 0.2) {
        enemy.targetRow = Math.floor(Math.random() * maptileW.length);
        enemy.targetCol = Math.floor(
          Math.random() * maptileW[enemy.targetRow].length
        );
      }

      let directions = ["up", "down", "left", "right"];
      let randomDirection =
        directions[Math.floor(Math.random() * directions.length)];
      let nextRow = enemy.row;
      let nextCol = enemy.col;

      switch (randomDirection) {
        case "up":
          nextRow--;
          break;
        case "down":
          nextRow++;
          break;
        case "left":
          nextCol--;
          break;
        case "right":
          nextCol++;
          break;
      }

      if (
        isValidMove(nextRow, nextCol) &&
        !isOccupiedByEnemy(nextRow, nextCol) &&
        !isPlayer(nextRow, nextCol)
      ) {
        enemy.row = nextRow;
        enemy.col = nextCol;
      }

      maptileW[enemy.row][enemy.col] = "tileE";
    });
  }

  function isOccupiedByEnemy(row, col) {
    return enemies.some(function (enemy) {
      return enemy.row === row && enemy.col === col;
    });
  }

  function isValidMove(row, col) {
    return (
      row >= 0 &&
      row < maptileW.length &&
      col >= 0 &&
      col < maptileW[row].length &&
      maptileW[row][col] !== "tileW" &&
      !isOccupiedByEnemy(row, col)
    );
  }

  function isPlayer(row, col) {
    return row === currentRow && col === currentCol;
  }

  this.init = function () {
    fieldElement = document.getElementById("gameField");
    createEnemyAndHeath(maptileW);
    renderField(maptileW);
    applyButton.addEventListener("click", updateMapSize);
    document.addEventListener("keydown", function (event) {
      var keyCode = event.code;
      switch (keyCode) {
        case "KeyW":
        case "ArrowUp":
          move("up");
          break;
        case "KeyA":
        case "ArrowLeft":
          move("left");
          break;
        case "KeyS":
        case "ArrowDown":
          move("down");
          break;
        case "KeyD":
        case "ArrowRight":
          move("right");

          break;
        case "Space":
          battle();
          break;
      }
      renderField(maptileW);
    });
  };
};
var game = new Game();
game.init();
