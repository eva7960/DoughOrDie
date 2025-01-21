class Shop {
	constructor(game) {
		this.game = game;
        this.animator = new Animator(ASSET_MANAGER.getAsset("./sprites/customer1.up.png"), 0, 0, 30, 18, 4, 0.2);
        this.x = 0;
        this.y = 0;
        this.speed = 400;
	};

	update() {
		this.x += this.speed * this.game.clockTick;
        if(this.x > 600) this.x = 0;
	};

	draw(ctx) {
		this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y);
	};
};