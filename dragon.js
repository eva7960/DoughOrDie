class Dragon {
	constructor(game) {
	    this.game = game;
        this.animator = new Animator(ASSET_MANAGER.getAsset("./dragon.png"), 0, 0, 188, 210, 6, 0.1);
        this.x = 384;
        this.y = 200;
        this.speed = 700;
	};

	update() {
        this.x += this.speed * this.game.clockTick;
        if(this.x > 2000) this.x = 0;
	};

	draw(ctx) {
		this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y);
	};
}