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
      this.speed--; // Slow down movement
      return;
    }
    this.speed = 10;
    const nextPosition = utils.nextPosition(this.x, this.y, this.direction);


    // Check for collision with all gameObjects at the next position
    Object.keys(window.OverworldMaps.Outside.gameObjects).forEach(key => {
      let object = window.OverworldMaps.Outside.gameObjects[key];
      if (key === "hero" && utils.collide(this,object)) {
        object.hit(); // Apply hit if collision detected
      }
    });

    // Check if the next position is taken by a wall
    if (state.map.isSpaceTaken(nextPosition.x, nextPosition.y, this.direction)) {
      this.changeDirection(); // Change direction if space is taken by a wall
    } else {
      // Update position if no collisions or wall detected
      this.x = nextPosition.x;
      this.y = nextPosition.y;
    }
  }

  hit() {
    console.log(this.health)
    this.health = Math.max(this.health - 10, 0);
    if(this.health === 0) {
      window.OverworldMaps.Shop.gameObjects["hero"].addItem("cheese", 1);
      delete window.OverworldMaps.Outside.gameObjects[this.id];
    }
  }
  changeDirection() {
    let newDirection = "";
    while (newDirection !== this.direction) {
      const random = Math.floor(Math.random() * 4);
      if (random === 0) {
        newDirection = "up"
      } else if (random === 1) {
        newDirection = "down"
      } else if (random === 2) {
        newDirection = "right"
      } else {
        newDirection = "left"
      }
    }
    this.direction = newDirection;
  }
}