class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.map = null;
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

      const hero = this.map.gameObjects.hero;
      this.hud.update({
        score: hero.score,
        health: hero.health,
        timer: window.timer ? window.timer.remainingTime : "0"
      });

      requestAnimationFrame(step);
    };
    step();
  }

  bindActionInput() {
    new KeyPressListener("Enter", () => {
      this.map.checkForActionCutScene();
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
      //does nothing if there is another dialogue box
      if (document.querySelector('.TextMessage')) {
        return;
      } 

      const hero = this.map.gameObjects["hero"];
      let messageText = "";
      if (hero && hero.inventory) {
        messageText = "";
        let count = 1;
        for (const item in hero.inventory) {
          const itemName = item.charAt(0).toUpperCase() + item.slice(1);
          messageText += `${itemName}: ${hero.inventory[item]}\t`;
          count++;
        }
      } else {
        messageText = "Your inventory is empty!";
      }
      const message = new TextMessage({
        text: messageText,
        onComplete: () => {}
      });
      message.init(document.querySelector(".game-container"));
      message.revealingText.warpToDone();
    });
  }

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
    window.overworld.map.spawnNPCAtTile();

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

    this.upgradeMenu = new UpgradeMenu({ 
      container: document.querySelector(".game-container"), 
      player: this.map.gameObjects["hero"],
      onClose: () => {}
    });
  
  new KeyPressListener("KeyU", () => {
    if (document.querySelector(".upgrade-menu")) {
      window.upgradeMenu.close();
    } else {
      window.upgradeMenu.open();
    }
  });
  
  
    window.upgradeMenu = this.upgradeMenu;

    this.startGameLoop();

    //how long until the next NPC spawns 
    setInterval(() => {
      this.map.spawnNPCAtTile();
    }, 5000);

    // this.map.startCutScene([
    //   // { type: "textMessage", text: "Get ready for your first day on the job!" },
    //   // { who: "npc1", type: "walk", direction: "up" },
    //   // { who: "npc1", type: "walk", direction: "up" },
    //   // { who: "npc1", type: "walk", direction: "up" },
    //   // { who: "npc1", type: "walk", direction: "up" },
    //   // { who: "npc1", type: "walk", direction: "up" },
    // ]);
  }
}
