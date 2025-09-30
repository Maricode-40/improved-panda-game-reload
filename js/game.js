// ==========================
// Global State & Config
// ==========================
const CONFIG = { JUMP_SPEED: 5.5, TOTAL_LAPS: 2 };

let state = {
  JUMP_HEIGHT: 0,
  OBSTACLE_WIDTH: 0,
  isJumping: false,
  score: 0,
  gameSpeed: 0,
  gameRunning: true,
  playerX: 20,
  lapCount: 0,
};

let dom = {}; // will hold refs to elements
let sounds = {}; // will hold audio

// ==========================
// 1) Init (DOM + Sounds)
// ==========================
function initDOM() {
  dom = {
    game: document.querySelector(".game"),
    player: document.getElementById("player"),
    obstacle: document.getElementById("obstacle"),
    goal: document.getElementById("goal"),
    scoreOutput: document.getElementById("score"),
    gameOverText: document.getElementById("game-over"),
  };
}
function initSounds() {
  sounds = {
    jump: new Audio("../assets/sounds/jumping-sound.wav"),
    gameOver: new Audio("../assets/sounds/drowning.mp3"),
    win: new Audio("../assets/sounds/game-win-other.mp3"),
  };
  sounds.jump.volume = 0.4;
}

// ==========================
// 2) Resize & Helpers
// ==========================
function resizeGame() {
  state.JUMP_HEIGHT = dom.game.clientHeight * 0.3;
  state.OBSTACLE_WIDTH = dom.game.clientWidth * 0.07;
  state.gameSpeed = dom.game.clientWidth * 0.01;
  dom.goal.style.display = "none";
  dom.obstacle.style.right = `-${state.OBSTACLE_WIDTH}px`; // reset
}

// ==========================
// 3) Actions (jump / move / obstacle)
// ==========================
function jump() {
  if (state.isJumping || !state.gameRunning) return;
  state.isJumping = true;

  sounds.jump.pause();
  sounds.jump.currentTime = 0;
  sounds.jump.play().catch(() => {});

  let bottom = 0,
    up = true;
  const tick = () => {
    if (!up && bottom <= 0) {
      state.isJumping = false;
      return;
    }
    if (up && bottom >= state.JUMP_HEIGHT) up = false;

    bottom += up ? CONFIG.JUMP_SPEED : -CONFIG.JUMP_SPEED;
    dom.player.style.bottom = `${bottom}px`;
    dom.player.style.left = `${state.playerX}px`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function movePlayerForward() {
  const maxRight = dom.game.clientWidth - dom.player.offsetWidth;
  if (state.playerX < maxRight) {
    state.playerX += 2;
    dom.player.style.left = `${state.playerX}px`;
  } else {
    // lap complete → snap back left, keep transition smooth after a frame
    dom.player.style.transition = "none";
    state.playerX = 20;
    dom.player.style.left = "20px";
    requestAnimationFrame(
      () => (dom.player.style.transition = "left 0.1s linear")
    );

    state.lapCount++;
    if (state.lapCount >= CONFIG.TOTAL_LAPS) dom.goal.style.display = "block";
    dom.obstacle.style.right = `-${state.OBSTACLE_WIDTH}px`; // reset fountain
  }
}

function updateObstaclePosition() {
  const currentRight = parseInt(getComputedStyle(dom.obstacle).right) || 0;
  if (currentRight > dom.game.clientWidth) {
    dom.obstacle.style.right = `-${state.OBSTACLE_WIDTH}px`;
    state.score++;
    dom.scoreOutput.textContent = state.score;
    if (state.score % 10 === 0) state.gameSpeed += dom.game.clientWidth * 0.001;
  } else {
    dom.obstacle.style.right = `${currentRight + state.gameSpeed}px`;
  }
}

// ==========================
// 4) Collision
// ==========================
function checkCollision() {
  const p = dom.player.getBoundingClientRect();
  const o = dom.obstacle.getBoundingClientRect();
  const g = dom.goal.getBoundingClientRect();

  const hitObstacle =
    p.left < o.right &&
    p.right > o.left &&
    p.top < o.bottom &&
    p.bottom > o.top;
  if (hitObstacle) {
    endGame(false);
    return;
  }

  if (dom.goal.style.display === "block") {
    const reachedGoal = p.right >= g.left && p.left <= g.right;
    if (reachedGoal) endGame(true);
  }
}

// ==========================
// 5) Lifecycle (loop / end)
// ==========================
function gameLoop() {
  if (!state.gameRunning) return;
  movePlayerForward();
  updateObstaclePosition();
  checkCollision();
  requestAnimationFrame(gameLoop);
}

function endGame(win) {
  state.gameRunning = false;
  dom.gameOverText.hidden = false;
  dom.gameOverText.textContent = win ? "🎉 YOU WIN! 🐼" : "GAME OVER 💦";
  (win ? sounds.win : sounds.gameOver).play().catch(() => {});
  if (win) dom.obstacle.style.display = "none";
}

// ==========================
// 6) Controls
// ==========================
function initControls() {
  document.addEventListener(
    "keydown",
    (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (!state.gameRunning) location.reload();
        else jump();
      }
    },
    { passive: false }
  );

  dom.game.addEventListener("click", () => {
    if (!state.gameRunning) location.reload();
    else jump();
  });

  window.addEventListener("resize", resizeGame);
}

// ==========================
// Boot
// ==========================
function startGame() {
  initDOM();
  initSounds();
  resizeGame();
  initControls();
  gameLoop();
}
startGame();
