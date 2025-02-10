class Bullet {
    constructor(ctx) {
        this.ctx = ctx;
        this.image = new Image();
        this.image.src = "./sprites/bullet.png";
        this.image.onload = () => {
            this.draw(); // Ensures the image is drawn only after loading
        };
    }

    draw() {
        this.ctx.drawImage(this.image, 5, 5); // Draw the image at the bullet's position
    }
}
