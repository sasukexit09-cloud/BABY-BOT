const moment = require("moment-timezone");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// Random RGB emoji generator
function colorEmoji() {
  const colors = ["🔵", "🟣", "🟢", "🟠", "🔴", "🟡", "💠", "✨", "🌈"];
  return colors[Math.floor(Math.random() * colors.length)];
}

module.exports = {
  config: {
    name: "dashboard",
    aliases: ["dash", "status"],
    version: "6.0",
    author: "AYAN HOST",
    countDown: 3,
    role: 0,
    shortDescription: {
      en: "Full RGB dashboard with header image"
    },
    category: "System",
  },

  onStart: async function ({ api, event, threadsData, usersData }) {
    try {
      const prefix = global.GoatBot.config.prefix || "!";
      const uptime = process.uptime();
      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);
      const ping = Date.now() - event.timestamp;
      const time = moment().tz("Asia/Dhaka").format("DD/MM/YYYY | hh:mm:ss A");

      // Stats
      const totalUsers = await usersData.getAll().then(d => d.length).catch(() => "N/A");
      const totalThreads = await threadsData.getAll().then(d => d.length).catch(() => "N/A");
      const totalCommands = global.GoatBot ? global.GoatBot.commands.size : "N/A";

      // Emojis for RGB effect
      const e1 = colorEmoji(), e2 = colorEmoji(), e3 = colorEmoji();

      // Dashboard message
      const dashboard = `
${e1}━━━━━━━[ ✨ 𝗔𝗬𝗔𝗡 𝗛𝗢𝗦𝗧 𝗗𝗔𝗦𝗛𝗕𝗢𝗔𝗥𝗗 ✨ ]━━━━━━━${e1}

💠 𝗦𝗬𝗦𝗧𝗘𝗠 𝗦𝗧𝗔𝗧𝗨𝗦 💠
⏱️ 𝗨𝗣𝗧𝗜𝗠𝗘: ${hours}h ${minutes}m ${seconds}s
⚡ 𝗣𝗜𝗡𝗚: ${ping}ms
📅 𝗗𝗔𝗧𝗘 & 𝗧𝗜𝗠𝗘: ${time}

💻 𝗕𝗢𝗧 𝗜𝗡𝗙𝗢 💻
👑 𝗔𝗨𝗧𝗛𝗢𝗥: AYAN HOST
🧩 𝗣𝗥𝗘𝗙𝗜𝗫: ${prefix}
🚀 𝗩𝗘𝗥𝗦𝗜𝗢𝗡: 6.0
📂 𝗖𝗔𝗧𝗘𝗚𝗢𝗥𝗬: System

📊 𝗕𝗢𝗧 𝗦𝗧𝗔𝗧𝗦 📊
👥 𝗧𝗢𝗧𝗔𝗟 𝗨𝗦𝗘𝗥𝗦: ${totalUsers}
💬 𝗧𝗢𝗧𝗔𝗟 𝗚𝗥𝗢𝗨𝗣𝗦: ${totalThreads}
🧠 𝗧𝗢𝗧𝗔𝗟 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦: ${totalCommands}

🔥 𝗦𝗘𝗥𝗩𝗘𝗥 𝗦𝗧𝗔𝗕𝗟𝗘 & 𝗥𝗨𝗡𝗡𝗜𝗡𝗚 𝗣𝗘𝗥𝗙𝗘𝗖𝗧𝗟𝗬 🔥

${e3}━━━━━━━[ 💥 𝗔𝗬𝗔𝗡 𝗛𝗢𝗦𝗧 💥 ]━━━━━━━${e3}
`;

      // Header image (Logo)
      const imageUrl = "https://files.catbox.moe/r3tw4i.jpg"; // 👈 এখানে তোমার লোগো ইমেজের লিংক বসাও
      const imgPath = path.join(__dirname, "cache", "dashboard_logo.png");

      const getImage = (await axios.get(imageUrl, { responseType: "arraybuffer" })).data;
      await fs.outputFile(imgPath, Buffer.from(getImage, "binary"));

      return api.sendMessage(
        {
          body: dashboard,
          attachment: fs.createReadStream(imgPath)
        },
        event.threadID,
        () => fs.unlinkSync(imgPath),
        event.messageID
      );
    } catch (err) {
      return api.sendMessage("❌ Dashboard error: " + err.message, event.threadID);
    }
  }
};
