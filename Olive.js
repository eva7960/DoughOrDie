class Olive extends Ingredient {
  constructor(config) {
    super(config, 20, 1, "olive");
    this.sprite = new Sprite({
      gameObject: this,
      src: "./sprites/olive.png",
      hasHealthBar: true,
    });
  }
}
