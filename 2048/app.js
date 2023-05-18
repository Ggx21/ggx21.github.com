<link rel="stylesheet" class="aplayer-secondary-style-marker" href="\assets\css\APlayer.min.css"><script src="\assets\js\APlayer.min.js" class="aplayer-secondary-script-marker"></script><script class="meting-secondary-script-marker" src="\assets\js\Meting.min.js"></script>// 该函数用来绘制方块
function drawTile(x, y, value) {
  // 在游戏画布上绘制方块
  var tile = document.createElement("div");
  tile.classList.add("tile");
  tile.classList.add("tile-" + value);
  tile.innerText = value;
  canvas.appendChild(tile);
  // 设置方块的位置
  tile.style.top = x * 80 + "px";
  tile.style.left = y * 80 + "px";
}

// 设置游戏画布和初始分数
var canvas = document.getElementsByClassName("game-grid")[0];
var score = document.getElementById("score");

// 设置变量
var rows = 4;
var cols = 4;
var grid = [];
var gameIsOver = false;
var gameScore = 0;

// 初始化数组
for (var i = 0; i < rows; i++) {
  grid[i] = [];
  for (var j = 0; j < cols; j++) {
    grid[i][j] = 0;
  }
}

// 添加两个初始方块
addRandomTile();
addRandomTile();

// 添加随机方块
function addRandomTile() {
  var hasEmptyCell = false;
  // 记录空位置的数组
  var emptyCells = [];
  // 遍历数组，找出空位置
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      // 如果该位置为空
      if (grid[i][j] === 0) {
        // 将该位置添加到空位置数组中
        emptyCells.push({ x: i, y: j });
        hasEmptyCell = true;
      }
    }
  }
  // 如果有空位置
  if (hasEmptyCell) {
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

// 位置设置
function positionTile(tile, x, y) {
  tile.style.top = 5 + x * 10 + "rem";
  tile.style.left = 5 + y * 10 + "rem";
}
//颜色设置
function colorTile(tile, value) {
  switch (value) {
    case 2:
      tile.style.backgroundColor = "#eee4da";
      tile.style.color = "#776e65";
      break;
    case 4:
      tile.style.backgroundColor = "#ede0c8";
      tile.style.color = "#776e65";
      break;
    case 8:
      tile.style.backgroundColor = "#f2b179";
      tile.style.color = "#f9f6f2";
      break;
    case 16:
      tile.style.backgroundColor = "#f59563";
      tile.style.color = "#f9f6f2";
      break;
    case 32:
      tile.style.backgroundColor = "#f67c5f";
      tile.style.color = "#f9f6f2";
      break;
    case 64:
      tile.style.backgroundColor = "#f65e3b";
      tile.style.color = "#f9f6f2";
      break;
    case 128:
      tile.style.backgroundColor = "#edcf72";
      tile.style.color = "#f9f6f2";
      break;
    case 256:
      tile.style.backgroundColor = "#edcc61";
      tile.style.color = "#f9f6f2";
      break;
    case 512:
      tile.style.backgroundColor = "#edc850";
      tile.style.color = "#f9f6f2";
      break;
    case 1024:
      tile.style.backgroundColor = "#edc53f";
      tile.style.color = "#f9f6f2";
      break;
    case 2048:
      tile.style.backgroundColor = "#edc22e";
      tile.style.color = "#f9f6f2";
      break;
    default:
      tile.style.backgroundColor = "#3c3a32";
      tile.style.color = "#f9f6f2";
      break;
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
  colorTile(tile, value);
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
      dirX = 0;
      dirY = -1;
      rowsOrder = [0, 1, 2, 3];
      colsOrder = [0, 1, 2, 3];
      break;
    case "right":
      dirX = 0;
      dirY = 1;
      rowsOrder = [0, 1, 2, 3];
      colsOrder = [3, 2, 1, 0];
      break;
    case "up":
      dirY = 0;
      dirX = -1;
      colsOrder = [0, 1, 2, 3];
      rowsOrder = [0, 1, 2, 3];
      break;
    case "down":
      dirY = 0;
      dirX = 1;
      colsOrder = [0, 1, 2, 3];
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
        var nextRow = row;
        var nextCol = col;
        for (var step = 0; step < 4; step++) {
          // 确定下一个位置
          nextRow += dirX;
          nextCol += dirY;
          // 判断下一个位置是否越界
          if (nextCol < 0) {
            nextCol = 0;
            break;
          }
          if (nextCol > 3) {
            nextCol = 3;
            break;
          }
          if (nextRow < 0) {
            nextRow = 0;
            break;
          }
          if (nextRow > 3) {
            nextRow = 3;
            break;
          }
          if (grid[nextRow][nextCol] === value) {
            break;
          }
          if (grid[nextRow][nextCol] !== 0) {
            nextRow -= dirX;
            nextCol -= dirY;
            break;
          }
        }
        var nextValue = grid[nextRow][nextCol];
        //如果下一个位置是自己，continue
        if (nextCol === col && nextRow === row) {
          continue;
        }
        // 否则如果下一个位置是空的(0)，或者与当前方块值相等，则可以向该位置移动
        if (nextValue === 0 || nextValue === value) {
          // 更新移动标记和分数
          if (nextValue !== 0) {
            gameScore += 2 * value;
          }
          tilesMoved = true;

          // 并入下一个格子进行合并
          grid[row][col] = 0;
          grid[nextRow][nextCol] += value;
        }
      }
    }
  }

  // 更新分数和判断游戏是否结束，更新界面
  if (tilesMoved) {
    score.innerHTML = gameScore;
    // 更新界面
    // 去掉原有的方块
    var tiles = document.querySelectorAll(".tile");
    for (var i = 0; i < tiles.length; i++) {
      canvas.removeChild(tiles[i]);
    }
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        if (grid[i][j] !== 0) {
          drawTile(i, j, grid[i][j]);
        }
      }
    }
    addRandomTile();
    gameIsOver = checkGameOver();
  }
}

//判断游戏是否结束
function checkGameOver() {
  // 如果还有空格子，游戏没有结束
  var hasEmptyCell = 0;
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      var value = grid[i][j];
      if (value == 0) {
        hasEmptyCell++;
      }
    }
  }
  console.log("hasEmptyCell:" + hasEmptyCell);
  if (!hasEmptyCell) {
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < cols; j++) {
        var value = grid[i][j];
        if (
          (i < rows - 1 && grid[i + 1][j] === value) ||
          (j < cols - 1 && grid[i][j + 1] === value)
        ) {
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
  if (state) {
    // 显示游戏结束界面
    gameover.style.display = "block";
  } else {
    gameover.style.display = "none";
  }
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

var scrollTimeout;
//添加键盘事件监听
document.addEventListener("keydown", function (event) {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(function () {
    if (!gameIsOver) {
      switch (event.key) {
        case "w":
          moveTiles("up");
          break;
        case "a":
          moveTiles("left");
          break;
        case "s":
          moveTiles("down");
          break;
        case "d":
          moveTiles("right");
          break;
      }
    }
  }, 250);
});

// Add touch controls
let touchStartX = 0;
let touchStartY = 0;
// 停止滑动事件

// 防止滚动事件
var preventScroll = function (event) {
  event.preventDefault();
};

// 绑定触摸开始事件
document.addEventListener("touchstart", (event) => {
  // 当画布被触摸时，禁用页面的滚动事件
  document.body.addEventListener("touchmove", preventScroll, {
    passive: false,
  });
});

// 绑定触摸结束事件
document.addEventListener("touchend", (event) => {
  // 当画布被触摸结束时，恢复页面的滚动事件
  document.body.removeEventListener("touchmove", preventScroll);
});

// Set up the touch controls
document.addEventListener("touchstart", (event) => {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
});
document.addEventListener("touchmove", (event) => {
  const touchEndX = event.touches[0].clientX;
  const touchEndY = event.touches[0].clientY;
  const dx = touchEndX - touchStartX;
  const dy = touchEndY - touchStartY;
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(function () {
    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal swipe
      if (dx > 0) {
        moveTiles("right");
      } else {
        moveTiles("left");
      }
    } else {
      // Vertical swipe
      if (dy > 0) {
        moveTiles("down");
      } else {
        moveTiles("up");
      }
    }
  }, 250);
});

// Set up the keyboard controls
document.addEventListener("keydown", (event) => {
  switch (event.keyCode) {
    case 38: // up arrow
      moveTiles("up");
      break;
    case 40: // down arrow
      moveTiles("down");
      break;
    case 37: // left arrow
      moveTiles("left");
      break;
    case 39: // right arrow
      moveTiles("right");
      break;
  }
});
