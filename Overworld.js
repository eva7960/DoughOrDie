class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.map = null;
    this.gameState = "menu";

    this.timer = new Timer(); // ✅ Add timer instance
  }




  startGameLoop() {
    if (this.gameLoopRunning) return;
    this.gameLoopRunning = true;

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

      // Normal game logic when playing
      Object.values(this.map.gameObjects).forEach(object => {
        object.update({
          arrow: this.directionInput.direction,
          map: this.map,
        });
      });

      this.map.drawLowerImage(this.ctx);
      Object.values(this.map.gameObjects).forEach(object => object.sprite.draw(this.ctx));
      this.map.drawUpperImage(this.ctx);

      const hero = this.map.gameObjects.hero;
      if (hero && this.timer) {
        this.hud.update({ health: hero.health, timer: this.timer.formatTime() });
      } else {
        console.error("HUD Error: Hero or Timer not found");
      }
    
      requestAnimationFrame(step);
    };
    step();
  }



  drawStartMenu() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = "white";
    this.ctx.font = "15px Arial";
    this.ctx.fillText("🍕 Pizza Quest 🍕", this.canvas.width / 2 - 65, this.canvas.height / 2 - 50);
    this.ctx.fillText("Press Enter to Start", this.canvas.width / 2 - 65, this.canvas.height / 2);
    this.ctx.fillText("Press O for Options", this.canvas.width / 2 - 65, this.canvas.height / 2 + 50);
  }

  drawGameOverScreen() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = "red";
    this.ctx.font = "40px Arial";
    this.ctx.fillText("Game Over", this.canvas.width / 2 - 80, this.canvas.height / 2);
    
    this.ctx.fillStyle = "white";
    this.ctx.fillText("Press R to Restart", this.canvas.width / 2 - 100, this.canvas.height / 2 + 50);
  }



  bindActionInput() {
    new KeyPressListener("Enter", () => {
      this.map.checkForActionCutScene();
    });
    new KeyPressListener("Space", () => {
      this.map.shoot();
    });

    new KeyPressListener("KeyR", () => {
      
    });
  }

  bindHeroPositionCheck() {
    document.addEventListener("PersonWalkingComplete", e => {
      if (e.detail.whoId === "hero") {
        this.map.checkForFootstepCutscene();
      }
    });
  }
  bindInventoryInput() {
    new KeyPressListener("KeyI", () => {
      const hero = this.map.gameObjects["hero"];
      if (hero && hero.inventory) {
        console.log("Player Inventory:", hero.inventory);
      } else {
        console.log("No inventory found for the hero.");
      }
    });
  }

  //to test add item method 
  bindTestPepperoniInput() {
    new KeyPressListener("KeyP", () => {
      const hero = this.map.gameObjects["hero"];
      hero.addItem("pepperoni", 1);
      console.log("Pepperoni added. Current inventory:", hero.inventory);
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
    this.bindInventoryInput();
    this.bindHeroPositionCheck();
    this.bindTestPepperoniInput();

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.hud = new HUD({ container: this.element });

    this.startGameLoop();
 
    // Keypress listener for start and restart
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

    // ✅ Reset Player Health
    this.map.gameObjects.hero.health = 100;

    // ✅ Reset and Start Timer
    this.timer.reset();
    this.timer.start();

    // ✅ Update HUD immediately
    this.hud.update({ health: this.map.gameObjects.hero.health, timer: this.timer.formatTime() });
  }




    
  gameOver() {
    this.gameState = "gameover";
  }

  restartGame() {
    this.gameState = "menu"; // Go back to menu
    this.startGameLoop(); // Restart loop

    // Reset hero's position, health, and map state
    this.map.gameObjects.hero.x = utils.withGrid(5);
    this.map.gameObjects.hero.y = utils.withGrid(5);
    this.map.gameObjects.hero.health = 100;
    this.map.timer = 0;
  }

  }
