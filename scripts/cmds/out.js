const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "Out",
    aliases: ["l"],
    version: "2.1",
    author: "Sandy + ChatGPT",
    countDown: 5,
    role: 2,
    shortDescription: "Bot will leave group after sending file (owner only)",
    longDescription: "",
    category: "admin",
    guide: {
      vi: "{pn} [tid,blank]",
      en: "{pn} [tid,blank]"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const ownerIDs = ["61573375301770"]; // ⬅️ এখানে তোমার Facebook UID বসাও

    if (!ownerIDs.includes(event.senderID)) {
      return message.reply("❌ এই কমান্ডটি শুধুমাত্র বট মালিক ব্যবহার করতে পারে!");
    }

    let threadID = args.length === 0 ? event.threadID : parseInt(args.join(" "));

    const fileUrl = "https://drive.google.com/uc?export=download&id=1X-jN-4tvPhRsbZOPKSe85vlnnHAIZHhb";
    const filePath = path.join(__dirname, "drive_file.mp3"); // ফাইল টাইপ অনুযায়ী বদলাও

    try {
      const response = await axios({
        method: "GET",
        url: fileUrl,
        responseType: "stream"
      });

      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      writer.on("finish", () => {
        api.sendMessage({
          body: "𝗔𝗬𝗔𝗡 BOT LEFT THE GROUP:\n》Ami toder sukh dewar jonno Ashchilam tora etar joggo na.\n\n➤𝗕𝗘𝗬 𝗟𝗘𝗦 𝗡𝗔𝗭𝗘𝗦",
          attachment: fs.createReadStream(filePath)
        }, threadID, () => {
          fs.unlinkSync(filePath); // ফাইল মুছে ফেলো
          api.removeUserFromGroup(api.getCurrentUserID(), threadID); // গ্রুপ ছাড়ো
        });
      });

      writer.on("error", (err) => {
        console.error("File download error:", err);
        message.reply("❌ ফাইল ডাউনলোডে সমস্যা হয়েছে!");
      });

    } catch (error) {
      console.error("Error:", error);
      message.reply("❌ কিছু একটা ভুল হয়েছে!");
    }
  }
};
