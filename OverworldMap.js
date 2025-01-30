class OverworldMap {
  constructor(config) {
    this.gameObjects = config.gameObjects;
    this.walls = config.walls || {};
    this.cutsceneSpaces = config.cutsceneSpaces || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutScenePlaying = false; 
  }

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

  async startCutScene(events) {
    this.isCutScenePlaying = true;
    for (let i = 0; i < events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this,
      })
      await eventHandler.init();
    }
    this.isCutScenePlaying = false; 
  }

  checkForActionCutScene() {
    const hero = this.gameObjects["hero"];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find(object =>{
      return `${object.x},${object.y}` == `${nextCoords.x},${nextCoords.y}`
    });
    if(!this.isCutScenePlaying && match && match.talking.length) {
      this.startCutScene(match.talking[0].events);
    }
    console.log({match});
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects["hero"];
    const match = this.cutsceneSpaces[ `${hero.x},${hero.y}` ];
    if(!this.isCutScenePlaying && match) {
      this.startCutScene(match[0].events);
    }
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
            //in shop
          x: utils.withGrid(5),
          y: utils.withGrid(5),
            //behind counter
          // x: utils.withGrid(2),
          // y: utils.withGrid(3),
      }),
      npc1: new Person({
          x: utils.withGrid(2),
          y: utils.withGrid(10),
          src: "./sprites/customer1.png",
          behaviorLoop:[
              //{type:"walk", direction:"up"},
              //{type:"walk", direction:"up"},
              //{type:"walk", direction:"up"},
              //{type:"walk", direction:"up"},
              //{type:"walk", direction:"up"},
              //{type:"stand",direction:"up",time:1000},
              //{type:"walk", direction:"right"},
              //{type:"walk", direction:"right"},
              //{type:"walk", direction:"down"},
              //{type:"walk", direction:"down"},
              //{type:"walk", direction:"down"},
              //{type:"walk", direction:"down"},
              //{type:"walk", direction:"down"},
              //{type:"walk", direction:"down"},
              //{type:"walk", direction:"down"},
              //{type:"walk", direction:"down"},
          ],
          talking: [
            {
              events : [
                {type: "textMessage", text: "Hello, can I have a Cheese Pizza.", faceHero: "npc1"},
              ]
            },
          ]
      }),
      npc2: new Person({
        x: utils.withGrid(11),
        y: utils.withGrid(5),
        src: "./sprites/customer1.png",
        behaviorLoop:[

        ],
        talking: [
          {
            events : [
              {type: "textMessage", text: "Hello, can I have a Cheese Pizza.", faceHero: "npc1"},
            ]
          },
        ]
    }),
    },
    walls: {
      //side counter 
      [utils.asGridCoord(5,4)] : true,
      //[utils.asGridCoord(5,3)] : true,
      //front counter
      [utils.asGridCoord(0,4)] : true,
      [utils.asGridCoord(1,4)] : true,
      [utils.asGridCoord(2,4)] : false, //so the player can talk to the npc that walks up to counter 
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
      [utils.asGridCoord(-1,5)] : true, 
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
    },
    cutsceneSpaces: {
      [utils.asGridCoord(11,3)] : [
        {
          events: [
            {who: "npc2", type:"walk", direction: "up"},
            {type: "textMessage", text:"GET BACK TO WORK"},
          ]
        }
      ]
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