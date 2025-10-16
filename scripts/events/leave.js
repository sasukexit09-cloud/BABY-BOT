const { getTime } = global.utils;

module.exports = {
  config: {
    name: "leave",
    version: "1.3",
    author: "Tarek + Maya",
    category: "events"
  },

  langs: {
    en: {
      session1: "𝗺𝗼𝗿𝗻𝗶𝗻𝗴",
      session2: "𝗻𝗼𝗼𝗻",
      session3: "𝗮𝗳𝘁𝗲𝗿𝗻𝗼𝗼𝗻",
      session4: "𝗲𝘃𝗲𝗻𝗶𝗻𝗴",
      leaveMessage: "💔 {userName} has left {boxName}...\nWe’ll miss you 😢\nHave a good {session}!",
      kickMessage: "⚠️ {userName} has been removed from {boxName}!\nPlease follow the rules next time."
    }
  },

  onStart: async ({ threadsData, message, event, api, getLang }) => {
    const hours = getTime("HH");
    const { threadID, logMessageData, logMessageType } = event;
    const threadData = await threadsData.get(threadID);

    // যদি leave/kick মেসেজ বন্ধ থাকে
    if (threadData.settings.sendLeaveMessage == false) return;

    // 🎬 দুটি ভিডিও URL (ইচ্ছা করলে আলাদা দিতে পারো)
    const leaveVideoUrl = "https://files.catbox.moe/82ymr2.mp4";
    const kickVideoUrl = "https://files.catbox.moe/82ymr2.mp4";

    // ===============================
    // 💔 কেউ নিজে গ্রুপ ছাড়লে
    // ===============================
    if (logMessageType == "log:unsubscribe") {
      const leftUserId = logMessageData.leftParticipantFbId;
      const userInfo = await api.getUserInfo(leftUserId);
      const userName = userInfo[leftUserId]?.name || "Someone";

      let { leaveMessage = getLang("leaveMessage") } = threadData.data;
      leaveMessage = leaveMessage
        .replace(/\{userName\}/g, userName)
        .replace(/\{boxName\}|\{threadName\}/g, threadData.threadName)
        .replace(
          /\{session\}/g,
          hours <= 10
            ? getLang("session1")
            : hours <= 12
            ? getLang("session2")
            : hours <= 18
            ? getLang("session3")
            : getLang("session4")
        );

      // ভিডিওসহ মেসেজ পাঠানো
      return message.send({
        body: leaveMessage,
        attachment: await global.utils.getStreamFromURL(leaveVideoUrl)
      });
    }

    // ===============================
    // ⚠️ কাউকে কিক করলে
    // ===============================
    if (logMessageType == "log:admin_removed") {
      const kickedUserId = logMessageData.userFbId;
      const userInfo = await api.getUserInfo(kickedUserId);
      const userName = userInfo[kickedUserId]?.name || "Someone";

      let { kickMessage = getLang("kickMessage") } = threadData.data;
      kickMessage = kickMessage
        .replace(/\{userName\}/g, userName)
        .replace(/\{boxName\}|\{threadName\}/g, threadData.threadName);

      // ভিডিওসহ মেসেজ পাঠানো
      return message.send({
        body: kickMessage,
        attachment: await global.utils.getStreamFromURL(kickVideoUrl)
      });
    }
  }
};
