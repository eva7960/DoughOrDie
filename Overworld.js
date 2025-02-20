class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.map = null;

    this.gameState = "menu"; //can be "menu", "playing", or "battle"
  }


  startGameLoop() {
    const step = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      if (this.gameState === "menu") {
        this.drawStartMenu();
        requestAnimationFrame(step);
        return;
      }

      if (this.gameState === "gameover") {
        this.drawGameOverScreen();
        requestAnimationFrame(step);
        return;
      }

      // Normal game loop if playing
      Object.values(this.map.gameObjects).forEach(object => {
        object.update({
          arrow: this.directionInput.direction,
          map: this.map,
        });
      });

      this.map.drawLowerImage(this.ctx);
      Object.values(this.map.gameObjects).forEach(object => object.sprite.draw(this.ctx));
      this.map.drawUpperImage(this.ctx);

      // Update HUD (position & health)
      const hero = this.map.gameObjects.hero;
      this.hud.update(`Position: (${hero.x}, ${hero.y})  Health: ${hero.health}`);

      requestAnimationFrame(step);
    };
    step();
  }

 

  drawStartMenu() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = "white";
    this.ctx.font = "15px Arial";
    this.ctx.fillText("🍕 Dough or Die 🍕", this.canvas.width / 2 - 65, this.canvas.height / 2 - 50);
    this.ctx.fillText("Press Enter to Start", this.canvas.width / 2 - 65, this.canvas.height / 2);
    this.ctx.fillText("Press O for Options", this.canvas.width / 2 - 65, this.canvas.height / 2 + 30);
  }

  drawGameOverScreen() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = "red";
    this.ctx.font = "15px Arial";
    this.ctx.fillText("Game Over", this.canvas.width / 2 - 65, this.canvas.height / 2);
    
    this.ctx.fillStyle = "white";
    this.ctx.fillText("Press R to Restart", this.canvas.width / 2 - 65, this.canvas.height / 2 + 30);
  }



  bindActionInput() {
    new KeyPressListener("Enter", () => {
      this.map.checkForActionCutScene();
    });
    new KeyPressListener("Space", () => {
      this.map.shoot();
    });

  }

  bindHeroPositionCheck() {
    document.addEventListener("PersonWalkingComplete", e => {
      if (e.detail.whoId == "hero") {
        this.map.checkForFootstepCutscene();
      }
    });
  }

  startMap(mapConfig) {
    this.map = new OverworldMap(mapConfig);
    this.map.overworld = this;
    this.map.mountObjects();
  }

  init() {
    this.startMap(window.OverworldMaps.Shop);
    this.bindActionInput();
    this.bindHeroPositionCheck();

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.hud = new HUD({ container: this.element });

    this.startGameLoop();

    window.addEventListener("keydown", (event) => {
      if (this.gameState === "menu" && event.key === "Enter") {
        this.startGame();
      }

      if (this.gameState === "gameover" && event.key === "r") {
        this.restartGame();
      }
    });


    this.map.startCutScene([
      // { type: "textMessage", text: "Get ready for your first day on the job!" },
      // { who: "npc1", type: "walk", direction: "up" },
      // { who: "npc1", type: "walk", direction: "up" },
      // { who: "npc1", type: "walk", direction: "up" },
      // { who: "npc1", type: "walk", direction: "up" },
      // { who: "npc1", type: "walk", direction: "up" },
    ]);
  }

  startGame() {
    this.gameState = "playing";
    this.startGameLoop();

    // TEMPORARY: Trigger game over after 5 seconds
    //setTimeout(() => {
     // this.gameOver();
  //}, 5000); // 5 seconds
  }

  gameOver() {
    this.gameState = "gameover";
    this.drawGameOverScreen();

  }

  restartGame() {
    this.gameState = "menu"; // Go back to menu
    this.startGameLoop(); // Restart loop
    this.map.gameObjects.hero.x = utils.withGrid(5);
    this.map.gameObjects.hero.y = utils.withGrid(5);
  }

}
