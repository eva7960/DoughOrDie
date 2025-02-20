class OverworldMap {
  constructor(config) {
    this.overworld = null;
    this.gameObjects = config.gameObjects;
    this.walls = config.walls || {};
    this.cutsceneSpaces = config.cutsceneSpaces || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutScenePlaying = false;

    this.canShoot = true;
    this.shootCoolDown = 500;
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
  shoot() {
    if (!this.canShoot) return; // Prevent shooting if still on cooldown

    const bullet = new Bullet({
      x: this.gameObjects["hero"].x,
      y: this.gameObjects["hero"].y,
      src: "./sprites/bullet.png",
      direction: this.gameObjects["hero"].direction,
    });

    this.gameObjects["bullet"] = bullet;
    bullet.mount(this);

    // Set cooldown
    this.canShoot = false;
    setTimeout(() => {
      this.canShoot = true;
    }, this.shootCoolDown);
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach(key => {
      let object = this.gameObjects[key];
      object.id = key;
      object.mount(this);
    });
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
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
    });
    if(!this.isCutScenePlaying && match && match.talking.length) {
      this.startCutScene(match.talking[0].events);
    }
    //console.log({match});
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
          // x: utils.withGrid(5),
          // y: utils.withGrid(5),
            //behind counter
          x: utils.withGrid(2),
          y: utils.withGrid(3),
            //door way
          // x: utils.withGrid(0),
          // y: utils.withGrid(2),
      }),
      cheesePizzaNPC: new Person({
          x: utils.withGrid(5),
          y: utils.withGrid(5),
          src: "./sprites/customer1.png",
          behaviorLoop:[
              //default behavior for npc
          ],
          talking: [
            {
              events : [ 
                {type: "textMessage", 
                 text: "Hello, can I have a Cheese Pizza.", 
                 faceHero: "cheesePizzaNPC",
                 who: "cheesePizzaNPC",
                 order: "Cheese",
                },
              ]
            },
          ]
      }),

      pepperoniPizzaNPC: new Person({
        x: utils.withGrid(6),
        y: utils.withGrid(6),
        src: "./sprites/customer1.png",
        behaviorLoop:[
            //default behavior for npc 
        ],
        talking: [
          {
            events : [
              {type: "textMessage", 
               text: "Hello, can I have a Pepperoni Pizza.", 
               faceHero: "pepperoniPizzaNPC",
               who: "pepperoniPizzaNPC",
               order: "Pepperoni",
              },
            ]
          },
        ]
    }),

      boss: new Person({
        x: utils.withGrid(11),
        y: utils.withGrid(5),
        src: "./sprites/customer1.png",
        behaviorLoop:[
            //default behavior for npc 
        ],
        talking: [
          {
            events : [
              {type: "textMessage", text: "Are we working hard or hardly working? (event array)", faceHero: "boss"},
            ]
          },
        ]
    }),
    },
    walls: {
      //right side of door way
      [utils.asGridCoord(-1,2)] : true,
      //back of door way 
      [utils.asGridCoord(0,1)] : true,
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
            {who: "boss", type:"walk", direction: "up"},
            {type: "textMessage", text:"Are we working hard or hardly working? (cutscene)"},
          ]
        }
      ],
      [utils.asGridCoord(0,2)] : [
        {
          events: [
            {type: "changeMap", map: "Outside"},
            //{type: "textMessage", text:"Get ready to hunt for your ingredients!"},
          ]
        }
      ],
    }
  },
  Outside: {
    lowerSrc: "./backgrounds/grass.png",
    upperSrc: "./backgrounds/outHall.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(0),
        y: utils.withGrid(3),
        src: "./sprites/playerGun.png",
      }),
      cheese: new Cheese({
        x: utils.withGrid(2),
        y: utils.withGrid(9),
        src: "./sprites/cheese.png",
        behaviorLoop: generateRandomBehaviorLoop(100)
      }),
      cheese1: new Cheese({
        x: utils.withGrid(10),
        y: utils.withGrid(6),
        src: "./sprites/cheese.png",
        behaviorLoop: generateRandomBehaviorLoop(20),
      }),
      cheese2: new Cheese({
        x: utils.withGrid(6),
        y: utils.withGrid(10),
        src: "./sprites/cheese.png",
        behaviorLoop: generateRandomBehaviorLoop(20),
      }),
      cheese3: new Cheese({
        x: utils.withGrid(9),
        y: utils.withGrid(5),
        src: "./sprites/cheese.png",
        behaviorLoop: generateRandomBehaviorLoop(20),
      }),
      cheese4: new Cheese({
        x: utils.withGrid(1),
        y: utils.withGrid(10),
        src: "./sprites/cheese.png",
        behaviorLoop: generateRandomBehaviorLoop(20),
      }),
      // cheese5: new Cheese({
      //   x: utils.withGrid(6),
      //   y: utils.withGrid(7),
      //   src: "./sprites/cheese.png",
      //   behaviorLoop: generateRandomBehaviorLoop(20),
      // }),
    },
    walls: {
      //north wall
      [utils.asGridCoord(1, -1)]: true,
      [utils.asGridCoord(2, -1)]: true,
      [utils.asGridCoord(3, -1)]: true,
      [utils.asGridCoord(4, -1)]: true,
      [utils.asGridCoord(5, -1)]: true,
      [utils.asGridCoord(6, -1)]: true,
      [utils.asGridCoord(7, -1)]: true,
      [utils.asGridCoord(8, -1)]: true,
      [utils.asGridCoord(9, -1)]: true,
      [utils.asGridCoord(10, -1)]: true,
      [utils.asGridCoord(11, -1)]: true,
      [utils.asGridCoord(12, -1)]: true,

      //east wall
      [utils.asGridCoord(12, 0)]: true,
      [utils.asGridCoord(12, 1)]: true,
      [utils.asGridCoord(12, 2)]: true,
      [utils.asGridCoord(12, 3)]: true,
      [utils.asGridCoord(12, 4)]: true,
      [utils.asGridCoord(12, 5)]: true,
      [utils.asGridCoord(12, 6)]: true,
      [utils.asGridCoord(12, 7)]: true,
      [utils.asGridCoord(12, 8)]: true,
      [utils.asGridCoord(12, 9)]: true,
      [utils.asGridCoord(12, 10)]: true,
      [utils.asGridCoord(12, 11)]: true,
      [utils.asGridCoord(12, 12)]: true,

      //south wall
      [utils.asGridCoord(0, 11)]: true,
      [utils.asGridCoord(1, 11)]: true,
      [utils.asGridCoord(2, 11)]: true,
      [utils.asGridCoord(3, 11)]: true,
      [utils.asGridCoord(4, 11)]: true,
      [utils.asGridCoord(5, 11)]: true,
      [utils.asGridCoord(6, 11)]: true,
      [utils.asGridCoord(7, 11)]: true,
      [utils.asGridCoord(8, 11)]: true,
      [utils.asGridCoord(9, 11)]: true,
      [utils.asGridCoord(10, 11)]: true,
      [utils.asGridCoord(11, 11)]: true,
      [utils.asGridCoord(12, 11)]: true,

      //west wall
      [utils.asGridCoord(-1, 0)]: true,
      [utils.asGridCoord(-1, 1)]: true,
      [utils.asGridCoord(-1, 2)]: true,
      [utils.asGridCoord(-1, 3)]: true,
      [utils.asGridCoord(-1, 4)]: true,
      [utils.asGridCoord(-1, 5)]: true,
      [utils.asGridCoord(-1, 6)]: true,
      [utils.asGridCoord(-1, 7)]: true,
      [utils.asGridCoord(-1, 8)]: true,
      [utils.asGridCoord(-1, 9)]: true,
      [utils.asGridCoord(-1, 10)]: true,
      [utils.asGridCoord(-1, 11)]: true,
      [utils.asGridCoord(-1, 12)]: true,


    },
    cutsceneSpaces: {
      [utils.asGridCoord(0,0)] : [
        {
          events: [
            {type: "changeMap", map: "Shop"},
          ]
        }
      ],
    }
  },
}
function generateRandomBehaviorLoop(steps) {
  const directions = ["up", "down", "left", "right"];
  let loop = [];

  for (let i = 0; i < steps; i++) {
    let randomDirection = directions[Math.floor(Math.random() * directions.length)];
    loop.push({ type: "walk", direction: randomDirection });
    loop.push({ type: "walk", direction: randomDirection });
    loop.push({ type: "walk", direction: randomDirection });
  }

  return loop;
}


