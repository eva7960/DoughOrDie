class Customer {
	constructor() {

	};

	update() {

	};

	draw(ctx) {
		ctx.drawImage(ASSET_MANAGER.getAsset(shop.customers[0]), 0, 0, 672, 672);
	};
}