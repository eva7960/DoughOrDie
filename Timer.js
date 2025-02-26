class Timer {
    constructor({ initialTime = 60 }) {
      this.initialTime = initialTime;
      this.remainingTime = initialTime;
      this.interval = null;
    }
  
    formatTime(seconds) {
      return seconds.toString();
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
      }
    }
    
  }

  