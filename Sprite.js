class Sprite {
  constructor(config) {
    // Set up the image
    this.image = new Image();
    this.image.src = config.src;
    this.image.onload = () => {
      this.isLoaded = true;
    };

    // Shadow
    this.shadow = new Image();
    this.useShadow = config.useShadow !== undefined ? config.useShadow : true;
    if (this.useShadow) {
      this.shadow.src = "./sprites/shadow.png";
    }
    this.shadow.onload = () => {
      this.isShadowLoaded = true;
    };

    // Configure Animation & Initial State
    this.animations = config.animations || {
      "idle-down": [[0, 0]],
      "idle-right": [[0, 1]],
      "idle-up": [[0, 2]],
      "idle-left": [[0, 3]],
      "walk-down": [[1, 0], [0, 0], [3, 0], [0, 0]],
      "walk-right": [[1, 1], [0, 1], [3, 1], [0, 1]],
      "walk-up": [[1, 2], [0, 2], [3, 2], [0, 2]],
      "walk-left": [[1, 3], [0, 3], [3, 3], [0, 3]]
    };
    this.currentAnimation = "idle-right";
    this.currentAnimationFrame = 0;

    this.animationFrameLimit = config.animationFrameLimit || 8;
    this.animationFrameProgress = this.animationFrameLimit;

    // Reference the game object
    this.gameObject = config.gameObject;
    this.hasHealthBar = config.hasHealthBar || false; // Enable health bar if set
  }

  get frame() {
    return this.animations[this.currentAnimation][this.currentAnimationFrame];
  }

  setAnimation(key) {
    if (this.currentAnimation !== key) {
      this.currentAnimation = key;
      this.currentAnimationFrame = 0;
      this.animationFrameProgress = this.animationFrameLimit;
    }
  }

  updateAnimationProgress() {
    if (this.animationFrameProgress > 0) {
      this.animationFrameProgress -= 1;
      return;
    }

    this.animationFrameProgress = this.animationFrameLimit;
    this.currentAnimationFrame += 1;

    if (this.frame === undefined) {
      this.currentAnimationFrame = 0;
    }
  }

  draw(ctx) {
    const x = this.gameObject.x - 8;
    const y = this.gameObject.y - 18;

    this.isShadowLoaded && ctx.drawImage(this.shadow, x, y);

    const [frameX, frameY] = this.frame;

    this.isLoaded &&
    ctx.drawImage(
        this.image,
        frameX * 32,
        frameY * 32,
        32,
        32,
        x,
        y,
        32,
        32
    );

    this.updateAnimationProgress();

    // Draw health bar if applicable
    if (this.hasHealthBar && this.gameObject.health !== undefined) {
      this.drawHealthBar(ctx, x, y);
    }
  }

  drawHealthBar(ctx, x, y) {
    const barWidth = 20;
    const barHeight = 4;
    const yOffset = y + 8; // Move it closer to the sprite
    const xOffset = x + 7;

    const healthRatio = this.gameObject.health / this.gameObject.maxHealth;
    const currentWidth = Math.max(0, barWidth * healthRatio);

    // Background bar (red)
    ctx.fillStyle = "red";
    ctx.fillRect(xOffset, yOffset, barWidth, barHeight);

    // Current health (green)
    ctx.fillStyle = "green";
    ctx.fillRect(xOffset, yOffset, currentWidth, barHeight);

    // Black outline
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.strokeRect(xOffset, yOffset, barWidth, barHeight);
  }

}
