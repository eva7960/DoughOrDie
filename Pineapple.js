class Pineapple extends Ingredient {
    constructor(config) {
        super(config, 40, 0.8, "pineapple");
        this.sprite = new Sprite({
            gameObject: this,
            src: "./sprites/pineapple.png",
            hasHealthBar: true,
        });
    }
}
