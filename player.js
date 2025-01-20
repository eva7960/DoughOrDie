class Player {
	constructor(game, x, y) {
        Object.assign(this, {game, x, y});
        this.game.mario = this;
        //spritesheet
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/player.png")

        //player states
        this.facing = 0; //0 = left, 1 = right
        this.state = 0; //0 = idle, 1 = walking
        this.dead = false;

        this.velocity = {x: 0, y: 0};

        this.updateBB();

        //animations
        this.animations = [];
        this.loadAnimation();
	};

	loadAnimation() {
	    for(var i = 0; i < )
	}


	update() {

	};

	draw(ctx) {
		ctx.drawImage(ASSET_MANAGER.getAsset("./EmptyShop.png"), 0, 0, ctx.canvas.width, ctx.canvas.height);
	};
}