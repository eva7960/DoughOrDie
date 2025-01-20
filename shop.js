class Shop {
	constructor() {
	    const customers = new Array("./sprites/customer1.png");
	};

	update() {

	};

	draw(ctx) {
		ctx.drawImage(ASSET_MANAGER.getAsset("./backgrounds/EmptyShop.png"), 0, 0, 672, 672);
	};
}