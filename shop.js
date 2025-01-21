class Shop {
	constructor() {

	};

	update() {

	};

	draw(ctx) {
		ctx.drawImage(ASSET_MANAGER.getAsset("./backgrounds/EmptyShop.png"), 0, 0, 672, 672);
		ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/customer1.png"), 0, 0);
	};
}