const deltaNext = 5;

function levelToExp(level) {
 return ((level * (level - 1)) / 2) * deltaNext;
}

module.exports = {
 config: {
 name: "rerank",
 version: "2.0",
 author: "Chitron Bhattacharjee",
 role: 2,
 shortDescription: {
 en: "Force user EXP based on level"
 },
 longDescription: {
 en: "Force EXP of a user (or Top 1) to match target level. Works with mention, UID, or 'top'."
 },
 category: "ranking",
 guide: {
 en: "{pn} <@mention | uid | top> <level>\n\n" +
 "📌 Examples:\n" +
 "• {pn} @User 18\n" +
 "• {pn} 100087xxxxx 20\n" +
 "• {pn} top 22"
 }
 },

 onStart: async function ({ args, message, event, usersData }) {
 if (args.length < 2) {
 return message.reply("⚠️ Usage: +rerank <@mention | uid | top> <level>");
 }

 let targetUID;

 if (args[0].toLowerCase() === "top") {
 // Get top 1 EXP user
 const allUsers = await usersData.getAll();
 const topUser = allUsers
 .filter(u => u.exp > 0)
 .sort((a, b) => b.exp - a.exp)[0];

 if (!topUser) return message.reply("❌ No EXP data found for top user.");
 targetUID = topUser.userID;
 }

 else if (Object.keys(event.mentions || {}).length > 0) {
 targetUID = Object.keys(event.mentions)[0];
 }

 else if (!isNaN(args[0])) {
 targetUID = args[0];
 }

 const level = parseInt(args[1]);
 if (!targetUID || isNaN(level) || level < 1)
 return message.reply("⚠️ Please provide valid UID or mention and a level number ≥ 1.");

 const expNeeded = levelToExp(level);

 await usersData.set(targetUID, { exp: expNeeded });

 const user = await usersData.get(targetUID);
 const name = user?.name || "Unknown";

 return message.reply(
 `🎯 Successfully reranked:\n` +
 `👤 Name: ${name}\n` +
 `🆔 UID: ${targetUID}\n` +
 `📊 New Level: ${level}\n` +
 `✨ EXP: ${expNeeded.toLocaleString()}`
 );
 }
};
