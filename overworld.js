class Overworld {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
    }

    //draw and load all assets
    init() {
    //empty shop background
        const background = new Image();
        background.onload = () => {
            this.ctx.drawImage(background, 0, 0);
        };
        background.src = "./backgrounds/EmptyShop.png";

    //player sprite
        const x = 1;
        const y = 4;
        const player = new Image();
        player.onload = () => {
            this.ctx.drawImage(
            player, 0, 0,       //x, y crop coordinates
            32, 32,            //frame width, frame height
            x * 16, y * 16,   //x, y coordinates on canvas, *16 to compensate for grid
            32, 32,          //desired width and height
            );
        }
        player.src = "./sprites/player.png";
    }
}