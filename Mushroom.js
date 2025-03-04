class Mushroom extends Ingredient {
    constructor(config) {
        super(config, 20, 1, "mushroom");
        this.sprite = new Sprite({
            gameObject: this,
            src: "./sprites/mushroom.png",
            hasHealthBar: true,
        });
    }
}
