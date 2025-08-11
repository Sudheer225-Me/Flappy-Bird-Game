const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const bird = {
  x: 50,
  y: 150,
  radius: 20,
  gravity: 0.1,
  lift: -4,
  velocity: 0,
};

const pipes = [];
const pipeWidth = 60;
const pipeGap = 200;
const pipeSpeed = 2;

let score = 0;
let isGameRunning = false;
let isPaused = false;
let animationFrame;

const flapSound = document.getElementById('flap-sound');
const hitSound = document.getElementById('hit-sound');

function drawBird() {
  ctx.font = `${bird.radius * 2}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🐦', bird.x, bird.y);
}

function drawPipes() {
  pipes.forEach(pipe => {
    ctx.fillStyle = 'green';
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.fillRect(pipe.x, pipe.top + pipeGap, pipeWidth, canvas.height - pipe.top - pipeGap);
  });
}

function drawScore() {
  document.getElementById('score').textContent = `Score: ${score}`;
}

function updateBird() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;
  if (bird.y > canvas.height || bird.y < 0) {
    endGame();
  }
}

function updatePipes() {
  if (frames % 150 === 0) {
    const topHeight = Math.random() * (canvas.height / 2);
    pipes.push({ x: canvas.width, top: topHeight, passed: false });
  }
  pipes.forEach(pipe => {
    pipe.x -= pipeSpeed;
    if (!pipe.passed && bird.x > pipe.x + pipeWidth) {
      score++;
      pipe.passed = true;
    }
    if (pipe.x + pipeWidth < 0) {
      pipes.shift();
    }
    if (
      bird.x + bird.radius > pipe.x &&
      bird.x - bird.radius < pipe.x + pipeWidth &&
      (bird.y - bird.radius < pipe.top || bird.y + bird.radius > pipe.top + pipeGap)
    ) {
      endGame();
    }
  });
}

function gameLoop() {
  if (!isGameRunning || isPaused) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBird();
  drawPipes();
  drawScore();
  updateBird();
  updatePipes();

  frames++;
  animationFrame = requestAnimationFrame(gameLoop);
}

function startGame() {
  if (!isGameRunning) {
    resetGame();
    isGameRunning = true;
    gameLoop();
  }
}

function pauseGame() {
  if (isPaused) {
    isPaused = false;
    gameLoop();
    document.getElementById('pause-button').textContent = 'Pause';
  } else {
    isPaused = true;
    cancelAnimationFrame(animationFrame);
    document.getElementById('pause-button').textContent = 'Resume';
  }
}

function restartGame() {
  isGameRunning = false;
  cancelAnimationFrame(animationFrame);
  resetGame();
  startGame();
}

function resetGame() {
  bird.y = 150;
  bird.velocity = 0;
  pipes.length = 0;
  score = 0;
  frames = 0;
}

function endGame() {
  hitSound.play();
  isGameRunning = false;
  alert(`Game Over! Your Score: ${score}`);
}

let frames = 0;

window.addEventListener('click', () => {
  if (isGameRunning && !isPaused) {
    bird.velocity = bird.lift;
    flapSound.play();
  }
});

document.getElementById('start-button').addEventListener('click', startGame);
document.getElementById('pause-button').addEventListener('click', pauseGame);
document.getElementById('restart-button').addEventListener('click', restartGame);
