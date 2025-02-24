// class Cheese extends GameObject {
//   constructor(config) {
//     super(config);
//     this.health = 30;
//   }
//   update(state) {
//     if (this.speed > 0) {
//       this.speed--;
//       return;
//     }
//     this.speed = 30;
//     const nextPosition = utils.nextPosition(this.x, this.y, this.direction);
//     //check for collision with hero
//     Object.keys(window.OverworldMaps.Outside.gameObjects).forEach(key => {
//       let object = window.OverworldMaps.Outside.gameObjects[key];
//       if (key === "hero" && utils.collide(this, object)) {
//         object.hit();
//       }
//     });
//     // Check for collision with a wall
//     if (nextPosition.x > 1) {
//       this.direction = utils.oppositeDirection(this.direction);
//     }
//     this.x = nextPosition.x;
//     this.y = nextPosition.y;
//     this.sprite.updateAnimationProgress();
//     state.map.moveWall(this.x, this.y, this.direction);
//   }
//
//   hit() {
//     console.log(this.health)
//     this.health = Math.max(this.health - 10, 0);
//     if(this.health === 0) {
//       window.OverworldMaps.Shop.gameObjects["hero"].addItem("cheese", 1);
//       delete window.OverworldMaps.Outside.gameObjects[this.id];
//     }
//   }
// }
class Cheese extends GameObject {
  constructor(config) {
    super(config);
    this.movingProgressRemaining = 0;
    this.health = 100;
    this.directions = ["up", "down", "left", "right"];
    this.directionUpdate = {
      "up": ["y", -1],
      "down": ["y", 1],
      "left": ["x", -1],
      "right": ["x", 1],
    };
  }

  update(state) {
    if (this.movingProgressRemaining > 0) {
      this.updatePosition(state);
    } else {
      this.updateSprite();
    }
  }

  startBehavior(state, behavior) {
    this.changeDirection();
    if(behavior.type === "walk") {
      if(state.map.isSpaceTaken(this.x, this.y, this.direction)) {
        this.changeDirection();
      }
      state.map.moveWall(this.x, this.y, this.direction);
      this.movingProgressRemaining = 16;
      this.updateSprite(state);
    }
  }

  updatePosition(state) {
    const [property, change] = this.directionUpdate[this.direction];
    this[property] += change;
    this.movingProgressRemaining -= 1;

    if (this.movingProgressRemaining === 0) {
      if(state.map.isSpaceTaken(this.x, this.y, this.direction)) {
        this.changeDirection();
      }
      state.map.moveWall(this.x, this.y, this.direction);
      this.movingProgressRemaining = 16;
      this.updateSprite(state);
    }
  }

  updateSprite() {
    if (this.movingProgressRemaining > 0) {
      this.sprite.setAnimation("walk-"+this.direction);
    }
  }
  hit() {
    this.health = Math.max(this.health - 10, 0);
    if(this.health === 0) {
      delete window.OverworldMaps.Outside.gameObjects[this.id];
    }
  }
  changeDirection() {
    let newDirection;
    do {
      newDirection = this.directions[Math.floor(Math.random() * this.directions.length)];
    } while (newDirection === this.direction);
    this.direction = newDirection;
  }
}