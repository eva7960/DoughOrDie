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

        //Set up a handler to complete when correct person is done walking, then resolve the event
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
        if (this.event.faceHero) {
          const obj = this.map.gameObjects[this.event.faceHero];
          obj.direction = utils.oppositeDirection(this.map.gameObjects["hero"].direction);
        }
    
        let messageText = this.event.text;
    
        if (this.event.order && this.event.who) {
          if (window.orderManager.getOrders()[this.event.who]) {
            window.orderManager.completeOrder(this.event.who);
            messageText = "Wow, that looks amazing! Thank you.";
          } else {
            window.orderManager.addOrder(this.event.who, this.event.order);
          }
        }
    
        // Create and display the text message.
        const message = new TextMessage({
          text: messageText,
          onComplete: () => resolve()
        });
        message.init(document.querySelector(".game-container"));
      }

    changeMap(resolve) {
        const sceneTransition = new SceneTransition();
        sceneTransition.init(document.querySelector(".game-container"), () => {
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