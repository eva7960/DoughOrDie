class Cheese2 extends GameObject {
  constructor(config) {
    super(config);
    this.movingProgressRemaining = 0;
    this.health = 100;
    this.directionUpdate = {
      "up": ["y", -1],
      "down": ["y", 1],
      "left": ["x", -1],
      "right": ["x", 1],
    }

  }



  update(state) {
    if (this.movingProgressRemaining > 0) {
      this.updatePosition();
    }
    this.updateSprite(state);
  }

  startBehavior(state, behavior) {
    this.direction = behavior.direction;
    if(behavior.type === "walk") {
      if(state.map.isSpaceTaken(this.x, this.y, this.direction)) {
        behavior.retry && setTimeout(() => {
          this.startBehavior(state, behavior)
        },10)
        return;
      }
      state.map.moveWall(this.x, this.y, this.direction);
      this.movingProgressRemaining = 16;
      this.updateSprite(state);
    }
  }

  updatePosition() {
    const [property, change] = this.directionUpdate[this.direction];
    this[property] += change;
    this.movingProgressRemaining -= 1;

    if (this.movingProgressRemaining === 0) {
      this.movingProgressRemaining = 16;
    }

  }

  updateSprite() {
    if (this.movingProgressRemaining > 0) {
      this.sprite.setAnimation("walk-"+this.direction);
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

}