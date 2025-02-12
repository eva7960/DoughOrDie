class Bullet extends GameObject {
    constructor(config) {
        super(config);

        // Bullet-specific properties
        this.speed = 7; // Speed of the bullet
        this.direction = config.direction; // Direction to move the bullet

        // Bullet uses the same sprite as hero (or any other object)
        this.sprite = new Sprite({
            gameObject: this,
            src: config.src, // Bullet sprite image (could be the same sprite sheet as the hero)
            animations: {
                // You can use the same animations as the hero, just add a "bullet-" prefix if needed
                "bullet-up": [[0, 0]],
                "bullet-down": [[1, 0]],
                "bullet-left": [[2, 0]],
                "bullet-right": [[3, 0]],
            }
        });

        // Set the initial animation based on direction
        this.sprite.setAnimation(`bullet-${this.direction}`);
    }

    update() {
        // Move the bullet based on its direction
        if (this.direction === "up") {
            this.y -= this.speed;
        } else if (this.direction === "down") {
            this.y += this.speed;
        } else if (this.direction === "left") {
            this.x -= this.speed;
        } else if (this.direction === "right") {
            this.x += this.speed;
        }

        // Update the animation (if needed)
        this.sprite.updateAnimationProgress();
    }

    draw(ctx) {
        // Draw the sprite (bullet image)
        this.sprite.draw(ctx);
    }
}
