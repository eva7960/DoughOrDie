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

            let hero = window.OverworldMaps.Outside.gameObjects["hero"];
            window.OverworldMaps.Outside.gameObjects["hero"].score = window.OverworldMaps.Shop.gameObjects["hero"].score;
            this.hud.update({
                score: hero.score,
                health: hero.health,
                timer: window.orderManager.timer.formatTime(),
            });

            if(hero.health === 0 || window.orderManager.timer.remainingTime === 0) {
                this.showGameOverScreen();
            }

            requestAnimationFrame(step);
        };
        step();
    }
    bindActionInput() {
        new KeyPressListener("Enter", () => {
            this.map.checkForActionCutScene();
        });
        new KeyPressListener("Space", () => {
            if(this.map.name === "Outside") {
                this.map.shoot();
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
            let messageText;
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

    bindHeroPositionCheck() {
        document.addEventListener("PersonWalkingComplete", e => {
            if (e.detail.whoId === "hero") {
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
        this.showTitleScreen();
    }

    showTitleScreen() {
        const titleScreen = new TitleScreen({
            onComplete: () => {
                this.startGame();
                window.orderManager.timer.start();
            }
        });
        titleScreen.init(document.body);
    }

    startGame() {
        document.querySelector(".TitleScreen").remove();
        this.startMap(window.OverworldMaps.Shop);
        this.bindActionInput();
        this.bindInventoryInput();
        this.bindHeroPositionCheck();

        this.directionInput = new DirectionInput();
        this.directionInput.init();

        this.hud = new HUD({ container: this.element });

        //spawn NPC when game starts
        this.map.spawnNPCAtTile();

        //spawn customers in every 8 seconds
        setInterval(() => {
            this.map.spawnNPCAtTile();
        }, 8000);

        //spawn enemies every 5 seconds
        setInterval(() => {
            if(this.map.name === "Outside") {
                this.map.spawnEnemy();
            }
        }, 5000);

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