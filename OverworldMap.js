class OverworldMap {
  constructor(config) {
    this.name = config.name;
    this.overworld = null;
    this.gameObjects = config.gameObjects;
    this.walls = config.walls || {};
    this.cutsceneSpaces = config.cutsceneSpaces || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.canShoot = true;
    this.shootCoolDown = 500;
    this.shootAudio = new Audio("shoot.mp3");

    this.isCutScenePlaying = false;
    this.toppings = ["cheese", "pepperoni", "ham", "mushroom", "pineapple", "olive", "pepper"];

    this.npcSpawnCount = 0;
    this.enemySpawnCount = 0;
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
    const { x, y } = utils.nextPosition(currentX, currentY, direction);

    if (this.walls[`${x},${y}`]) return true;

    for (let key in this.gameObjects) {
      const obj = this.gameObjects[key];
      if (obj.x === x && obj.y === y) {
        return true;
      }
    }
    return false;
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
    let nextCoords;

    if (hero.x === utils.withGrid(2) && hero.y === utils.withGrid(3) && hero.direction === "down") {
      let firstTile = utils.nextPosition(hero.x, hero.y, hero.direction);
      nextCoords = {
        x: firstTile.x,
        y: firstTile.y + 16
      };
    } else {
      nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    }

    const match = Object.values(this.gameObjects).find(object => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`;
    });

    if (!this.isCutScenePlaying && match && match.talking.length) {
      this.startCutScene(match.talking[0].events);
    }
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
  shoot() {
    if (!this.canShoot) return; 
  
    const hero = this.gameObjects["hero"];
    const bullet = new Bullet({
      x: hero.x,
      y: hero.y,
      src: "./sprites/bullet.png",
      direction: hero.direction,
      damage: 10 + (hero.damageBonus || 0)  
    });
  
    this.gameObjects["bullet"] = bullet;
    bullet.mount(this);
    this.shootAudio.play();
  
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

  spawnEnemy() {
    //generate ingredient
    const ingredients = ["pepperoni", "mushroom", "olive", "pineapple", "pepper", "ham", "cheese"];
    const ingredient = ingredients[Math.floor(Math.random() * ingredients.length)];
    let enemy;

    //generate random coordinates
    let x = utils.withGrid(Math.floor(Math.random() * (10 - 3 + 1)) + 3);
    let y = utils.withGrid(Math.floor(Math.random() * (10 - 3 + 1)) + 3);
    if (ingredient === "pepperoni") {
      enemy = new Pepperoni({
        x: x,
        y: y,
      });
    } else if (ingredient === "mushroom") {
      enemy = new Mushroom({
        x: x,
        y: y,
      });
    } else if (ingredient === "olive") {
      enemy = new Olive({
        x: x,
        y: y,
      });
    } else if (ingredient === "pineapple") {
      enemy = new Pineapple({
        x: x,
        y: y,
      });
    } else if (ingredient === "pepper") {
      enemy = new Pepper({
        x: x,
        y: y,
      });
      
    } else if (ingredient === "cheese") {
      enemy = new Cheese({
        x: x,
        y: y,
      });
    } else if (ingredient === "ham") {
      enemy = new Ham({
        x: x,
        y: y,
      });
    }
    enemy.id = this.enemySpawnCount.toString();
    this.gameObjects[enemy.id] = enemy;
    this.enemySpawnCount++;
    enemy.mount(this);
  }

  spawnNPCAtTile() {
    this.npcSpawnCount++;

    //difficulty increases with ever 2 orders (1 and 2 will have 1 topping, 3 and 4 will have 2 toppings, etc)
    let numToppings = Math.floor((this.npcSpawnCount - 1) / 2) + 1;
    if (numToppings > this.toppings.length) {
      numToppings = this.toppings.length;
    }

    //select the toppings randomly
    const selectedToppings = [];
    for (let i = 0; i < numToppings; i++) {
      const randomIndex = Math.floor(Math.random() * this.toppings.length);
      selectedToppings.push(this.toppings[randomIndex]);
    }
    const orderText = selectedToppings.join(", ");

    //pick NPC sprite
    const img = ["./sprites/npc1.png", "./sprites/npc2.png", "./sprites/npc3.png", "./sprites/npc4.png", "./sprites/npc5.png", "./sprites/npc6.png"];
    const npc = new Person({
      x: utils.withGrid(2),
      y: utils.withGrid(13),
      src: img[Math.floor(Math.random() * img.length)],
      behaviorLoop: [],
      talking: [{
        events: [
          {
            type: "textMessage",
            text: `Hello, can I have a ${orderText} pizza?`,
            faceHero: "",
            order: orderText,
            who: ""
          }
        ]
      }]
    });

    //make sure when changing maps the npcSpawnCount is not reset, or we will have duplicate NPC ids
    const npcId = `${orderText.replace(/,\s*/g, "").toLowerCase()}_${this.npcSpawnCount}`;
    npc.id = npcId;
    npc.talking[0].events[0].faceHero = npcId;
    npc.talking[0].events[0].who = npcId;

    this.gameObjects[npcId] = npc;
    npc.mount(this);

    const moves = [
      { type: "walk", direction: "up", retry: true },
      { type: "walk", direction: "up", retry: true },
      { type: "walk", direction: "up", retry: true },
      { type: "walk", direction: "up", retry: true },
      { type: "walk", direction: "up", retry: true },
      { type: "walk", direction: "up", retry: true },
      { type: "walk", direction: "up", retry: true },
      { type: "walk", direction: "up", retry: true }
    ];

    let currentMove = 0;
    const moveNext = () => {
      if (currentMove >= moves.length) {
        return;
      }
      npc.startBehavior({ map: this }, moves[currentMove]);
      const completeHandler = e => {
        if (e.detail.whoId === npcId) {
          document.removeEventListener("PersonWalkingComplete", completeHandler);
          currentMove++;
          moveNext();
        }
      };
      document.addEventListener("PersonWalkingComplete", completeHandler);
    };
    moveNext();
  }
}


window.OverworldMaps = {
  Shop: {
    name: "Shop",
    lowerSrc: "./backgrounds/shop2.png",
    upperSrc: "./backgrounds/hall.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(2),
        y: utils.withGrid(3),
        isHero: true,
      }),
    },
    walls: {
      //right side of door way
      [utils.asGridCoord(-1,2)] : true,
      //back of door way 
      [utils.asGridCoord(0,1)] : true,
      //side counter 
      [utils.asGridCoord(5,4)] : true,
      [utils.asGridCoord(5,3)] : true,
      //front counter
      [utils.asGridCoord(0,4)] : true,
      [utils.asGridCoord(1,4)] : true,
      [utils.asGridCoord(2,4)] : true, //so the player can talk to the npc that walks up to counter
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

      [utils.asGridCoord(0,2)] : [
        {
          events: [
            {type: "changeMap", map: "Outside"},
          ]
        }
      ],
    }
  },
  Outside: {
    name: "Outside",
    lowerSrc: "./backgrounds/grass.png",
    upperSrc: "./backgrounds/outHall.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(0),
        y: utils.withGrid(1 ),
        src: "./sprites/playerGun.png",
        isHero: true,
      }),
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

  gameOver: {
    upperSrc: "./backgrounds/over.png",
    lowerSrc: "./backgrounds/over.png",
    gameObjects: {}
  },
}

