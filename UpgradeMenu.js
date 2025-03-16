class UpgradeMenu {
  constructor({ container, player, onClose }) {
    this.container = container;
    this.player = player;
    this.onClose = onClose;
    this.element = null;
    this.upgrades = [
      {
        name: "Health",
        cost: 100,
        action: () => {
          let activeHero;
          if (
            window.OverworldMaps &&
            window.OverworldMaps.Outside &&
            window.OverworldMaps.Outside.gameObjects &&
            window.OverworldMaps.Outside.gameObjects["hero"]
          ) {
            activeHero = window.OverworldMaps.Outside.gameObjects["hero"];
          } else {
            activeHero = this.player;
          }
          if (activeHero.score >= 100) {
            activeHero.score -= 100;
            activeHero.health += 10;
            if (
              window.OverworldMaps &&
              window.OverworldMaps.Shop &&
              window.OverworldMaps.Shop.gameObjects &&
              window.OverworldMaps.Shop.gameObjects["hero"]
            ) {
              window.OverworldMaps.Shop.gameObjects["hero"].score = activeHero.score;
              window.OverworldMaps.Shop.gameObjects["hero"].health = activeHero.health;
            }
            if (
              window.OverworldMaps &&
              window.OverworldMaps.Outside &&
              window.OverworldMaps.Outside.gameObjects &&
              window.OverworldMaps.Outside.gameObjects["hero"]
            ) {
              window.OverworldMaps.Outside.gameObjects["hero"].score = activeHero.score;
              window.OverworldMaps.Outside.gameObjects["hero"].health = activeHero.health;
            }
            this.player.score = activeHero.score;
            this.player.health = activeHero.health;
            console.log("New Health: " + activeHero.health);
          }
        }
      },
      {
        name: "Increase Damage",
        cost: 200,
        action: () => {
          let activeHero;
          if (
            window.OverworldMaps &&
            window.OverworldMaps.Outside &&
            window.OverworldMaps.Outside.gameObjects &&
            window.OverworldMaps.Outside.gameObjects["hero"]
          ) {
            activeHero = window.OverworldMaps.Outside.gameObjects["hero"];
          } else {
            activeHero = this.player;
          }
          if (activeHero.score >= 200) {
            activeHero.score -= 200;
            activeHero.damageBonus = (activeHero.damageBonus || 0) + 10;
            if (
              window.OverworldMaps &&
              window.OverworldMaps.Shop &&
              window.OverworldMaps.Shop.gameObjects &&
              window.OverworldMaps.Shop.gameObjects["hero"]
            ) {
              window.OverworldMaps.Shop.gameObjects["hero"].score = activeHero.score;
              window.OverworldMaps.Shop.gameObjects["hero"].damageBonus = activeHero.damageBonus;
            }
            if (
              window.OverworldMaps &&
              window.OverworldMaps.Outside &&
              window.OverworldMaps.Outside.gameObjects &&
              window.OverworldMaps.Outside.gameObjects["hero"]
            ) {
              window.OverworldMaps.Outside.gameObjects["hero"].score = activeHero.score;
              window.OverworldMaps.Outside.gameObjects["hero"].damageBonus = activeHero.damageBonus;
            }
            this.player.score = activeHero.score;
            console.log("New Damage Bonus: " + activeHero.damageBonus);
          }
        }
      },
      {
        name: "Armor Upgrade",
        cost: 150,
        action: () => {
          let activeHero;
          if (
            window.OverworldMaps &&
            window.OverworldMaps.Outside &&
            window.OverworldMaps.Outside.gameObjects &&
            window.OverworldMaps.Outside.gameObjects["hero"]
          ) {
            activeHero = window.OverworldMaps.Outside.gameObjects["hero"];
          } else {
            activeHero = this.player;
          }
          if (activeHero.score >= 150) {
            activeHero.score -= 150;
            activeHero.armor += 1;
            if (
              window.OverworldMaps &&
              window.OverworldMaps.Shop &&
              window.OverworldMaps.Shop.gameObjects &&
              window.OverworldMaps.Shop.gameObjects["hero"]
            ) {
              window.OverworldMaps.Shop.gameObjects["hero"].score = activeHero.score;
              window.OverworldMaps.Shop.gameObjects["hero"].armor = activeHero.armor;
            }
            if (
              window.OverworldMaps &&
              window.OverworldMaps.Outside &&
              window.OverworldMaps.Outside.gameObjects &&
              window.OverworldMaps.Outside.gameObjects["hero"]
            ) {
              window.OverworldMaps.Outside.gameObjects["hero"].score = activeHero.score;
              window.OverworldMaps.Outside.gameObjects["hero"].armor = activeHero.armor;
            }
            this.player.score = activeHero.score;
            console.log("New Armor: " + activeHero.armor);
          }
        }
      }
    ];
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("upgrade-menu");

    const title = document.createElement("h2");
    title.innerText = "Upgrade Menu";
    this.element.appendChild(title);

    const description = document.createElement("p");
    description.innerText = "Spend your points on upgrades:";
    this.element.appendChild(description);

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
        this.update();
      });
      optionContainer.appendChild(purchaseButton);

      this.element.appendChild(optionContainer);
    });

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

  update() {
  }
}
