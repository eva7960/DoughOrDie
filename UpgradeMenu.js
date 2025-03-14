class UpgradeMenu {
    constructor({ container, player, onClose }) {
      this.container = container;
      this.player = player;
      this.onClose = onClose; // Callback when menu closes
      this.element = null;
      // Define our upgrade options:
      this.upgrades = [
        {
          name: "Increase Health",
          cost: 100,
          action: () => {
            if (this.player.score >= 100) {
              this.player.score -= 100;
              this.player.health += 10;

            } else {

            }
          }
        },
      ];
    }
  
    createElement() {
      // Create the upgrade menu container
      this.element = document.createElement("div");
      this.element.classList.add("upgrade-menu");
  
      // Title
      const title = document.createElement("h2");
      title.innerText = "Upgrade Menu";
      this.element.appendChild(title);
  
      // Description
      const description = document.createElement("p");
      description.innerText = "Spend your points on upgrades:";
      this.element.appendChild(description);
  
      // Create upgrade options
      this.upgrades.forEach(upgrade => {
        const optionContainer = document.createElement("div");
        optionContainer.classList.add("upgrade-option");
  
        const label = document.createElement("span");
        label.innerText = `${upgrade.name} (-${upgrade.cost} pts)`;
        optionContainer.appendChild(label);
  
        const purchaseButton = document.createElement("button");
        purchaseButton.innerText = "Purchase";
        purchaseButton.addEventListener("click", () => {
          upgrade.action();
          this.update(); // Refresh if needed
        });
        optionContainer.appendChild(purchaseButton);
  
        this.element.appendChild(optionContainer);
      });
  
      // Close button
      const closeButton = document.createElement("button");
      closeButton.innerText = "Close";
      closeButton.addEventListener("click", () => {
        this.close();
      });
      this.element.appendChild(closeButton);
    }
  

    open() {
      if (!this.element) {
        this.createElement();
      }
      this.container.appendChild(this.element);
    }
  
    close() {
      if (this.element && this.element.parentElement) {
        this.element.parentElement.removeChild(this.element);
      }
      if (this.onClose) {
        this.onClose();
      }
    }
  }
  