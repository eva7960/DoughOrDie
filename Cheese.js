class Cheese extends GameObject {
  constructor(config) {
    super(config);
    this.health = 30;
  }
  update(state) {
    if (this.speed > 0) {
      this.speed--;
      return;
    }
    this.speed = 30;
    const nextPosition = utils.nextPosition(this.x, this.y, this.direction);
    //check for collision with hero
    Object.keys(window.OverworldMaps.Outside.gameObjects).forEach(key => {
      let object = window.OverworldMaps.Outside.gameObjects[key];
      if (key === "hero" && utils.collide(this, object)) {
        object.hit();
      }
    });
    // Check for collision with a wall
    if (nextPosition.x > 1) {
      this.direction = utils.oppositeDirection(this.direction);
    }
    this.x = nextPosition.x;
    this.y = nextPosition.y;
    this.sprite.updateAnimationProgress();
    state.map.moveWall(this.x, this.y, this.direction);
  }

  hit() {
    console.log(this.health)
    this.health = Math.max(this.health - 10, 0);
    if(this.health === 0) {
      window.OverworldMaps.Shop.gameObjects["hero"].addItem("cheese", 1);
      delete window.OverworldMaps.Outside.gameObjects[this.id];
    }
  }
}