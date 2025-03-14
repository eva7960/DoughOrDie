class Shop {
    constructor({ onComplete }) {
        this.onComplete = onComplete;
        this.element = null;
        this.selectedOption = 0; // 0 = Upgrade max health, 1 = Add Shop decorations, 2 = Upgrade gun
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("ShopScreen");

        // Set the dimensions to match the canvas size (194x180)
        this.element.style.width = "194px";
        this.element.style.height = "180px";
        this.element.style.position = "absolute";
        this.element.style.top = "50%";
        this.element.style.left = "50%";
        this.element.style.transform = "translate(-50%, -50%)"; // Center the shop screen

        // Create a div to hold the buttons side by side
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("button-container");

        // Create the three buttons
        const options = [
            "Upgrade max health",
            "Add Shop decorations",
            "Upgrade gun"
        ];

        options.forEach((option, index) => {
            const button = document.createElement("button");
            button.classList.add("option"); // Always add the 'option' class
            if (index === this.selectedOption) {
                button.classList.add("selected"); // Add 'selected' class if this is the selected option
            }
            button.textContent = option;
            button.dataset.option = option.toLowerCase().replace(/ /g, "");
            button.addEventListener("click", () => this.handleSelect(index)); // Add click event
            buttonContainer.appendChild(button);
        });


        this.element.appendChild(buttonContainer);

        document.addEventListener("keydown", this.handleInput);
    }

    handleInput = (event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight" || event.key === "a" || event.key === "d") {
            this.selectedOption = (this.selectedOption + (event.key === "ArrowRight" || event.key === "d" ? 1 : -1) + 3) % 3;
            this.updateSelection();
        }
        if (event.key === "Enter") {
            this.handleSelect(this.selectedOption); // Trigger selection on Enter
        }
    };

    handleSelect(index) {
        const options = [
            "Upgrade max health",
            "Add Shop decorations",
            "Upgrade gun"
        ];
        const selectedOption = options[index];
        console.log(`Selected: ${selectedOption}`);
        this.onComplete(selectedOption);  // Call the onComplete callback with the selected option
    }

    updateSelection() {
        const buttons = this.element.querySelectorAll(".option");
        buttons.forEach((button, index) => {
            button.classList.toggle("selected", index === this.selectedOption);
        });
    }

    init(container) {
        if (this.element) {
            this.element.remove();  // Remove the previous shop screen if it exists
        }
        this.createElement();
        container.appendChild(this.element);
    }
}
