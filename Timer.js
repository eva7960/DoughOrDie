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
        if (this.remainingTime === 0) {
          this.stop();
          utils.emitEvent("GameOver");
        }
      }, 1000);
    }
  
    stop() {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
        this.initialTime = 60;
        this.remainingTime = 60;
        clearInterval(this.interval);
      }
    }
  }

  