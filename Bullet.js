class Bullet {
    constructor(ctx) {
        this.ctx = ctx;
        this.image = new Image();
        this.image.src = "./sprites/cheese.png";
    }

    draw() {
        this.ctx.drawImage(this.image, 80, 80);
    }
}
