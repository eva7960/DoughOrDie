class HUD {
    constructor({ container }) {
      this.container = container;
      this.element = document.createElement("div");
      this.element.classList.add("HUD");
      this.element.innerText = "HUD";
      container.appendChild(this.element);
    }
  
    update(text) {
      this.element.innerText = text;
    }
  }
  