class Pepper extends Ingredient {
    constructor(config) {
        super(config, 30, 0.75, "pepper");
        this.sprite = new Sprite({
            gameObject: this,
            src: "./sprites/pepper.png",
            hasHealthBar: true,
        });
    }
}
