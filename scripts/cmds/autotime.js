// autoMessage.js

// Bangladesh time offset +6 GMT
function getBangladeshTime() {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const bangladeshOffset = 6 * 60 * 60 * 1000; // +6 hours
    return new Date(utc + bangladeshOffset);
}

// Cute messages array
const messages = [
    "🌸 Hey there! Time flies, don't forget to smile 😄",
    "🌞 Good hour! Keep shining like the sun ☀️",
    "🐱 Purrfect time for a little break! 🐾",
    "🌈 Sending you a rainbow of happiness 🌈",
    "🍀 Luck and joy for the next hour! 🍀"
];

// Function to pick random message
function getRandomMessage() {
    return messages[Math.floor(Math.random() * messages.length)];
}

// Function to send time + message
function sendTimeMessage() {
    const time = getBangladeshTime();
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const seconds = String(time.getSeconds()).padStart(2, '0');

    console.log(`🕒 Current Time: ${hours}:${minutes}:${seconds} | ${getRandomMessage()}`);
}

// Run immediately on start
sendTimeMessage();

// Schedule function to run every 1 hour (3600000 ms)
setInterval(sendTimeMessage, 3600000);
