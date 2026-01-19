const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "owner",
    version: "2.0",
    author: "Tarek",
    shortDescription: "Display bot and owner information",
    longDescription: "Shows detailed info including bot name, prefix, and owner's personal information.",
    category: "Special",
    guide: {
      en: "{p}{n}",
    },
  },

  onStart: async function ({ api, event, args, message, usersData }) {
    const id = event.senderID;
    const userData = await usersData.get(id);
    const name = userData.name;
    const mention = [{ id, tag: name }];

    // 🛠 Convert Google Drive view link to direct download link
    const fileId = "1QQ4rcb5mnLytHKuavPxOjx0rF-YuOTaS";
    const directURL = `https://files.catbox.moe/moszoa.mp4`;

    // ⏬ Download the file temporarily
    const filePath = path.join(__dirname, "owner-video.mp4");
    const response = await axios({
      url: directURL,
      method: "GET",
      responseType: "stream"
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    const info = 
`━━━━━━━━━━━━━━━━
👋 𝗛𝗲𝗹𝗹𝗼, ${name}

📌 𝗕𝗢𝗧 𝗜𝗡𝗙𝗢
• 𝗡𝗮𝗺𝗲➝ — 𝚃𝙾𝙽𝚄 -✨
• 𝗣𝗿𝗲𝗳𝗶𝘅 ➝/

👤 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢
• 𝗡𝗮𝗺𝗲 ➝ A𝚔𝚊𝚜𝚑 𝙲𝚑𝚘𝚠𝚍𝚑𝚘𝚛𝚢 🦋
• 𝗚𝗲𝗻𝗱𝗲𝗿 ➝ 𝙼𝚊𝚕𝚎 ✨
• 𝗔𝗴𝗲 ➝ 19 🍓
• 𝗦𝘁𝗮𝘁𝘂𝘀 ➝ 𝚂𝚒𝚗𝚐𝚕𝚎 ☠️
• 𝗘𝗱𝘂𝗰𝗮𝘁𝗶𝗼𝗻 ➝ 𝙸𝚗𝚝𝚎𝚛 𝟸 𝚗𝚍 💦
• 𝗟𝗼𝗰𝗮𝘁𝗶𝗼𝗻 ➝ 𝙳𝚑𝚊𝚔𝚊 🌷
━━━━━━━━━━━━━━━━━`;

    message.reply({
      body: info,
      mentions: mention,
      attachment: fs.createReadStream(filePath)
    });
  }
};