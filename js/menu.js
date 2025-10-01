const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Draw retro border

function drawBackground() {
  ctx.fillStyle = "#b3e5fc"; //sky back
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#333";
  ctx.lineWidth = 8;
  ctx.strokeRect (0, 0, canvas.width, canvas.height);
}

const pandaImg = new Image();
pandaImg.src = "./assets/images/panda1.png";

function drawPanda(x, y) {
  const size = canvas.width *0.15;
  ctx.drawImage(pandaImg, x - size / 2, y - size / 2, size, size);
}

function drawTitle() {
  ctx.fillStyle = "black"
  ctx.font = "bold 28px monospace";
  ctx.textAlign = "center";
  ctx.fillText("🐼 Panda Jump 🐼", canvas.width /2, canvas.height * 0.25);

  ctx.font = "16px monospace"
  ctx.fillText("Press space or click to Start", canvas.width /2, canvas.height * 0.35);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawTitle();
  drawPanda(canvas.width / 2, canvas.height *0.9);
  
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => {
  if(e.code === "Space") {
    window.location.href = "pages/level1.html"; 
  }
})

canvas.addEventListener("click", () => {
  window.location.href = "pages/level1.html";
})


gameLoop();