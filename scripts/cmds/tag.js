// mention_full.js
module.exports = {
  config: {
    name: "tag",
    aliases: ["tag","mt"],
    version: "1.2",
    author: "Maya",
    role: 0,
    shortDescription: "Mention user by reply (ID) or by name (highlight only)"
  },

  run: async function({ api, event, args }) {
    try {
      const { threadID, messageID } = event;

      // Reply check
      if (event.messageReply && event.messageReply.senderID) {
        const targetID = event.messageReply.senderID;
        const targetName = event.messageReply.senderName || "User";
        const extraText = args.length ? args.join(" ") : "";

        const mentionText = `@${targetName}`;
        const body = extraText ? `${mentionText} ${extraText}` : mentionText;

        const mentions = [{
          id: targetID,
          tag: mentionText,
          fromIndex: 0
        }];

        return api.sendMessage({ body, mentions }, threadID, messageID);
      }

      // যদি reply না হয়, তবে direct name ব্যবহার
      if (!args || args.length === 0) {
        return api.sendMessage("ব্যবহার: !mention <Name> <optional message> বা reply করে !mention", threadID, messageID);
      }

      const targetName = args[0];
      const extraText = args.slice(1).join(" ");
      const mentionText = `@${targetName}`;
      const body = extraText ? `${mentionText} ${extraText}` : mentionText;

      return api.sendMessage(body, threadID, messageID);

    } catch (err) {
      console.error(err);
      return api.sendMessage("কিছু একটা এরর হয়েছে। আবার চেষ্টা করুন।", event.threadID, event.messageID);
    }
  }
};
