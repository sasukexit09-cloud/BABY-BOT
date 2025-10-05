const axios = require("axios");

module.exports = {
  config: {
    name: "upscale",
    aliases: ["4k", "2k", "hd", "anime", "imgup", "aiup", "enhance", "upimg", "upres"],
    version: "1.3",
    role: 0,
    author: "Fahim_Noob + Modified by ChatGPT",
    countDown: 5,
    longDescription: "Upscale an image to 4K / 2K / HD / Anime style.",
    category: "image",
    guide: {
      en: "{pn} [4k | 2k | hd | anime] → Reply to an image to upscale."
    }
  },

  onStart: async function ({ message, event, args }) {
    const reply = event.messageReply;

    if (!reply || !reply.attachments || reply.attachments.length === 0) {
      return message.reply("❌ Please reply to an image to upscale.");
    }

    const attachment = reply.attachments[0];
    if (attachment.type !== "photo") {
      return message.reply("⚠️ Only photo/image attachments are supported.");
    }

    const validTypes = ["4k", "2k", "hd", "anime"];
    const upscaleType = (args[0] || "4k").toLowerCase();

    if (!validTypes.includes(upscaleType)) {
      return message.reply("❌ Invalid type. Please use one of: 4k, 2k, hd, anime");
    }

    const imageUrl = encodeURIComponent(attachment.url);
    const apiUrl = `https://smfahim.xyz/${upscaleType}?url=${imageUrl}`;

    try {
      const waitMsg = await message.reply(`🔄 Upscaling to **${upscaleType.toUpperCase()}**... Please wait.`);

      const res = await axios.get(apiUrl);

      if (!res.data || !res.data.image) {
        return message.reply("❌ API did not return a valid image.");
      }

      const imageStream = await global.utils.getStreamFromURL(res.data.image, `${upscaleType}-upscaled.png`);

      await message.reply({
        body: `✅ Here's your ${upscaleType.toUpperCase()} upscaled image:`,
        attachment: imageStream
      });

      if (waitMsg?.messageID) {
        message.unsend(waitMsg.messageID);
      }

    } catch (error) {
      console.error("Upscale Error:", error);
      message.reply("❌ Failed to upscale the image. Try again later.");
    }
  }
};
