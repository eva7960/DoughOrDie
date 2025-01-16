const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./dragon.png")

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");

    gameEngine.addEntity(new Dragon(gameEngine));
	gameEngine.init(ctx);
	gameEngine.start();
});