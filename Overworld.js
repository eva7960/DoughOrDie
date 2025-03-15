class Overworld {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.map = null;
        this.audio = new Audio("background.mp3");

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
            let timer = window.orderManager.timer
            this.hud.update({
                score: hero.score,
                health: hero.health,
                timer: timer.formatTime(),
            });

            if(hero.health === 0 || timer.remainingTime === 0) {
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
        this.audio.pause();
        if(this.map.name === "Outside") {
            this.audio = new Audio("outside.mp3");
            for (let i = 0; i < 15; i++) {
                this.map.spawnEnemy();
            }
            setInterval(() => {
                if(this.map.name === "Outside") {
                    this.map.spawnEnemy();
                }
            }, 8000);
        } else {
            this.audio = new Audio("background.mp3");
            setInterval(() => {
                this.map.spawnNPCAtTile();
            }, 8000);
        }
        this.audio.loop = true;
        this.audio.volume = 0.1;
        this.audio.play();
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
        setTimeout(() => {
            const titleScreen = document.querySelector(".TitleScreen");
            if (titleScreen) {
                titleScreen.remove();
            }
        }, 100); // Short delay to ensure DOM updates
        this.startMap(window.OverworldMaps.Shop);
        this.bindActionInput();
        this.bindInventoryInput();
        this.bindHeroPositionCheck();

        this.directionInput = new DirectionInput();
        this.directionInput.init();

        this.hud = new HUD({ container: this.element });

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
        this.map.spawnNPCAtTile();
        this.startGameLoop();
    }


    showGameOverScreen() {
        // Hide HUD
        this.hud.element.style.display = "none";

        // Create the GameOverScreen with the onExit function
        const gameOverScreen = new GameOverScreen({
            onExit: () => {
                this.startGame();
            }
        });
        gameOverScreen.init(document.body);
    }

}