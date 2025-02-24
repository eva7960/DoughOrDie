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
          this.remainingTime = 0; // Ensure it doesn’t go negative
          utils.emitEvent("GameOver"); // Fire Game Over event
        }
        
      }, 1000);
    }
  
    stop() {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
    }
    reset() {
        this.initialTime = 60;
        this.remainingTime = 60;
    }
  }

  