class Customer {
	constructor(game) {
		this.game = game;
		this.animator = new this.animator(ASSET_MANAGER.getAsset("./sprites/customer1.png"),0,0,32,32,4,0.2);
		this.speed = 50;
		this.x = 0;
		this.y = 0;
		this.animations = [];
		this.loadAnimations();
	};

    loadAnimations() {

    }
	update() {
		this.x += this.speed * this.game.clockTick;
	};

	draw(ctx) {
		this.animator.drawFrame(this.game.clockTick,ctx,this.x,this.y);
	};
}