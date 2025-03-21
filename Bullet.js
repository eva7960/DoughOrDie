class Bullet extends GameObject {
    constructor(config) {
      super(config);
      this.direction = config.direction;
      this.damage = config.damage || 10; 
      this.sprite = new Sprite({
        gameObject: this,
        src: config.src,
        animations: {
          "up": [[0, 0]],
          "down": [[1, 0]],
          "left": [[2, 0]],
          "right": [[3, 0]],
        }
      });
      this.sprite.setAnimation(this.direction);
    }
  
    update(state) {
      const nextPosition = utils.nextPosition(this.x, this.y, this.direction);
      Object.keys(window.OverworldMaps.Outside.gameObjects).forEach(key => {
        let object = window.OverworldMaps.Outside.gameObjects[key];
        if (object instanceof Ingredient && utils.collide(this, object)) {
          object.hit(this.damage);
        }
      });
      this.x = nextPosition.x;
      this.y = nextPosition.y;
    }
  }
  