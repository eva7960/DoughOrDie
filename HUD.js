class HUD {
  constructor({ container }) {
    this.container = container;
    this.element = document.createElement("div");
    this.element.classList.add("HUD");

    this.scoreElement = document.createElement("div");
    this.healthElement = document.createElement("div");
    this.timerElement = document.createElement("div");
    this.helpElement = document.createElement("div");
    //for css
    this.scoreElement.classList.add("hud-stat");
    this.healthElement.classList.add("hud-stat");
    this.timerElement.classList.add("hud-stat");
    this.helpElement.classList.add("hud-help");
    this.helpElement.innerText = "Press H for help";


    this.element.appendChild(this.scoreElement);
    this.element.appendChild(this.healthElement);
    this.element.appendChild(this.timerElement);
    this.element.appendChild(this.helpElement);

    container.appendChild(this.element);
  }

  update({ score, health, timer }) {
    this.scoreElement.innerText = "Money: " + score;
    this.healthElement.innerText = "Health: " + health;
    this.timerElement.innerText = "Timer: " + timer;
  }
}