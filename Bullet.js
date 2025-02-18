class Bullet extends GameObject {
    constructor(config) {
        super(config);

        // Bullet-specific properties
        this.speed = 5; // Speed of the bullet
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

        const nextPosition = utils.nextPosition(this.x, this.y, this.direction);

        // Check for collision with all gameObjects at the next position
        Object.keys(window.OverworldMaps.Outside.gameObjects).forEach(key => {
            let object = window.OverworldMaps.Outside.gameObjects[key];

            // If the object is a cheese and the next position collides
            if (object instanceof Ingredient && utils.collide(this, object)) {
                object.hit(); // Apply hit if collision detected
                delete this.id;
            } else {
                this.x = nextPosition.x;
                this.y = nextPosition.y;
                this.sprite.updateAnimationProgress();
            }
        });
    }


}
