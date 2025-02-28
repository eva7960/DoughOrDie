class OrderManager {
    constructor() {
      this.orders = {};
      this.timer = new Timer();
  
      //press o on the keyboard to output all orders to the console and show inventory in dialogue box
      new KeyPressListener("KeyO", () => {
        this.printOrders();
      });
    }
    
    //add order to array 
    addOrder(npcId, order) {
      if (!this.orders[npcId]) {
        this.orders[npcId] = order;
        console.log(`Order added from ${npcId}: ${order}`);
      }
    }
    
    //finish the order, delete it from the array 
    completeOrder(npcId) {
      if (this.orders[npcId]) {
        console.log(`Order completed for ${npcId}: ${this.orders[npcId]}`);
        delete this.orders[npcId];
      }
    }
  
    getOrders() {
      return this.orders;
    }
  
    printOrders() {
      //does nothing if there is another dialogue box already open 
      if (document.querySelector('.TextMessage')){
        return;
      } 

      console.log("Current Orders:", this.orders);
      let messageText = "";
      const orders = this.orders;
      if (Object.keys(orders).length === 0) {
        messageText = "No orders at the moment!";
      } else {
        messageText = "Current Orders:\n";
        let count = 1;
        for (const npc in orders) {
          messageText += `${count}. ${orders[npc]}\n`;
          count++;
        }
      }
      const message = new TextMessage({
        text: messageText,
        onComplete: () => {}
      });
      message.init(document.querySelector(".game-container"));
      message.revealingText.warpToDone();
    }
    
    

  }
  
  window.orderManager = new OrderManager();
  