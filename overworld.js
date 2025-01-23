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

    //shadow sprite
    const x = 5;
    const y = 6;
    const shadow = new Image();
    shadow.onload = () => {
        this.ctx.drawImage(
            shadow, 0, 0,
            32, 32,
            x * 16 - 8,
            y * 16 - 18,
            32, 32)
    };
    shadow.src = "./sprites/shadow.png");
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