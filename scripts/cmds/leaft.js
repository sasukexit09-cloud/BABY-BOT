const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "left",
    aliases: ["leave"],
    version: "1.1",
    author: "Sandy + Asif Edit",
    countDown: 5,
    role: 0,
    shortDescription: "Make the bot leave a group",
    longDescription: "Allows authorized users to make the bot leave any group (own or given thread ID)",
    category: "admin",
    guide: {
      en: "{pn} [threadID (optional)]"
    }
  },

  onStart: async function ({ api, event, args }) {
    const permission = [
      "61582522732634",
      "",
      "",
      ""
    ];

    // Check permission
    if (!permission.includes(event.senderID)) {
      return api.sendMessage(
        "- কানকির ছেলে, আমাকে বের করার তুই কে..!😤",
        event.threadID,
        event.messageID
      );
    }

    // Determine which group to leave
    let threadID;
    if (args[0]) {
      // যদি argument দেওয়া হয় (thread ID)
      threadID = args[0].trim();
    } else {
      // না দিলে current গ্রুপ
      threadID = event.threadID;
    }

    // Try to leave the group
    try {
      await api.sendMessage(
        "- তোর হেডার গ্রুপ এ না থাকলে, আমার বাল ছিরা গেলো..!🐸",
        threadID
      );
      await api.removeUserFromGroup(api.getCurrentUserID(), threadID);
    } catch (err) {
      console.error(err);
      return api.sendMessage(
        "⚠️ error",
        event.threadID
      );
    }
  }
};
