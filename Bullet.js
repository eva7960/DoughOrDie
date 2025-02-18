class Bullet extends GameObject {
    constructor(config) {
        super(config);
        this.direction = config.direction;
        this.sprite = new Sprite({
            gameObject: this,
            src: config.src,
            animations: {
                "up": [[0, 0]],
                "down": [[1, 0]],
                "left": [[2, 0]],
                "right": [[3, 0]],
            }
        });
        this.sprite.setAnimation(this.direction);
    }

    update(state) {
        const nextPosition = utils.nextPosition(this.x, this.y, this.direction);
        // Check for collision with all gameObjects at the next position
        Object.keys(window.OverworldMaps.Outside.gameObjects).forEach(key => {
            let object = window.OverworldMaps.Outside.gameObjects[key];
            if (object instanceof Cheese && state.map.isSpaceTaken(nextPosition.x, nextPosition.y, this.direction)) {
                object.hit(); // Apply hit if collision detected
                delete window.OverworldMaps.Outside.gameObjects[this.id];
            } else {
                this.x = nextPosition.x;
                this.y = nextPosition.y;
                this.sprite.updateAnimationProgress();
            }
        });
    }


}
