class Person extends GameObject {
  constructor(config) {
    super(config);
    this.movingProgressRemaining = 0;
    this.isStanding = false;
    this.health = 100;
    this.isHero = config.isHero || false;
    this.armor = 0; 
    this.score = 0;
    //this.score = 1000;
    this.inventory = {};
    //this.inventory = config.inventory || {cheese: 11, pepperoni: 11, sausage: 11, meatball: 11, mushroom: 11, pineapple: 11, olive: 11, pepper: 11, ham: 11};

    this.isPlayerControlled = config.isPlayerControlled || false;

    this.directionUpdate = {
      "up": ["y", -1],
      "down": ["y", 1],
      "left": ["x", -1],
      "right": ["x", 1],
    }

  }

  addItem(item, amount = 1) {
    if (this.inventory.hasOwnProperty(item)) {
      this.inventory[item] += amount;
    } else {
      this.inventory[item] = amount;
    }
  }

  update(state) {
    if (window.overworld.isGameOver) return;
    state.map.deleteWall(0,-1);
    if (this.movingProgressRemaining > 0) {
      this.updatePosition();
    } else {
      if (!state.map.isCutScenePlaying && this.isPlayerControlled && state.arrow) {
        this.startBehavior(state, {
          type: "walk",
          direction: state.arrow
        });
      }
      this.updateSprite(state);
    }
  }


  startBehavior(state, behavior) {
    this.direction = behavior.direction;
    const nextPosition = utils.nextPosition(this.x, this.y, this.direction);
    if (behavior.type === "walk") {
      if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
        behavior.retry && setTimeout(() => {
          this.startBehavior(state, behavior)
        }, 10)
        return;
      }
      //state.map.moveWall(this.x, this.y, this.direction);
      this.movingProgressRemaining = 16;
      this.updateSprite(state);
    }

    if (behavior.type === "stand") {
      this.isStanding = true;
      setTimeout(() => {
        utils.emitEvent("PersonStandComplete", {
          whoId: this.id
        })
        this.isStanding = false;
      }, behavior.time)
    }
  }

  updatePosition() {
    const [property, change] = this.directionUpdate[this.direction];
    this[property] += change;
    this.movingProgressRemaining -= 1;

    if (this.movingProgressRemaining === 0) {
      utils.emitEvent("PersonWalkingComplete", {
        whoId: this.id
      })
    }
  }

  updateSprite() {
    if (this.movingProgressRemaining > 0) {
      this.sprite.setAnimation("walk-" + this.direction);
      return;
    }
    this.sprite.setAnimation("idle-" + this.direction);
  }

  hit() {
    this.health = Math.max(this.health - (10 - this.armor), 0);
  }
}