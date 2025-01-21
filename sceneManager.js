class SceneManager {
    constructor(game){
        this.game = game;
        this.game.camera = this;
        this.x = 0;
        
        this.battle = false;
        this.gameOver = false;

        //global functions
        window.loadLevel = this.loadLevel.bind(this);
        window.finish = this.finish.bind(this);
    }   

    clearEntities() {
        this.game.entities.forEach(function (entity) {
            entity.removeFromWorld = true;
        });
    };

    loadLevel() {
        //testing if function works 
        console.log("Load Level function called!" + this.battle);
        this.clearEntities();
        if(this.gameover == true) { //gameover screen
            gameEngine.addEntity(new Gameover());
        }
        if(this.battle == false) { //if in battle is true go back to the shop (player goes through door from battle stage)
            gameEngine.addEntity(new Battle());
            //gameEngine.addEntity(new Player()); add the player back 
            this.battle = true;
        } else {
            gameEngine.addEntity(new Shop());
            //gameEngine.addEntity(new Player()); add the player back 
            this.battle = false;
        }
    };

    finish() { //logic works, image not loading for some reason 
        this.gameOver = true;
        console.log("game over " + this.gameOver);
        this.clearEntities();
        gameEngine.addEntity(new Over());
    }

    update() {

    };
}