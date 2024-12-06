// Select DOM elements
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const conversation = document.getElementById('conversation');

// Pronoun substitution mapping
const pronounSubstitutions = {
    "i": "you",
    "me": "you",
    "my": "your",
    "mine": "yours",
    "you": "I",
    "your": "my",
    "yours": "mine",
    "am": "are",
    "are": "am"
};

// Responses dictionary
const responsesDictionary = {
    "hello|hi|hey": [
        "Hi there! How do you feel right now?",
        "Hello! What are you thinking about?",
        "Hey! How can I help you?"
    ],
    "(.*) mother|father|family|parent(.*)": [
        "Tell me more about your family.",
        "How does that make you feel about your family?",
        "What role does your family play in your thoughts?"
    ],
    "(.*) I need (.*)": [
        "Why do you need {1}?",
        "Would getting {1} really help you?",
        "What if you didn’t need {1}?"
    ],
    "(.*) I am (.*)": [
        "Why do you think you are {1}?",
        "How long have you felt that way?",
        "What made you feel like {1}?"
    ],
    "(.*) I feel (.*)": [
        "Why do you feel {1}?",
        "Does feeling {1} happen often?",
        "How does that feeling affect you?"
    ],
    "(.*) (sorry|apologize)(.*)": [
        "No need to apologize.",
        "Apologies aren't necessary. Why do you feel that way?",
        "It’s okay to feel that way."
    ],
    "bye|goodbye|exit": [
        "Goodbye! Take care.",
        "Thank you for sharing. Goodbye!",
        "Bye! I’m here if you need to talk again."
    ],
    "(.*)": [
        "Can you tell me more?",
        "Why do you say that?",
        "How does that make you feel?",
        "What do you mean by that?",
        "Interesting... go on."
    ]
};

// Function to reflect user input (swap pronouns and tenses)
function reflectInput(input) {
    const words = input.toLowerCase().split(/\b/);
    const reflectedWords = words.map(word => pronounSubstitutions[word] || word);
    return reflectedWords.join('');
}

// ELIZA's responses with pronoun reflection
function getElizaResponse(input) {
    console.log("getElizaResponse called with input:", input);
    for (const [pattern, responses] of Object.entries(responsesDictionary)) {
        const regex = new RegExp(pattern, "i");
        const match = input.match(regex);
        console.log(`Pattern: ${pattern}, Match:`, match);
        if (match) {
            console.log("Matched groups:", match);
            // Randomly pick a response
            const response = responses[Math.floor(Math.random() * responses.length)];
            
            // Replace placeholders like {0}, {1}, and reflect pronouns if needed
            return response.replace(/\{(\d+)\}/g, (_, index) => reflectInput(match[parseInt(index, 10) + 1]));
        }
    }
    return "I'm not sure I understand. Can you elaborate?";
}



// Function to display messages in the chat window
function displayMessage(message, isUser = false) {
    const messageElement = document.createElement('div');
    messageElement.className = isUser ? 'user-message' : 'eliza-message';
    messageElement.textContent = message;
    conversation.appendChild(messageElement);
    conversation.scrollTop = conversation.scrollHeight; // Auto-scroll to the bottom
}

// Event listeners for sending messages
sendButton.addEventListener('click', () => {
    const userMessage = userInput.value.trim();
    if (userMessage === "") return;

    displayMessage(userMessage, true); // Display user message
    const elizaMessage = getElizaResponse(userMessage); // Get ELIZA's response
    setTimeout(() => displayMessage(elizaMessage), 500); // Display ELIZA's response with a delay
    userInput.value = ""; // Clear the input field
});

userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendButton.click();
    }
});
