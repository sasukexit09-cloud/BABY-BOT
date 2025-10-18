// readonlyFancyAnimated.js
module.exports = {
  config: {
    name: "readonly",
    aliases: ["ro", "lockchat"],
    description: "Toggle read-only mode with animated/fancy notifications in Messenger group",
    usage: "!readonly or !readonly unlock"
  },

  run: async ({ api, event, args }) => {
    try {
      if (!event.isGroup) return api.sendMessage("This command works only in groups.", event.threadID);

      // Get admin IDs
      const threadInfo = await api.getThreadInfo(event.threadID);
      const adminIDs = threadInfo.adminIDs.map(admin => admin.id);

      // Initialize global read-only tracker
      if (!global.readOnlyThreads) global.readOnlyThreads = {};
      const threadID = event.threadID;
      const cmd = args[0] ? args[0].toLowerCase() : "";

      if (cmd === "unlock") {
        global.readOnlyThreads[threadID] = false;
        return api.sendMessage("✅ Group is now unlocked. Everyone can send messages.", threadID);
      } else {
        global.readOnlyThreads[threadID] = true;
        api.sendMessage("🔒 Group is now in read-only mode. Only admins can send messages.", threadID);
      }

      // Listen for messages
      global.client.on("message", async (message) => {
        if (message.threadID === threadID && global.readOnlyThreads[threadID]) {
          if (!adminIDs.includes(message.senderID)) {
            try {
              // Delete the message
              await api.deleteMessage(message.messageID);

              // Send fancy animated notification (emojis + text effects)
              const fancyMsgs = [
                `❌ ${message.senderName}, আপনি মেসেজ পাঠাতে পারবেন না! ⚡`,
                `🚫 ${message.senderName}, গ্রুপ এখন read-only mode! ✨`,
                `💢 ${message.senderName}, শুধু অ্যাডমিনরা মেসেজ পাঠাতে পারবে! 🔒`
              ];
              
              // Randomly pick one fancy notification
              const notif = fancyMsgs[Math.floor(Math.random() * fancyMsgs.length)];
              api.sendMessage(notif, threadID);

            } catch (err) {
              console.log("Error handling message:", err);
            }
          }
        }
      });

    } catch (err) {
      console.log(err);
      api.sendMessage("⚠️ Error toggling read-only mode.", event.threadID);
    }
  }
};
