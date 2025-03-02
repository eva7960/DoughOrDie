class Ham extends Ingredient {
  constructor(config) {
    super(config, 30, 0.75, "ham");
    this.sprite = new Sprite({
      gameObject: this,
      src: "./sprites/ham.png",
      hasHealthBar: true,
    });
  }
}
