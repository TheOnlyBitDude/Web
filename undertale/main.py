import pygame
import random
import math

# Initialize pygame
pygame.init()

# Screen setup
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption('Undertale Battle')

# Colors
WHITE = (255, 255, 255)
RED = (255, 0, 0)
BLUE = (0, 0, 255)

# Fonts
font = pygame.font.SysFont('Arial', 30)


# Player class
class Player(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()
        self.image = pygame.Surface((50, 50))
        self.image.fill(BLUE)
        self.rect = self.image.get_rect()
        self.rect.center = (400, 300)
        self.hp = 100

    def update(self):
        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT]:
            self.rect.x -= 5
        if keys[pygame.K_RIGHT]:
            self.rect.x += 5
        if keys[pygame.K_UP]:
            self.rect.y -= 5
        if keys[pygame.K_DOWN]:
            self.rect.y += 5


# Bullet (enemy projectile)
class Bullet(pygame.sprite.Sprite):
    def __init__(self, x, y, player):
        super().__init__()
        self.image = pygame.image.load("bullet.png")
        self.rect = self.image.get_rect()
        self.rect.center = (x, y)

        # Direction vector (bullet -> player)
        self.dx = player.rect.centerx - self.rect.centerx
        self.dy = player.rect.centery - self.rect.centery

        # Normalize the direction vector
        length = math.sqrt(self.dx ** 2 + self.dy ** 2)
        self.dx /= length
        self.dy /= length

        # Speed (change this to make the bullet faster/slower)
        self.speed = 6.5

    def update(self):
        # Move the bullet toward the player
        self.rect.x += self.dx * self.speed
        self.rect.y += self.dy * self.speed

        # If the bullet moves off-screen, remove it
        if self.rect.x < -30 or self.rect.x > 830 or self.rect.y < -30 or self.rect.y > 630:
            self.kill()


# Game loop
player = Player()
all_sprites = pygame.sprite.Group(player)
bullets = pygame.sprite.Group()

running = True
clock = pygame.time.Clock()
atk_=1

while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    if atk_ == 1:
        if random.random() < 0.075:
            # Spawn the bullet at a random position and pass the player object for direction calculation
            bullet = Bullet(random.randint(0, 800), 0, player)
            bullets.add(bullet)
            all_sprites.add(bullet)

    # Update game state
    all_sprites.update()

    # Collision detection
    if pygame.sprite.spritecollide(player, bullets, True):
        player.hp -= 10  # Example damage

    # Draw everything
    screen.fill(WHITE)
    all_sprites.draw(screen)

    # Draw HP
    hp_text = font.render(f'HP: {player.hp}', True, (0, 0, 0))
    screen.blit(hp_text, (10, 10))

    pygame.display.flip()
    clock.tick(60)

pygame.quit()
