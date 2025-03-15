class Ingredient {
    constructor(config, health, speed, name) {
        this.id = null;
        this.x = config.x;
        this.y = config.y;
        this.direction = "down";
        this.health = health;
        this.maxHealth = this.health;
        this.name = name;
        this.movingProgressRemaining = 0;
        this.speed = speed;
        this.lastDirectionChangeTime = Date.now();
        //damage ingredents take
        this.damage = 10; 
        this.directionMap = {
            up: { x: 0, y: -1 },
            down: { x: 0, y: 1 },
            left: { x: -1, y: 0 },
            right: { x: 1, y: 0 },
        };
    }

    update(state) {
        if (this.movingProgressRemaining > 0) {
            this.updatePosition();
            return;
        }
        let hero = state.map.gameObjects.hero;
        if(utils.collide(this,hero)) {
            hero.hit();
        }
        if (Date.now() - this.lastDirectionChangeTime >= 5000) {
            this.changeDirection();
            this.lastDirectionChangeTime = Date.now();
            return;
        }
        // Check if movement is blocked
        const nextPosition = utils.nextPosition(this.x, this.y, this.direction);
        if (state.map.isSpaceTaken(this.x, this.y, this.direction) ||
            (nextPosition.x <= 20 && nextPosition.y <= 25)) {
            this.changeDirection();
            return;
        }


        // Start movement
        this.movingProgressRemaining = 16;
    }

    updatePosition() {
        if (this.movingProgressRemaining > 0) {
            this.x += this.directionMap[this.direction].x * this.speed;
            this.y += this.directionMap[this.direction].y * this.speed;
            this.movingProgressRemaining -= this.speed;

            // Snap to grid when movement completes
            if (this.movingProgressRemaining <= 0) {
                this.x = Math.round(this.x / 16) * 16;
                this.y = Math.round(this.y / 16) * 16;
                this.movingProgressRemaining = 0;
            }
        }
    }
    hit(damage) {
        this.health = Math.max(this.health - damage, 0);
        if(this.health === 0) {
          window.OverworldMaps.Shop.gameObjects["hero"].addItem(this.name, 1);
          window.OverworldMaps.Outside.gameObjects["hero"].addItem(this.name, 1);
          console.log(this.id);
          delete window.OverworldMaps.Outside.gameObjects[this.id];
        }
      }

    changeDirection() {
        const directions = ["up", "down", "left", "right"];
        let newDirection;
        do {
            newDirection = directions[Math.floor(Math.random() * 4)];
        } while (newDirection === this.direction);
        this.direction = newDirection;
    }
    mount() {

    }
}
