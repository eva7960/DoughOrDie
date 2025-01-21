const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./backgrounds/EmptyShop.png")
ASSET_MANAGER.queueDownload("./sprites/customer1.up.png")


ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
    ctx.drawImage(ASSET_MANAGER.getAsset("./backgrounds/EmptyShop.png"), 0, 0, 672, 672);
    gameEngine.addEntity(new Shop());
	gameEngine.init(ctx);
	gameEngine.start();
});