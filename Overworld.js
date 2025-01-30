class Overworld {
 constructor(config) {
   this.element = config.element;
   this.canvas = this.element.querySelector(".game-canvas");
   this.ctx = this.canvas.getContext("2d");
   this.map = null;
 }

  startGameLoop() {
    const step = () => {
      //Clear off the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      //make camera
      const camera = this.map.gameObjects.hero;

      //update objects relative to camera before drawing 
      Object.values(this.map.gameObjects).forEach(object => {
      object.update({
        arrow: this.directionInput.direction,
        map: this.map,
      })
    })

      //Draw Lower layer
      this.map.drawLowerImage(this.ctx); //REMEMBER TO ADD CAMERA BACK

      //Draw Game Objects
      Object.values(this.map.gameObjects).forEach(object => {
        object.sprite.draw(this.ctx); //REMEMBER TO ADD CAMERA BACK
      })

      //Draw Upper layer
      this.map.drawUpperImage(this.ctx); //REMEMBER TO ADD CAMERA BACK

      requestAnimationFrame(() => {
        step();
      })
    }
    step();
 }

 init() {
  this.map = new OverworldMap(window.OverworldMaps.Shop);
  this.map.mountObjects();

  this.directionInput = new DirectionInput();
  this.directionInput.init();

  this.startGameLoop();

   this.map.startCutscene([
    {type: "textMessage", text: "HELLO"}
    //   { who: "hero", type: "walk",  direction: "down" },
    //   { who: "hero", type: "walk",  direction: "down" },
    //   { who: "npcA", type: "walk",  direction: "up" },
    //   { who: "npcA", type: "walk",  direction: "left" },
    //   { who: "hero", type: "stand",  direction: "right", time: 200 },
    //   { type: "textMessage", text: "WHY HELLO THERE!"}
    //   // { who: "npcA", type: "walk",  direction: "left" },
    //   // { who: "npcA", type: "walk",  direction: "left" },
    //   // { who: "npcA", type: "stand",  direction: "up", time: 800 },
    // ])
 }
}