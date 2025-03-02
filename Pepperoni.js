class Pepperoni extends Ingredient {
    constructor(config) {
        super(config, 40, 0.5, "pepperoni");
        this.sprite = new Sprite({
            gameObject: this,
            src: "./sprites/pepperoni.png",
            hasHealthBar: true,
        });
    }
}
