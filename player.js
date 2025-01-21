class Player {
	constructor(game, x, y) {
        Object.assign(this, {game, x, y});
        this.game.mario = this;
        //spritesheet
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/player.png")

        //player states
        this.facing = 0; //0 = left, 1 = right. 2 = up, 3 = down
        this.state = 0; //0 = idle, 1 = walking
        this.dead = false;

        this.velocity = {x: 0, y: 0};

        //animations
        this.animations = [];
        this.loadAnimation();
	};

	loadAnimation() {
	    for(var i = 0; i < 2; i++) { //2 states
	        this.animations.push([]);
	        for(j = 0; 4; j++) { //4 directions
	            this.animations[i].push([]);
	        }
	    }
	    //idle + 4 sates
	    //sprite sheet x, sprite sheet y, widht, height, franes, frame duration, padding between frames, repeat, reverse animation, loop
	    this.animations[0][0] = new Animator(this.spritesheet, 0, 103, 33, 37, 1, 0.33, 14, false, true); //idle left
	    this.animations[0][1] = new Animator(this.spritesheet, 0, 40, 37, 1, 0.33, 14, false, true); //idle right
	    this.animations[0][2] = new Animator(this.spritesheet, 0, 70, 33, 37, 1, 0.33, 14, false, true); //idle up
	    this.animations[0][3] = new Animator(this.spritesheet, 0, 10, 33, 37, 1, 0.33, 14, false, true); //idle down

	    this.animations[1][0] = new Animator(this.spritesheet, 0, 105, 33, 37, 4, 0.33, 14, false, true); //walking left
        this.animations[1][1] = new Animator(this.spritesheet, 0, 40, 37, 4, 0.33, 14, false, true); //walking right
        this.animations[1][2] = new Animator(this.spritesheet, 0, 70, 33, 37, 4, 0.33, 14, false, true); //walking up
        this.animations[1][3] = new Animator(this.spritesheet, 0, 10, 33, 37, 4, 0.33, 14, false, true); //walking down
	};


	update() {

	};

	draw(ctx) {

	};
}