// Basic game setup

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Player setup
const player = {
    x: 400,
    y: 300,
    width: 50,
    height: 50,
    speed: 5,
    hp: 100,
    color: "blue"
};

// Bullet setup
const bullets = [];
const bulletSpeed = 6.5;
const bulletImage = new Image();
bulletImage.src = '/static/images/bullet.png';

// Handle key press
let keys = {};

document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});
document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

// Game loop
function gameLoop() {
    updateGame();
    drawGame();
    requestAnimationFrame(gameLoop);
}

function updateGame() {
    if (keys["ArrowLeft"]) player.x -= player.speed;
    if (keys["ArrowRight"]) player.x += player.speed;
    if (keys["ArrowUp"]) player.y -= player.speed;
    if (keys["ArrowDown"]) player.y += player.speed;

    // Spawn bullet randomly
    if (Math.random() < 0.075) {
        spawnBullet();
    }

    // Update bullet positions
    for (let i = bullets.length - 1; i >= 0; i--) {
        let bullet = bullets[i];
        bullet.x += bullet.dx * bulletSpeed;
        bullet.y += bullet.dy * bulletSpeed;

        // Collision detection
        if (collides(player, bullet)) {
            player.hp -= 10;
            bullets.splice(i, 1);
        }

        // Remove bullet if out of bounds
        if (bullet.x < -30 || bullet.x > 830 || bullet.y < -30 || bullet.y > 630) {
            bullets.splice(i, 1);
        }
    }

    // Update HP display
    document.getElementById('hp').innerText = 'HP: ' + player.hp;
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw bullets
    bullets.forEach(bullet => {
        ctx.drawImage(bulletImage, bullet.x, bullet.y, 30, 30);
    });
}

// Bullet spawning
function spawnBullet() {
    let bullet = {
        x: Math.random() * canvas.width,
        y: 0,
        dx: (player.x - Math.random() * canvas.width) / 100, // Bullet direction
        dy: (player.y - Math.random() * canvas.height) / 100
    };
    bullets.push(bullet);
}

// Collision detection
function collides(player, bullet) {
    return bullet.x < player.x + player.width &&
           bullet.x + 30 > player.x &&
           bullet.y < player.y + player.height &&
           bullet.y + 30 > player.y;
}

// Start game loop
gameLoop();
