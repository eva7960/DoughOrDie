class Cheese extends GameObject {
  constructor(config) {
    super(config);
    this.health = 30;
    this.speed = 1;
    this.direction = "right";
    this.directionUpdate = {
      "up": ["y", -1],
      "down": ["y", 1],
      "left": ["x", -1],
      "right": ["x", 1],
    }
  }
  update(state) {
      if (this.speed > 0) {
        this.speed--;
        return;
      }
      this.speed = 2; // Adjust to control speed

      const nextPosition = utils.nextPosition(this.x, this.y, this.direction);
      const directions = ["up", "down", "left", "right"];

      if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
        let newDirection;
        do {
          newDirection = directions[Math.floor(Math.random() * directions.length)];
        } while (newDirection === this.direction); // Ensure different direction
        this.direction = newDirection;
      }

      Object.keys(window.OverworldMaps.Outside.gameObjects).forEach(key => {
        let object = window.OverworldMaps.Outside.gameObjects[key];
        if (object instanceof Person && utils.collide(this, object)) {
          object.hit(); // Apply hit if collision detected
          delete window.OverworldMaps.Outside.gameObjects[this.id];
        } else {
          this.x = nextPosition.x;
          this.y = nextPosition.y;
          this.sprite.updateAnimationProgress();
        }
      });
  }

  hit() {
    console.log(this.health)
    this.health = Math.max(this.health - 10, 0);
    if(this.health === 0) {
      window.OverworldMaps.Outside.gameObjects["hero"].addItem("cheese", 1);
      delete window.OverworldMaps.Outside.gameObjects[this.id];
    }
  }

}