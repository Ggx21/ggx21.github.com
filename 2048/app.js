// 设置游戏画布和初始分数
var canvas = document.getElementsByClassName("game-grid")[0];
var score = document.getElementById("score");

// 设置变量
var rows = 4;
var cols = 4;
var grid = [];
var emptyCells = [];
var gameIsOver = false;
var gameScore = 0;

// 初始化数组
for (var i = 0; i < rows; i++) {
  grid[i] = [];
  for (var j = 0; j < cols; j++) {
    grid[i][j] = 0;
    emptyCells.push({ x: i, y: j });
  }
}

// 添加两个初始方块
addRandomTile();
addRandomTile();

// 添加随机方块
function addRandomTile() {
  if (emptyCells.length > 0) {
    // 从空位置中随机选择一个位置
    var randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    // 80%的概率为2，20%的概率为4
    var tileValue = Math.random() < 0.8 ? 2 : 4;
    // 将方块设置到该位置上
    grid[randomCell.x][randomCell.y] = tileValue;
    // 从空位置中移除该位置
    emptyCells.splice(emptyCells.indexOf(randomCell), 1);
    // 在该位置上绘制方块
    drawTile(randomCell.x, randomCell.y, tileValue);
  }
}

// 绘制方块
function drawTile(x, y, value) {
  var tile = document.createElement("div");
  var tileText = document.createTextNode(value);
  tile.appendChild(tileText);
  tile.classList.add("tile");
  tile.classList.add("tile-" + value);
  tile.setAttribute("data-value", value);
  canvas.appendChild(tile);
  positionTile(tile, x, y);
}

// 移动方块
function moveTiles(direction) {
  var dirX = 0;
  var dirY = 0;
  var rowsOrder = [];
  var colsOrder = [];

  // 根据移动方向设置移动的行列下标顺序以及移动方向增量
  switch (direction) {
    case "left":
      dirY = -1;
      for (var i = 0; i < rows; i++) {
        rowsOrder.push(i);
      }
      colsOrder = [0, 1, 2, 3];
      break;
    case "right":
      dirY = 1;
      for (var i = 0; i < rows; i++) {
        rowsOrder.push(i);
      }
      colsOrder = [3, 2, 1, 0];
      break;
    case "up":
      dirX = -1;
      for (var i = 0; i < cols; i++) {
        colsOrder.push(i);
      }
      rowsOrder = [0, 1, 2, 3];
      break;
    case "down":
      dirX = 1;
      for (var i = 0; i < cols; i++) {
        colsOrder.push(i);
      }
      rowsOrder = [3, 2, 1, 0];
      break;
  }

  var tilesMoved = false;

  // 针对每个格子进行移动
  for (var i = 0; i < rowsOrder.length; i++) {
    for (var j = 0; j < colsOrder.length; j++) {
      var row = rowsOrder[i];
      var col = colsOrder[j];
      var value = grid[row][col];

      if (value !== 0) {
        // 确定下一个位置
        var nextRow = row + dirX;
        var nextCol = col + dirY;
        var nextValue = nextRow >= 0 && nextRow < rows && nextCol >= 0 && nextCol < cols ? grid[nextRow][nextCol] : null;

        // 如果下一个位置是空的，或者与当前方块值相等，则可以向该位置移动
        if (nextValue === null || nextValue === value) {
          grid[row][col] = 0;
          grid[nextRow][nextCol] = value;

          var tile = document.querySelector(".tile[data-value='" + value + "']");
          positionTile(tile, nextRow, nextCol);

          // 更新移动标记和分数
          tilesMoved = true;
          gameScore += value;

          if (nextValue !== null) {
            emptyCells.push({ x: row, y: col });
          }
          emptyCells.splice(emptyCells.indexOf({ x: nextRow, y: nextCol }), 1);

          // 并入下一个格子进行合并
          if (nextValue === value) {
            var nextTile = document.querySelector(".tile[data-value='" + nextValue + "']");
            canvas.removeChild(nextTile);
            gameScore += nextValue;
            nextValue *= 2;
            grid[nextRow][nextCol] = nextValue;
            tilesMoved = true;

          }
          // 绘制新的方块
          drawTile(nextRow, nextCol, nextValue);
        }
      }
    }
  }

  // 更新分数和判断游戏是否结束
  if (tilesMoved) {
    score.innerHTML = gameScore;
    gameIsOver = checkGameOver();
    addRandomTile();
  }
}

// 位置设置
function positionTile(tile, x, y) {
  tile.style.top = 50+ x * 100 + "px";
  tile.style.left =50+ y * 100 + "px";
}

//判断游戏是否结束
function checkGameOver() {
  if (emptyCells.length === 0) {
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < cols; j++) {
        var value = grid[i][j];
        if ((i < rows - 1 && grid[i + 1][j] === value) || (j < cols - 1 && grid[i][j + 1] === value)) {
          return false;
        }
      }
    }
    toggleGameOver(true);
    return true;
  }
  return false;
}

//游戏结束开关
function toggleGameOver(state) {
  var gameover = document.querySelector(".game-over");
  gameover.style.display = state ? "flex" : "none";
}

//重新开始游戏
function restartGame() {
  toggleGameOver(false);

  // 重置变量和数组
  emptyCells = [];
  gameScore = 0;

  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      grid[i][j] = 0;
      emptyCells.push({ x: i, y: j });
      var tile = document.querySelector(".tile");
      if (tile !== null) {
        canvas.removeChild(tile);
      }
    }
  }

  // 添加两个初始方块
  addRandomTile();
  addRandomTile();

  // 更新分数
  score.innerHTML = gameScore;

  // 将游戏结束状态更新为 false
  gameIsOver = false;
}

//添加键盘事件监听
document.addEventListener("keydown", function (event) {
  if (!gameIsOver) {
    switch (event.key) {
    case "ArrowLeft":
        moveTiles("left");
        break;
    case "ArrowRight":
        moveTiles("right");
        break;
    case "ArrowUp":
        moveTiles("up");
        break;
    case "ArrowDown":
        moveTiles("down");
        break;
    }
  }
});