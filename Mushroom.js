class Mushroom extends Ingredient {
    constructor(config) {
        super(config, 40, 0.5, "mushroom");
        this.sprite = new Sprite({
            gameObject: this,
            src: "./sprites/mushroom.png",
            hasHealthBar: true,
        });
    }
}
