import pygame from 'pygame';
import random from 'random';
import math from 'math';

// Initialize pygame
pygame.init();

// Screen setup
const screen = pygame.display.set_mode((800, 600));
pygame.display.set_caption('Undertale Battle');

// Colors
const WHITE = (255, 255, 255);
const RED = (255, 0, 0);
const BLUE = (0, 0, 255);

// Fonts
const font = pygame.font.SysFont('Arial', 30);


// Player class
class Player extends pygame.sprite.Sprite {
    constructor() {
        super();
        this.image = pygame.Surface((50, 50));
        this.image.fill(BLUE);
        this.rect = this.image.get_rect();
        this.rect.center = (400, 300);
        this.hp = 100;
    }

    update() {
        const keys = pygame.key.get_pressed();
        if (keys[pygame.K_LEFT]) {
            this.rect.x -= 5;
        }
        if (keys[pygame.K_RIGHT]) {
            this.rect.x += 5;
        }
        if (keys[pygame.K_UP]) {
            this.rect.y -= 5;
        }
        if (keys[pygame.K_DOWN]) {
            this.rect.y += 5;
        }
    }
}


// Bullet (enemy projectile)
class Bullet extends pygame.sprite.Sprite {
    constructor(x, y, player) {
        super();
        this.image = pygame.image.load("bullet.png");
        this.rect = this.image.get_rect();
        this.rect.center = (x, y);

        // Direction vector (bullet -> player)
        this.dx = player.rect.centerx - this.rect.centerx;
        this.dy = player.rect.centery - this.rect.centery;

        // Normalize the direction vector
        const length = Math.sqrt(this.dx ** 2 + this.dy ** 2);
        this.dx /= length;
        this.dy /= length;

        // Speed (change this to make the bullet faster/slower)
        this.speed = 6.5;
    }

    update() {
        // Move the bullet toward the player
        this.rect.x += this.dx * this.speed;
        this.rect.y += this.dy * this.speed;

        // If the bullet moves off-screen, remove it
        if (this.rect.x < -30 || this.rect.x > 830 || this.rect.y < -30 || this.rect.y > 630) {
            this.kill();
        }
    }
}


// Game loop
const player = new Player();
const all_sprites = new pygame.sprite.Group(player);
const bullets = new pygame.sprite.Group();

let running = true;
const clock = pygame.time.Clock();
let atk_ = 1;

while (running) {
    for (const event of pygame.event.get()) {
        if (event.type === pygame.QUIT) {
            running = false;
        }
    }

    if (atk_ === 1) {
        if (random.random() < 0.075) {
            // Spawn the bullet at a random position and pass the player object for direction calculation
            const bullet = new Bullet(random.randint(0, 800), 0, player);
            bullets.add(bullet);
            all_sprites.add(bullet);
        }
    }

    // Update game state
    all_sprites.update();

    // Collision detection
    if (pygame.sprite.spritecollide(player, bullets, true)) {
        player.hp -= 10;  // Example damage
    }

    // Draw everything
    screen.fill(WHITE);
    all_sprites.draw(screen);

    // Draw HP
    const hp_text = font.render(`HP: ${player.hp}`, true, (0, 0, 0));
    screen.blit(hp_text, (10, 10));

    pygame.display.flip();
    clock.tick(60);
}

pygame.quit();

