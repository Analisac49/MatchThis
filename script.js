// Find the container for the cards
const cardsContainer = document.getElementById("cards-container");

// Define the available colors
const colors = ["aqua", "aquamarine", "crimson", "blue", "dodgerblue", "gold", "greenyellow", "teal"];

// Initialize game state variables
let revealedCount = 0; // Count of revealed cards
let activeCard = null; // The currently active card (if any)
let awaitingEndOfMove = false; // Flag to prevent interactions during card animations

// Initialize an array to keep track of revealed cards
const revealedCards = [];

// Function to create a card element with a given color
function buildCard(color) {
    // Create a new card element
    const element = document.createElement("div");

    // Add CSS classes and attributes to the card
    element.classList.add("card");
    element.setAttribute("data-color", color);
    element.setAttribute("data-revealed", "false");

    // Add a click event listener to handle card interactions
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

        // Reveal this color by changing the card's background color
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

            // Add both cards to the revealedCards array
            revealedCards.push(element, activeCard);

            // Reset the active card and animation flag
            activeCard = null;
            awaitingEndOfMove = false;
            revealedCount += 2;

            // Check if all cards are revealed, display a win message
            if (revealedCount === cardCount) {
                alert("You win!");
            }

            return;
        }

        // If the colors don't match, wait for a quick moment and then hide them again
        awaitingEndOfMove = true;

        setTimeout(() => {
            activeCard.style.backgroundColor = null;
            element.style.backgroundColor = null;

            // Reset the animation flag and active card
            awaitingEndOfMove = false;
            activeCard = null;
        }, 1000);
    });

    return element;
}

// Function to start a new game with a specified number of cards
function startGame(cardCount) {
    // Clear existing cards from the container
    cardsContainer.innerHTML = "";

    // Clear the revealed cards array and reset game state
    revealedCards.length = 0;
    revealedCount = 0;
    activeCard = null;
    awaitingEndOfMove = false;

    // Generate pairs of cards with random colors
    const colorsForPairs = colors.slice(0, cardCount / 2);
    const cardColors = [...colorsForPairs, ...colorsForPairs];

    // Shuffle the card colors to randomize their order
    for (let i = cardColors.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cardColors[i], cardColors[j]] = [cardColors[j], cardColors[i]];
    }

    // Create and append the cards to the container
    cardColors.forEach((color) => {
        const card = buildCard(color);
        cardsContainer.appendChild(card);
    });

    // Check if the cardCount is 24 and add more cards if needed
    if (cardCount === 24) {
        for (let i = 0; i < 8; i++) { // Add 8 more cards for a total of 24 (Had issues getting 24)
            const extraCard = buildCard(colors[i]);
            cardsContainer.appendChild(extraCard);
        }
    }
}

// Function to restart the current game
function restart() {
    const cardCount = document.querySelectorAll(".card").length;
    startGame(cardCount);
}

// Event listeners for the buttons
const btn8 = document.getElementById("btn-8");
const btn16 = document.getElementById("btn-16");
const btn24 = document.getElementById("btn-24"); 
const btnRestart = document.getElementById("btn-restart");

if (btn8 && btn16 && btn24 && btnRestart) {
    // Event listener for 8-card game
    btn8.addEventListener("click", () => startGame(8));
    
    // Event listener for 16-card game
    btn16.addEventListener("click", () => startGame(16));
    
    // Event listener for 24-card game
    btn24.addEventListener("click", () => startGame(24));
    
    // Event listener for game restart
    btnRestart.addEventListener("click", restart);
}

// Call startGame with an initial card count like 8 when the page loads
window.onload = () => {
    startGame(8);
};