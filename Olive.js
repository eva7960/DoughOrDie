class Olive extends Ingredient {
  constructor(config) {
    super(config, 10, 1.3, "olive");
    this.sprite = new Sprite({
      gameObject: this,
      src: "./sprites/olive.png",
      hasHealthBar: true,
    });
  }
}
