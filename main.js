const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./backgrounds/EmptyShop.png");
ASSET_MANAGER.queueDownload("./sprites/customer1.png");

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    //gameEngine.addEntity(new Shop());
    gameEngine.addEntity(new customer(gameEngine));
	gameEngine.init(ctx);
	gameEngine.start();
});