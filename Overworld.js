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

      //update the HUD, currently just shows position of hero 
      const hero = this.map.gameObjects.hero;
      this.hud.update("Position: (" + hero.x + ", " + hero.y + ")  Health: " + hero.health);

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
