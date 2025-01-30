class OverworldMap {
  constructor(config) {
    this.overworld = null;
    this.gameObjects = config.gameObjects;
    this.cutsceneSpaces = config.cutsceneSpaces || {};
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutscenePlaying = false;

  drawLowerImage(ctx) { //REMEMBER TO ADD CAMERA!
    ctx.drawImage(this.lowerImage, 0,0)
    // replace 0, 0 utils.withGrid(5) - camera.x, utils.withGrid(5) - camera.y
  }

  drawUpperImage(ctx) { //REMEMBER TO ADD CAMERA
    ctx.drawImage(this.upperImage, 0,0)
  }
  // replace 0, 0 utils.withGrid(5) - camera.x, utils.withGrid(5) - camera.y

  isSpaceTaken(currentX, currentY, direction) {
    const {x,y} = utils.nextPosition(currentX,currentY,direction);
    return this.walls[`${x},${y}`] || false;
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach(key => {
      let object = this.gameObjects[key];
      object.id = key;
      object.mount(this);
    })
  }

  addWall(x,y) {
    this.walls[`${x},${y}`] = true;
  }
  deleteWall(x,y) {
    this.walls[`${x},${y}`] = false;
  }
  moveWall(oldX, oldY, direction) {
    this.deleteWall(oldX, oldY);
    const {x,y} = utils.nextPosition(oldX, oldY, direction);
    this.addWall(x,y)
  }
}

window.OverworldMaps = {
  Shop: {
    lowerSrc: "./backgrounds/shop.png",
    upperSrc: "./backgrounds/hall.png",
    gameObjects: {
      hero: new Person({
          isPlayerControlled: true,
          x: utils.withGrid(0),
          y: utils.withGrid(3),
      }),
      npc1: new Person({
          x: utils.withGrid(2),
          y: utils.withGrid(10),
          src: "./sprites/customer1.png",
          behaviorLoop:[
              {type:"walk", direction:"up"},
              {type:"walk", direction:"up"},
              {type:"walk", direction:"up"},
              {type:"walk", direction:"up"},
              {type:"walk", direction:"up"},
              {type:"textMessage", text:"hello"},
              {type:"walk", direction:"right"},
              {type:"walk", direction:"right"},
              {type:"walk", direction:"down"},
              {type:"walk", direction:"down"},
              {type:"walk", direction:"down"},
              {type:"walk", direction:"down"},
              {type:"walk", direction:"down"},
              {type:"walk", direction:"down"},
              {type:"walk", direction:"down"},
              {type:"walk", direction:"down"},
              {type:"stand",direction: "up"},
          ]
      })
    },
    walls: {
      //side counter 
      [utils.asGridCoord(5,4)] : true,
      [utils.asGridCoord(5,3)] : true,

      //front counter
      [utils.asGridCoord(0,4)] : true,
      [utils.asGridCoord(1,4)] : true,
      [utils.asGridCoord(2,4)] : true,
      [utils.asGridCoord(3,4)] : true,
      [utils.asGridCoord(4,4)] : true,

      //back wall
      [utils.asGridCoord(6,2)] : true,
      [utils.asGridCoord(7,2)] : true,
      [utils.asGridCoord(8,2)] : true,
      [utils.asGridCoord(9,2)] : true,
      [utils.asGridCoord(10,2)] : true,
      [utils.asGridCoord(11,2)] : true,
      [utils.asGridCoord(12,2)] : true,

      //right edge
      [utils.asGridCoord(12,3)] : true,
      [utils.asGridCoord(12,4)] : true,
      [utils.asGridCoord(12,5)] : true,
      [utils.asGridCoord(12,6)] : true,
      [utils.asGridCoord(12,7)] : true,
      [utils.asGridCoord(12,8)] : true,
      [utils.asGridCoord(12,9)] : true,
      [utils.asGridCoord(12,10)] : true,

      //bottom left walls
      [utils.asGridCoord(0,11)] : true,
      [utils.asGridCoord(1,11)] : true,

      //bottom middle wall
      [utils.asGridCoord(3,11)] : true,

      //bottom right wall 
      [utils.asGridCoord(5,11)] : true,
      [utils.asGridCoord(6,11)] : true,
      [utils.asGridCoord(7,11)] : true,
      [utils.asGridCoord(8,11)] : true,
      [utils.asGridCoord(9,11)] : true,
      [utils.asGridCoord(10,11)] : true,
      [utils.asGridCoord(11,11)] : true,
      //left wall
      [utils.asGridCoord(-1,3)] : true,
      [utils.asGridCoord(-1,5)] : true, //hole in the wall so player can go behind counter for now
      [utils.asGridCoord(-1,6)] : true,
      [utils.asGridCoord(-1,7)] : true,
      [utils.asGridCoord(-1,8)] : true,
      [utils.asGridCoord(-1,9)] : true,
      [utils.asGridCoord(-1,10)] : true,

      //wall behind counter 
      [utils.asGridCoord(5,2)] : true,
      [utils.asGridCoord(4,2)] : true,
      [utils.asGridCoord(3,2)] : true,
      [utils.asGridCoord(2,2)] : true,
      [utils.asGridCoord(1,2)] : true,
    }
  },
  Outside: {
    lowerSrc: "./backgrounds/grass.png",
    upperSrc: "./backgrounds/grass.png",
    gameObjects: {
      hero: new GameObject({
        x: 3,
        y: 5,
      }),
      cheese: new GameObject({
          x: 7,
          y: 9,
          src: "./sprites/cheese.png"
      })
    }
  },
}