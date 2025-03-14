class TitleScreen {
    constructor({ onComplete }) {
        this.onComplete = onComplete;
        this.element = null;
        this.selectedOption = 0; // 0 = Upgrade max health, 1 = Add Shop decorations, 2 = Upgrade gun
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("TitleScreen");

        this.element.innerHTML = `
            <img src="./titleLogo.png" class="game-logo animated-logo" alt="Dough or Die Logo">

            <div class="options">
                <p class="option ${this.selectedOption === 0 ? "selected" : ""}" data-option="maxHealth">Upgrade max health</p>
                <p class="option ${this.selectedOption === 1 ? "selected" : ""}" data-option="shopDecorations">Add Shop decorations</p>
                <p class="option ${this.selectedOption === 2 ? "selected" : ""}" data-option="upgradeGun">Upgrade gun</p>
            </div>
            <p class="instructions">Use Arrow keys or W/S to select, Press Enter to confirm</p>
        `;

        document.addEventListener("keydown", this.handleInput);
    }

    handleInput = (event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight" || event.key === "a" || event.key === "d") {
            this.selectedOption = (this.selectedOption + (event.key === "ArrowRight" || event.key === "d" ? 1 : -1) + 3) % 3;
            this.updateSelection();
        }
        if (event.key === "Enter") {
            if (this.selectedOption === 0) {
                console.log("Selected: Upgrade max health");
                this.onComplete("Upgrade max health"); // You can replace this with an actual action
            } else if (this.selectedOption === 1) {
                console.log("Selected: Add Shop decorations");
                this.onComplete("Add Shop decorations");
            } else if (this.selectedOption === 2) {
                console.log("Selected: Upgrade gun");
                this.onComplete("Upgrade gun");
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
