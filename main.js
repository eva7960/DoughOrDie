const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./backgrounds/EmptyShop.png")

// load in battle background 
ASSET_MANAGER.queueDownload("./backgrounds/grass.png") 
// load in game over screen
ASSET_MANAGER.queueDownload("./backgrounds/over.png") 
// load in cheese sprite 
ASSET_MANAGER.queueDownload("./sprites/cheese.png");
// load in player sprite
ASSET_MANAGER.queueDownload("./sprites/player.png");

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");

	gameEngine.init(ctx);

	new SceneManager(gameEngine);

	// start game on shop level 
    gameEngine.addEntity(new Shop());

	gameEngine.start();
});