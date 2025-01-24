class customerbb { //bounds the customer inside of the shop 
    constructor(game,x,y) {
        Object.assign(this, {game, x, y});
        this.backWallBB(97,48,96,1); //back wall to the right of counter 
        this.leftWallBB(1,177,2,64); //wall left of door
        this.rightWallBB(81,177,2,112);; //wall right of door 
    }
}