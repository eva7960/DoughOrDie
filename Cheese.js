class Cheese extends Ingredient {
  constructor(config) {
    super(config, 30, 0.75, "cheese");
    this.sprite = new Sprite({
      gameObject: this,
      src: "./sprites/cheese.png",
      hasHealthBar: true,
    });
  }
}
