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
  }

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.lowerImage, 
      utils.withGrid(10.5) - cameraPerson.x, 
      utils.withGrid(6) - cameraPerson.y
      )
  }

  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.upperImage, 
      utils.withGrid(10.5) - cameraPerson.x, 
      utils.withGrid(6) - cameraPerson.y
    )
  } 

  isSpaceTaken(currentX, currentY, direction) {
    const {x,y} = utils.nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach(key => {

      let object = this.gameObjects[key];
      object.id = key;

      //TODO: determine if this object should actually mount
      object.mount(this);

    })
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true;

    for (let i=0; i<events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this,
      })
      await eventHandler.init();
    }

    this.isCutscenePlaying = false;

    //Reset NPCs to do their idle behavior
    Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))
  }

  checkForActionCutscene() {
    const hero = this.gameObjects["hero"];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find(object => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
    });
    if (!this.isCutscenePlaying && match && match.talking.length) {
      this.startCutscene(match.talking[0].events)
    }
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects["hero"];
    const match = this.cutsceneSpaces[ `${hero.x},${hero.y}` ];
    if (!this.isCutscenePlaying && match) {
      this.startCutscene( match[0].events )
    }
  }

  addWall(x,y) {
    this.walls[`${x},${y}`] = true;
  }
  removeWall(x,y) {
    delete this.walls[`${x},${y}`]
  }
  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const {x,y} = utils.nextPosition(wasX, wasY, direction);
    this.addWall(x,y);
  }

}

window.OverworldMaps = {
  DemoRoom: {
    lowerSrc: "/backgrounds/shop.png",
    upperSrc: "/backgrounds/hall.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(6),
      }),
      npcA: new Person({
        x: utils.withGrid(7),
        y: utils.withGrid(9),
        src: "/sprites/customer1.png",
        behaviorLoop: [
          { type: "stand",  direction: "left", time: 800 },
          { type: "stand",  direction: "up", time: 800 },
          { type: "stand",  direction: "right", time: 1200 },
          { type: "stand",  direction: "up", time: 300 },
        ],
        talking: [
          {
            events: [
              { type: "textMessage", text: "I'm busy...", faceHero: "npcA" },
              { type: "textMessage", text: "Go away!"},
              { who: "hero", type: "walk",  direction: "up" },
            ]
          }
        ]
      }),
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

  },
    cutsceneSpaces: {
      [utils.asGridCoord(0,2)]: [
        {
          events: [
            { type: "changeMap", map: "Kitchen" }
          ]
        }
      ]
    }
    
  },
  Kitchen: {
    lowerSrc: "/backgrounds/grass.png",
    upperSrc: "/backgrounds/hall.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(5),
      })
    }
  },
}