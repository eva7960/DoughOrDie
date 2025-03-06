class Pepper extends Ingredient {
    constructor(config) {
        super(config, 40, 0.5, "pepper");
        this.sprite = new Sprite({
            gameObject: this,
            src: "./sprites/pepper.png",
            hasHealthBar: true,
        });
    }
}
