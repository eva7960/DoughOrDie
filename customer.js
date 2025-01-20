class Customer {
	constructor(game) {
		this.game = game;
		this.animator = new this.animator(ASSET_MANAGER.getAsset("./sprites/customer1.png"));
		this.speed = 50;
		this.x = 0;
		this.y = 0;
	};

	update() {
		this.x += this.speed * this.game.clockTick;
	};

	draw(ctx) {
		this.animator.drawFrame(this.game.clockTick,ctx,this.x,this.y);
	};
}