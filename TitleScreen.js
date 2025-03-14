class TitleScreen {
    constructor({ onComplete }) {
        this.onComplete = onComplete;
        this.element = null;
        this.selectedOption = 0; // 0 = Play, 1 = Exit
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("TitleScreen");

        this.element.innerHTML = `
            <img src="./titleLogo.png" class="game-logo animated-logo" alt="Dough or Die Logo">

            <div class="options">
                <p class="option ${this.selectedOption === 0 ? "selected" : ""}" data-option="play">Play</p>
                <p class="option ${this.selectedOption === 1 ? "selected" : ""}" data-option="exit">Exit</p>
            </div>
            <p class="instructions">Press Enter to Select</p>
        `;

        document.addEventListener("keydown", this.handleInput);
    }

    handleInput = (event) => {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            this.selectedOption = this.selectedOption === 0 ? 1 : 0;
            this.updateSelection();
        }
        if (event.key === "Enter") {
            if (this.selectedOption === 0) {
                document.removeEventListener("keydown", this.handleInput);
                this.onComplete(); // Start the game
            } else {
                window.close(); // Exit the game
            }
        }
    };



    updateSelection() {
        const options = this.element.querySelectorAll(".option");
        options.forEach((option, index) => {
            option.classList.toggle("selected", index === this.selectedOption);
        });
    }

    init(container) {
        this.createElement();
        container.appendChild(this.element);
    }
}