class Person extends GameObject {
  constructor(config) {
    super(config);
    this.movingProgressRemaining = 0;
    this.isStanding = false;
    this.isPlayerControlled = config.isPlayerControlled || false;
    this.canShoot = this.isPlayerControlled;  // Only player-controlled characters can shoot

    // Bind shoot method to the current instance
    this.shoot = this.shoot.bind(this);

    this.directionUpdate = {
      "up": ["y", -1],
      "down": ["y", 1],
      "left": ["x", -1],
      "right": ["x", 1],
    };

    // Add KeyPressListener for Shift key
    if (this.isPlayerControlled) {
      new KeyPressListener("Shift", () => {
        this.shoot();
      });
    }
  }

  // Define the shoot method
  shoot() {
    if (!this.canShoot) {
      console.log("This character cannot shoot.");
      return;  // Don't shoot if the character is not allowed to shoot
    }

    const dirX = Math.cos(this.getAngle());
    const dirY = Math.sin(this.getAngle());
    const x = this.getX();
    const y = this.getY();

    const radius = 32 * 0.5; // Bullet radius offset
    const bx = x + dirX * radius; // Bullet's starting X position
    const by = y + dirY * radius; // Bullet's starting Y position

    // Create a new Bullet and pass in the canvas context
    new Bullet({}, bx, by); // No need to pass context if it's handled by Bullet itself
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
    this.angle = this.getAngle(); // Update the angle based on the new direction

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