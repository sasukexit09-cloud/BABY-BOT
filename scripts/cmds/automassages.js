// autoGroupMessengerBold.js
const login = require("facebook-chat-api");

// FB credentials
const credentials = { email: "YOUR_EMAIL", password: "YOUR_PASSWORD" };

// Cute messages
const messages = [
    "🌸 Hope you're having a great day!",
    "✨ Take a short break and smile 😊",
    "💖 Don't forget to drink water! Stay hydrated!",
    "🌟 Keep shining! Every hour is a new opportunity!",
    "🍀 Sending you good vibes for the next hour!"
];

// Bangladesh time function
function getBangladeshTime() {
    const utc = new Date();
    const offset = 6; // UTC+6
    const bdTime = new Date(utc.getTime() + offset * 60 * 60 * 1000);
    const hours = bdTime.getHours().toString().padStart(2, '0');
    const minutes = bdTime.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Login to FB
login(credentials, (err, api) => {
    if(err) return console.error(err);

    // Get all threads (groups and users)
    api.getThreadList(100, null, [], (err, threads) => {
        if(err) return console.error(err);

        // Filter only group threads
        const groupThreads = threads.filter(thread => thread.isGroup);

        if(groupThreads.length === 0) {
            console.log("No groups found where bot is added.");
            return;
        }

        console.log(`Found ${groupThreads.length} groups.`);

        // Function to send message to all groups
        function sendMessageToGroups() {
            const time = getBangladeshTime();
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            const fullMessage = `🕒 Current Time: *${time}* | *${randomMessage}*`;

            groupThreads.forEach(group => {
                api.sendMessage(fullMessage, group.threadID, err => {
                    if(err) console.error(`Error sending to ${group.name}:`, err);
                    else console.log(`Sent to ${group.name}: ${fullMessage}`);
                });
            });
        }

        // Send immediately
        sendMessageToGroups();

        // Send every 1 hour
        setInterval(sendMessageToGroups, 3600000);
    });
});
