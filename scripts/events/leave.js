const axios = require("axios");

module.exports = {
  config: {
    name: "leave",
    version: "1.7",
    author: "Tarek",
    category: "events"
  },

  langs: {
    bn: {
      session1: "সকাল",
      session2: "দুপুর",
      session3: "বিকেল",
      session4: "সন্ধ্যা",
      leaveMessage: "💔 {userName} {boxName} থেকে চলে গিয়েছে...\nআমরা তোমাকে মিস করবো 😢\nশুভ {session}!\n🕒 সময়: {time}",
      kickMessage: "⚠️ {userName} কে {boxName} থেকে সরানো হয়েছে!\nদয়া করে নিয়ম মেনে চলুন।\n🕒 সময়: {time}"
    }
  },

  onStart: async ({ threadsData, message, event, api, getLang }) => {
    const now = new Date();
    const hours = now.getHours();

    const getFormattedTime = () => {
      const dateOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        timeZone: 'Asia/Dhaka'
      };
      return now.toLocaleString('bn-BD', dateOptions);
    };

    const timeString = getFormattedTime();

    const { threadID, logMessageData, logMessageType } = event;
    const threadData = await threadsData.get(threadID);
    if (threadData.settings?.sendLeaveMessage === false) return;

    // ✅ তোমার ভিডিও লিংকগুলো
    const leaveVideoUrl = "https://cdn.streamable.com/video/mp4/blytwg.mp4";
    const kickVideoUrl = "https://cdn.streamable.com/video/mp4/c3t6vy.mp4"; // <-- এখানে তোমার kick ভিডিও লিংক বসাও

    // ================== Leave ==================
    if (logMessageType === "log:unsubscribe") {
      const leftUserId = logMessageData.leftParticipantFbId;
      const userInfo = await api.getUserInfo(leftUserId);
      const userName = userInfo[leftUserId]?.name || "Someone";

      const session =
        hours <= 10 ? getLang("session1") :
        hours <= 12 ? getLang("session2") :
        hours <= 18 ? getLang("session3") :
        getLang("session4");

      let leaveMessage = getLang("leaveMessage")
        .replace(/\{userName\}/g, userName)
        .replace(/\{boxName\}|\{threadName\}/g, threadData.threadName)
        .replace(/\{session\}/g, session)
        .replace(/\{time\}/g, getFormattedTime());

      try {
        const response = await axios.get(leaveVideoUrl, {
          responseType: "stream"
        });

        return message.send({
          body: leaveMessage,
          attachment: response.data
        });
      } catch (err) {
        console.error("Leave ভিডিও পাঠাতে সমস্যা:", err.message);
        return message.send("❌ Leave ভিডিও পাঠানো সম্ভব হয়নি।");
      }
    }

    // ================== Kick ==================
    if (logMessageType === "log:admin_removed") {
      const kickedUserId = logMessageData.userFbId;
      const userInfo = await api.getUserInfo(kickedUserId);
      const userName = userInfo[kickedUserId]?.name || "Someone";

      let kickMessage = getLang("kickMessage")
        .replace(/\{userName\}/g, userName)
        .replace(/\{boxName\}|\{threadName\}/g, threadData.threadName)
        .replace(/\{time\}/g, getFormattedTime());

      try {
        const response = await axios.get(kickVideoUrl, {
          responseType: "stream"
        });

        return message.send({
          body: kickMessage,
          attachment: response.data
        });
      } catch (err) {
        console.error("Kick ভিডিও পাঠাতে সমস্যা:", err.message);
        return message.send("❌ Kick ভিডিও পাঠানো সম্ভব হয়নি।");
      }
    }
  }
};
