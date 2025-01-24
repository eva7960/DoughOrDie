class Counter { //stops the player from going to the customer area and customers from going to the player area
    constructor(game, x, y) {
        Object.assign(this, {game, x, y});
        this.hBB = new BoundingBox(0,65,81,15); //counter with cash register 
        this.vBB = new BoundingBox(81,44,15,36); //vertical counter 
    }
}