class HUD {
  constructor({ container }) {
    this.container = container;
    this.element = document.createElement("div");
    this.element.classList.add("HUD");

    this.healthElement = document.createElement("div");
    this.timerElement = document.createElement("div");

    //for css
    this.healthElement.classList.add("hud-stat");
    this.timerElement.classList.add("hud-stat");

    this.element.appendChild(this.healthElement);
    this.element.appendChild(this.timerElement);

    container.appendChild(this.element);
  }

  update({health, timer }) {
    this.healthElement.innerText = "Health: " + health;
    this.timerElement.innerText = "Timer: " + timer;
  }
}
