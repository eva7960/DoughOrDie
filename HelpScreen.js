class HelpScreen {
    constructor({ onExit }) {
        this.onExit = onExit;
        this.element = null;
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("HelpScreen");

        this.element.innerHTML = `
            <img src="./backgrounds/help.png" class="help-image">
            <p class="instruction-text">Press Enter to close</p>
        `;

        document.addEventListener("keydown", this.handleInput);
    }

    handleInput = (event) => {
        if (event.key === "Enter") {
            this.closeHelpScreen();
        }
    };

    closeHelpScreen() {
        if (this.element) {
            this.element.remove();
            document.removeEventListener("keydown", this.handleInput);
        }
    }

    init(container) {
        this.createElement();
        container.appendChild(this.element);
    }
}
