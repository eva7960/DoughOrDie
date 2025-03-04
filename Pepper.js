class Pepper extends Ingredient {
    constructor(config) {
        super(config, 20, 1, "pepper");
        this.sprite = new Sprite({
            gameObject: this,
            src: "./sprites/pepper.png",
            hasHealthBar: true,
        });
    }
}
