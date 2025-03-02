class Olive extends Ingredient {
  constructor(config) {
    super(config);
    this.sprite = new Sprite({
      gameObject: this,
      src: "./sprites/olive.png",
      hasHealthBar: true,
    });
    this.maxHealth = 30;
    this.health = 30;
    this.speed = 0.5;
  }
  hit() {
    super.hit("olive");
  }
}
