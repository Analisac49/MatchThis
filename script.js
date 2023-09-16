// Find the container for the cards
const cardsContainer = document.querySelector(".cards");

// Define the available colors
const colors = ["aqua", "aquamarine", "crimson", "blue", "dodgerblue", "gold", "greenyellow", "teal"];

// Create a picklist with two of each color
const colorsPicklist = [...colors, ...colors];

// Determine the total number of cards
const cardCount = colorsPicklist.length;

// Initialize game state variables
let revealedCount = 0; // Count of revealed cards
let activeCard = null; // The currently active card (if any)
let awaitingEndOfMove = false; // Flag to prevent interactions during card animations

// Function to create a card element with a given color
function buildCard(color) {
    const element = document.createElement("div");

    element.classList.add("card");
    element.setAttribute("data-color", color);
    element.setAttribute("data-revealed", "false");

    element.addEventListener("click", () => {
        const revealed = element.getAttribute("data-revealed");

        // Check if we should ignore the click event
        if (
            awaitingEndOfMove
            || revealed === "true"
            || element == activeCard
        ) {
            return;
        }

        // Reveal this color by changing the cards's background color
        element.style.backgroundColor = color;

        if (!activeCard) {
            // If no other card is active, make this card the active one
            activeCard = element;
            return;
        }

        const colorToMatch = activeCard.getAttribute("data-color");

        if (colorToMatch === color) {
            // If the colors match, mark both cards as revealed
            element.setAttribute("data-revealed", "true");
            activeCard.setAttribute("data-revealed", "true");

            activeCard = null;
            awaitingEndOfMove = false;
            revealedCount += 2;

            if (revealedCount === cardCount) {
                // Check if all cards are revealed, display a win message
                alert("You win!");
            }

            return;
        }

        // If the colors don't match, wait for a moment and then hide them again
        awaitingEndOfMove = true;

        setTimeout(() => {
            activeCard.style.backgroundColor = null;
            element.style.backgroundColor = null;

            awaitingEndOfMove = false;
            activeCard = null;
        }, 1000);
    });

    return element;
}

// Build cards
for (let i = 0; i < cardCount; i++) {
    const randomIndex = Math.floor(Math.random() * colorsPicklist.length);
    const color = colorsPicklist[randomIndex];
    const card = buildCard(color);

    // Remove the used color from the picklist
    colorsPicklist.splice(randomIndex, 1);

    // Append the card to the container
    cardsContainer.appendChild(card);
}