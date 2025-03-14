class Timer {
    constructor() {
        this.initialTime = 3;
        this.remainingTime = 3;
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

  