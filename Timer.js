class Timer {
    constructor() {
      this.initialTime = 60;
      this.remainingTime = 60;
      this.interval = null;
    }
  
    formatTime() {
      return this.remainingTime.toString();
    }
  
    start() {
      if (this.interval) {
        return;
      }
      this.interval = setInterval(() => {
        this.remainingTime--;
        if (this.remainingTime <= 0) {
          this.stop();
          //add code here to show the game over screen
          console.log("Timer finished!");
        }
      }, 1000);
    }
  
    stop() {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
        this.initialTime = 60;
        this.remainingTime = 60;
      }
    }
  }

  