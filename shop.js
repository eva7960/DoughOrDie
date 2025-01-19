class Shop {
	constructor() {

	};

	update() {

	};

	draw(ctx) {
		ctx.drawImage(ASSET_MANAGER.getAsset("./EmptyShop1.png"), 0, 0, ctx.canvas.width, ctx.canvas.height);
	};
}