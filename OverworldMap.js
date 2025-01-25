class OverworldMap {
  constructor(config) {
    this.gameObjects = config.gameObjects;

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;
  }

  drawLowerImage(ctx) {
    ctx.drawImage(this.lowerImage, 0, 0)
  }

  drawUpperImage(ctx) {
    ctx.drawImage(this.upperImage, 0, 0)
  }
}

window.OverworldMaps = {
  Shop: {
    lowerSrc: "./backgrounds/shop.png",
    upperSrc: "./backgrounds/hall.png",
    gameObjects: {
      hero: new Person({
          isPlayerControlled: true,
          x: utils.withGrid(5),
          y: utils.withGrid(6),
      }),
      npc1: new Person({
          x: utils.withGrid(7),
          y: utils.withGrid(9),
          src: "./sprites/customer1.png"
      })
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