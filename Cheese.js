class Cheese {
  constructor(config) {
    this.id = null;
    this.x = config.x;
    this.y = config.y;
    this.direction = "down";
    this.sprite = new Sprite({
      gameObject: this,
      src: "./sprites/cheese.png",
    });
    this.health = 30;
    this.movingProgressRemaining = 0; // Track movement like the hero
    this.speed = 0.5;

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

    // Pick next tile position
    // const nextX = this.x + this.directionMap[this.direction].x * 16;
    // const nextY = this.y + this.directionMap[this.direction].y * 16;
    let hero = state.map.gameObjects.hero;
    if(utils.collide(this,hero)) {
      hero.hit();
    }
    // Check if movement is blocked
    if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
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
  hit() {
    console.log(this.health);
    this.health = Math.max(this.health - 10, 0)
    if(this.health === 0) {
      window.OverworldMaps.Outside.gameObjects["hero"].addItem("cheese", 1);
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
