class Bullet {
    constructor(config, x, y, context) {
        // Set up the position and image
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src = "./sprites/bullet.png";
        this.isLoaded = false;

        // Save the context so we can draw later
        this.context = context;

        // Image load callback
        this.image.onload = () => {
            this.isLoaded = true;
            this.draw(); // Draw the bullet after the image is loaded
        };
    }

    draw() {
        if (this.isLoaded) {
            this.context.drawImage(this.image, this.x, this.y); // Draw the image at the bullet's position
        } else {
            console.log("Image not loaded yet.");
        }
    }
}
