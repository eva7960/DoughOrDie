class Ham extends Ingredient {
  constructor(config) {
    super(config, 50, 0.6, "ham");
    this.sprite = new Sprite({
      gameObject: this,
      src: "./sprites/ham.png",
      hasHealthBar: true,
    });
  }
}
