class Timer {
    constructor() {
        this.initialTime = 100;
        this.remainingTime = 100;
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
            }
        }, 1000);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
            this.initialTime = 100;
            this.remainingTime = 100;
            clearInterval(this.interval);
        }
    }
}

  