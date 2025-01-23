class Customer {
	constructor() {
		//this.game = game;
		//this.speed = 50;
		//this.x = 0;
		//this.y = 0;
	};

	update() {
		//this.x += this.speed * this.game.clockTick;
	};

	draw(ctx) {
		ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/customer1.png"),0,0, 32, 32);
	};
}