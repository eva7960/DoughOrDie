class GameObject {
  constructor(config) {
    this.id = null;
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.direction = config.direction || "down";
    this.sprite = new Sprite({
      gameObject: this,
      src: config.src || "./sprites/player.png",
    });

    this.behaviorLoop = config.behaviorLoop || [];
    this.behaviorLoopIndex = 0;

    this.talking = config.talking || [];
  }

  mount(map) {
    // this.isMounted = true;
    // map.addWall(this.x, this.y);
    //
    setTimeout(() => {
      this.doBehaviorEvent(map).then(r => {});
    }, 10)
  }

  update() {
  }
  async doBehaviorEvent(map) {
    if(map.isCutScenePlaying || this.behaviorLoop.length === 0 || this.isStanding) {
      return;
    }
    let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
    eventConfig.who = this.id;

    const eventHandler = new OverworldEvent({map, event: eventConfig});
    await eventHandler.init();

    this.behaviorLoopIndex += 1;
    if(this.behaviorLoopIndex === this.behaviorLoop.length) {
      this.behaviorLoopIndex = 0;
    }

    await this.doBehaviorEvent(map);
  }
}
