class Player {
	constructor(game, x, y) {
        Object.assign(this, {game, x, y});
        this.game.mario = this;
        //spritesheet
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/player.png")

        //player states
        this.facing = 0; //0 = left, 1 = right. 2 = up, 3 = down
        this.state = 0; //0 = idle, 1 = walking
        this.dead = false;

        this.velocity = {x: 0, y: 0};

        //animations
        this.animations = [];
        this.loadAnimation();
	};

	loadAnimation() {
	    for(var i = 0; i < 2; i++) { //2 states
	        this.animations.push([]);
	        for(j = 0; 4; j++) { //4 directions
	            this.animations[i].push([]);
	        }
	    }
	    //idle + 4 sates
	    this.animations[0][0] = new Animator(this.spritesheet, 210, 0, 16, 16, 1, 0.33, 14, false, true);
	};


	update() {

	};

	draw(ctx) {
		ctx.drawImage(ASSET_MANAGER.getAsset("./EmptyShop.png"), 0, 0, ctx.canvas.width, ctx.canvas.height);
	};
}