class GameOverScreen {
    constructor({ onExit }) {
        this.onExit = onExit;
        this.element = null;
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("GameOverScreen");

        this.element.innerHTML = `
            <img src="gameOverLogo.png" class="animated-logo">
            <div class="options">
                <p class="option selected" data-option="exit">Exit</p>
            </div>
            <p class="instruction-text">Press Enter to exit</p>
        `;

        document.addEventListener("keydown", this.handleInput);

        // Stop player movement
        window.overworld.isGameOver = true;
        window.overworld.directionInput.heldDirections = [];
    }

    handleInput = (event) => {
        if (event.key === "Enter") {
            console.log("Exit pressed"); // Debugging: Ensure this prints when Enter is pressed
            this.exitGame();
        }
    };

    exitGame() {
        if (window.self !== window.top) {
            window.location.href = "about:blank"; // Redirect to blank page
        } else {
            window.close(); // Try to close the window
        }
    }

    init(container) {
        this.createElement();
        container.appendChild(this.element);
    }
}
