class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.map = null;
    this.timer = new Timer();
  }


  startGameLoop() {
    const step = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      Object.values(this.map.gameObjects).forEach(object => {
        object.update({
          arrow: this.directionInput.direction,
          map: this.map,
        });
      });

      this.map.drawLowerImage(this.ctx);

      Object.values(this.map.gameObjects).forEach(object => {
        object.sprite.draw(this.ctx);
      });

      this.map.drawUpperImage(this.ctx);

      //update the HUD, currently just shows position of hero
      const hero = this.map.gameObjects.hero;
      this.hud.update({
        health: hero.health,
        timer: this.timer.formatTime(),
      });

      requestAnimationFrame(step);
    };
    step();
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
      if (e.detail.whoId == "hero") {
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

    this.map.startCutScene([
      // { type: "textMessage", text: "Get ready for your first day on the job!" },
      // { who: "npc1", type: "walk", direction: "up" },
      // { who: "npc1", type: "walk", direction: "up" },
      // { who: "npc1", type: "walk", direction: "up" },
      // { who: "npc1", type: "walk", direction: "up" },
      // { who: "npc1", type: "walk", direction: "up" },
    ]);
  }
}
