class OrderManager {
  constructor() {
    //array of orders
    this.orders = {};
    this.timer = new Timer();

    //press o on the keyboard to output all orders to the console
    new KeyPressListener("KeyO", () => {
      this.printOrders();
    });
  }

  //add order to array
  addOrder(npcId, order) {
    if (!this.orders[npcId]) {
      this.orders[npcId] = order;
      console.log(`Order added from ${npcId}: ${order}`);
      this.timer.start();
    }
  }

  //finish the order, delete it from the array
  completeOrder(npcId) {
    if (this.orders[npcId]) {
      console.log(`Order completed for ${npcId}: ${this.orders[npcId]}`);
      delete this.orders[npcId];
      this.timer.stop();
    }
  }

  getOrders() {
    return this.orders;
  }

  printOrders() {
    console.log("Current Orders:", this.orders);
  }
}

window.orderManager = new OrderManager();
  