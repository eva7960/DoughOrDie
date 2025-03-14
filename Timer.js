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
        }, 1000);
    }
}

  