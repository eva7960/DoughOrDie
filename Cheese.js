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
    const hero = window.OverworldMaps.Outside.gameObjects["hero"];
    //check for collision with hero
    if(state.map.isSpaceTaken(this.x, this.y, this.direction)) {
      if(utils.collide(this, hero)) {
        hero.hit();
      } else {
        this.changeDirection();
      }
    }
    state.map.moveWall(this.x, this.y, this.direction);
    this.x = nextPosition.x;
    this.y = nextPosition.y;
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
    const directions = ["up", "down", "right", "left"];
    let newDirection;

    do {
      newDirection = directions[Math.floor(Math.random() * 4)];
    } while (newDirection === this.direction);

    this.direction = newDirection;
  }

}