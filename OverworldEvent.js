class OverworldEvent {
    constructor({map,event}) {
        this.map = map;
        this.event = event;
    }

    stand(resolve) {
        const who = this.map.gameObjects[ this.event.who ];
        who.startBehavior({
            map: this.map
        }, {
            type: "stand",
            direction: this.event.direction,
            time: this.event.time
        })

        const completeHandler = e => {
            if (e.detail.whoId === this.event.who) {
                document.removeEventListener("PersonStandComplete", completeHandler);
                resolve();
            }
        }
        document.addEventListener("PersonStandComplete", completeHandler)

    }

    walk(resolve) {
        const who = this.map.gameObjects[this.event.who];
        who.startBehavior({
            map: this.map
        },{
            type: "walk",
            direction: this.event.direction,
            retry: true
        })
        const completeHandler = e => {
            if(e.detail.whoId === this.event.who) {
                document.removeEventListener("PersonWalkingComplete", completeHandler);
                resolve();
            }
        }
        document.addEventListener("PersonWalkingComplete", completeHandler)
    }

    textMessage(resolve) {
        new Audio("talking.mp3").play();
        //make npc face hero
        if (this.event.faceHero) {
            const obj = this.map.gameObjects[this.event.faceHero];
            obj.direction = utils.oppositeDirection(this.map.gameObjects["hero"].direction);
        }

        let messageText = this.event.text;

        //logic to determine output message
        if (this.event.order && this.event.who) {
            const hero = this.map.gameObjects["hero"];
            if (window.orderManager.getOrders()[this.event.who]) {
                const ingredients = this.event.order.split(",").map(s => s.trim().toLowerCase());
                const missingIngredients = ingredients.filter(ingredient => {
                    return !(hero.inventory && hero.inventory[ingredient] > 0);
                });
                if (missingIngredients.length === 0) {
                    for (const ingredient of ingredients) {
                        hero.inventory[ingredient]--;
                        hero.score += 100;
                    }
                    window.orderManager.completeOrder(this.event.who);
                    new Audio("cash.mp3").play();
                    messageText = `Thank you! This ${this.event.order} pizza looks amazing!`;
                } else {
                    const missingDisplay = missingIngredients.map(i => i.charAt(0).toUpperCase() + i.slice(1));
                    messageText = `You don't have the required ingredient${missingIngredients.length > 1 ? 's' : ''}: ${missingDisplay.join(", ")} to complete the order!`;
                }
            } else {
                window.orderManager.addOrder(this.event.who, this.event.order);
            }
        }

        //NPC will move and then despawn after their move sequence
        const message = new TextMessage({
            text: messageText,
            onComplete: () => {
                if (this.event.order && this.event.who && !window.orderManager.getOrders()[this.event.who]) {
                    const npc = this.map.gameObjects[this.event.who];
                    if (npc && !npc.orderMovementDone) {
                        npc.orderMovementDone = true;
                        const sequence = [
                            {type: "walk", direction: "right"},
                            {type: "walk", direction: "right"},
                            {type: "walk", direction: "down"},
                            {type: "walk", direction: "down"},
                            {type: "walk", direction: "down"},
                            {type: "walk", direction: "down"},
                            {type: "walk", direction: "down"},
                            {type: "walk", direction: "down"},
                        ];
                        let current = 0;
                        const moveNext = () => {
                            if (current >= sequence.length) {
                                this.map.deleteWall(npc.x, npc.y);
                                delete this.map.gameObjects[this.event.who];
                                resolve();
                                return;
                            }
                            npc.startBehavior({ map: this.map }, sequence[current]);
                            const completeHandler = e => {
                                if (e.detail.whoId === this.event.who) {
                                    document.removeEventListener("PersonWalkingComplete", completeHandler);
                                    current++;
                                    moveNext();
                                }
                            };
                            document.addEventListener("PersonWalkingComplete", completeHandler);
                        };
                        moveNext();
                        return;
                    }
                }
                resolve();
            }
        });
        message.init(document.querySelector(".game-container"));
    }

    changeMap(resolve) {
        const sceneTransition = new SceneTransition();
        sceneTransition.init(document.querySelector(".game-container"), () => {
            if(this.event.map === "Outside") {
                window.OverworldMaps.Outside.gameObjects["hero"].x = utils.withGrid(0);
                window.OverworldMaps.Outside.gameObjects["hero"].y = utils.withGrid(1);
            } else {
            }
            this.map.overworld.startMap(window.OverworldMaps[this.event.map] );
            resolve();
        });
        sceneTransition.fadeOut();
    }

    init() {
        return new Promise(resolve => {
            this[this.event.type](resolve)
        })
    }
}