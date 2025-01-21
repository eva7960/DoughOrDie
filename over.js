class Over {
    constructor() {

	};

	update() {

	};

	draw(ctx) {
        //grass background for now since game over png doesn't work 
		ctx.drawImage(ASSET_MANAGER.getAsset("./backgrounds/over.png"), 0, 0, 672, 672); 
	};
}