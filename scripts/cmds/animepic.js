const axios = require("axios");

module.exports = {
  config: {
    name: "animepic",
    aliases: ["setanime", "animepic"],
    version: "1.0",
    author: "ChatGPT",
    role: 0,
    shortDescription: "Get a random anime profile picture",
    longDescription: "Send a random anime picture (boy/girl) which can be used as a profile picture.",
    category: "image",
    guide: {
      en: "{pn} [girl|boy] - Get anime picture"
    }
  },

  onStart: async function ({ message, args }) {
    const type = args[0]?.toLowerCase();
    let endpoint;

    if (type === "girl") {
      endpoint = "https://anime-pics-api.vercel.app/girl";
    } else if (type === "boy") {
      endpoint = "https://anime-pics-api.vercel.app/boy";
    } else {
      // Random by default
      endpoint = "https://anime-pics-api.vercel.app/random";
    }

    try {
      const res = await axios.get(endpoint);
      const imageURL = res.data?.url;

      if (!imageURL) {
        return message.reply("❌ Couldn't fetch anime image. Please try again.");
      }

      const imageStream = await global.utils.getStreamFromURL(imageURL, "anime-pic.jpg");

      await message.reply({
        body: `✅ Here's your anime picture! (${type || "random"})`,
        attachment: imageStream
      });

    } catch (err) {
      console.error("AnimePic Error:", err.message);
      message.reply("❌ Failed to load anime picture.");
    }
  }
};
