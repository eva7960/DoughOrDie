class Person extends GameObject {
  constructor(config) {
    super(config);
    this.movingProgressRemaining = 0;
    this.isStanding = false; 
    this.health = 100;
    this.score = 0;
    this.inventory = config.inventory || {cheese: 1, pepperoni: 1, sausage: 1, meatball: 1, mushroom: 1, pineapple: 1, olive: 1,
      peppers: 1, 
    };

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

  setItem(item, amount) {
    this.inventory[item] = amount;
  }

  removeItem(item, amount = 1) {
    if (this.inventory.hasOwnProperty(item)) {
      this.inventory[item] = Math.max(0, this.inventory[item] - amount);
    }
  }

  addItem(item, amount = 1) {
    if (this.inventory.hasOwnProperty(item)) {
      this.inventory[item] += amount;
    } else {
      this.inventory[item] = amount;
    }
  }
  
  setItem(item, amount) {
    this.inventory[item] = amount;
  }

  removeItem(item, amount = 1) {
    if (this.inventory.hasOwnProperty(item)) {
      this.inventory[item] = Math.max(0, this.inventory[item] - amount);
    }
  }

  update(state) {
    if (this.movingProgressRemaining > 0) {
      this.updatePosition();
    } else {
      if (!state.map.isCutScenePlaying && this.isPlayerControlled && state.arrow) {
        this.startBehavior(state, {
          type: "walk",
          direction: state.arrow
        })
      }
    this.updateSprite(state);
    }
  }

  startBehavior(state, behavior) {
    this.direction = behavior.direction;

    if(behavior.type === "walk") {
    //console.log(state.map.isSpaceTaken(this.x, this.y, this.direction));
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
      this.sprite.setAnimation("walk-"+this.direction);
      return;
    }
    this.sprite.setAnimation("idle-"+this.direction);
  }

}