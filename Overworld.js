class Overworld {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.map = null;
    }


    startGameLoop() {
        const step = () => {
            if (this.isGameOver) return; // Stop the game loop when game over is triggered

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

            // Update HUD
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
        new KeyPressListener("Space", () => {
            this.map.shoot();
        });

        new KeyPressListener("KeyR", () => {

        });
    }

    bindHeroPositionCheck() {
        document.addEventListener("PersonWalkingComplete", e => {
            if (e.detail.whoId === "hero") {
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

    startMap(mapConfig) {
        this.map = new OverworldMap(mapConfig);
        this.map.overworld = this;
        this.map.mountObjects();
    }


    init() {
        this.showTitleScreen();

        document.addEventListener("GameOver", () => {
            window.timer.stop(); // Stop the timer when game over happens
            this.showGameOverScreen();
        });


    }

    showTitleScreen() {
        const titleScreen = new TitleScreen({
            onComplete: () => {
                this.startGame();
            }
        });
        titleScreen.init(document.body);
    }

    startGame() {
        document.querySelector(".TitleScreen").remove(); // Remove the title screen
        this.startMap(window.OverworldMaps.Shop);
        this.bindActionInput();
        this.bindInventoryInput();
        this.bindHeroPositionCheck();

        this.directionInput = new DirectionInput();
        this.directionInput.init();

        this.hud = new HUD({ container: this.element });

        this.startGameLoop();

        this.timer.stop();
        this.timer = new Timer({ initialTime: 60 });


        this.checkGameOver();
    }

    checkGameOver() {
        const check = setInterval(() => {
            const hero = this.map.gameObjects.hero;

            if (hero.health <= 0 || this.timer.remainingTime <= 0) {
                clearInterval(check);

                // Ensure health is exactly 0
                hero.health = 0;

                // Stop the game loop
                cancelAnimationFrame(this.gameLoopId);

                // Show Game Over screen
                this.showGameOverScreen();
            }
        }, 500); // Check every 0.5 seconds for better responsiveness
    }


    showGameOverScreen() {
        // Hide HUD
        this.hud.element.style.display = "none";

        const gameOverScreen = new GameOverScreen({
            onRestart: () => {
                document.querySelector(".GameOverScreen").remove();
                this.startGame();
            }
        });
        gameOverScreen.init(document.body);
    }


}