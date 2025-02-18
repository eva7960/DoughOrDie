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
    const nextPosition = utils.nextPosition(this.x, this.y, this.direction);
    let hero = window.OverworldMaps.Outside.gameObjects["hero"];
    if (state.map.isSpaceTaken(nextPosition.x, nextPosition.y, this.direction) && hero) {
      hero.hit();
    } if(state.map.isSpaceTaken(nextPosition.x, nextPosition.y, this.direction)) {
      this.changeDirection();
    } else {
      // Update position if no wall detected
      this.x = nextPosition.x;
      this.y = nextPosition.y;
      this.sprite.updateAnimationProgress();
    }

  }


  hit() {
    console.log(this.health)
    this.health = Math.max(this.health - 10, 0);
    if(this.health === 0) {
      window.OverworldMaps.Outside.gameObjects["hero"].addItem("cheese", 1);
      delete window.OverworldMaps.Outside.gameObjects[this.id];
    }
  }
  changeDirection() {
    const random = Math.floor(Math.random() * 4);
    if(random === 0) {
      this.direction = "up"
    } else if(random === 1) {
      this.direction = "down"
    } else if(random === 2) {
      this.direction = "right"
    } else {
      this.direction = "left"
    }
  }
}