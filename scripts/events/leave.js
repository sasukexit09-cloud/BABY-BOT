const { getTime } = global.utils;

function toBold(text) {
  const normal = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bold =   "𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭" +
                 "𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇" +
                 "𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵";

  return text
    .split("")
    .map(c => {
      const index = normal.indexOf(c);
      return index > -1 ? bold[index] : c;
    })
    .join("");
}

module.exports = {
  config: {
    name: "leave",
    version: "1.1",
    author: "Tarek",
    category: "events"
  },

  langs: {
    en: {
      session1: "morning",
      session2: "noon",
      session3: "afternoon",
      session4: "evening",
      leaveMessage: "💔 {userName} has left the group {boxName}...\nWe'll miss you 😢\nHave a good {session}!\n📅 Date: {date} 🕓 Time: {time}",
      kickMessage: "⚠️ {userName} was removed from the group {boxName}!\nPlease follow the rules next time.\n📅 Date: {date} 🕓 Time: {time}"
    }
  },

  onStart: async ({ threadsData, message, event, api, getLang }) => {
    const hours = parseInt(getTime("HH"));
    const date = getTime("DD-MM-YYYY");
    const time = getTime("HH:mm:ss");
    const { threadID, logMessageData } = event;
    const threadData = await threadsData.get(threadID);

    if (threadData.settings.sendLeaveMessage == false) return;

    let userName = "";

    const leaveVideoUrl = "https://drive.google.com/uc?export=download&id=1bIIzwcYYM1LTBaixG4pIGmf98dSVHuAA";
    const kickVideoUrl = "https://drive.google.com/uc?export=download&id=1X-jN-4tvPhRsbZOPKSe85vlnnHAIZHhb";

    let session;
    if (hours <= 10) session = getLang("session1");
    else if (hours <= 12) session = getLang("session2");
    else if (hours <= 18) session = getLang("session3");
    else session = getLang("session4");

    // ========== Leave Event ==========
    if (event.logMessageType == "log:unsubscribe") {
      const leftUserId = logMessageData.leftParticipantFbId;
      const userInfo = await api.getUserInfo(leftUserId);
      userName = userInfo[leftUserId]?.name || "Someone";

      let { leaveMessage = getLang("leaveMessage") } = threadData.data;
      leaveMessage = leaveMessage
        .replace(/\{userName\}/g, toBold(userName))
        .replace(/\{boxName\}|\{threadName\}/g, toBold(threadData.threadName))
        .replace(/\{session\}/g, toBold(session))
        .replace(/\{date\}/g, date)
        .replace(/\{time\}/g, time);

      await message.send(leaveMessage);

      return message.send({
        body: "",
        attachment: await global.utils.getStreamFromURL(leaveVideoUrl)
      });
    }

    // ========== Kick Event ==========
    if (event.logMessageType == "log:admin_removed") {
      const kickedUserId = logMessageData.userFbId;
      const userInfo = await api.getUserInfo(kickedUserId);
      userName = userInfo[kickedUserId]?.name || "Someone";

      let { kickMessage = getLang("kickMessage") } = threadData.data;
      kickMessage = kickMessage
        .replace(/\{userName\}/g, toBold(userName))
        .replace(/\{boxName\}|\{threadName\}/g, toBold(threadData.threadName))
        .replace(/\{date\}/g, date)
        .replace(/\{time\}/g, time);

      await message.send(kickMessage);

      return message.send({
        body: "",
        attachment: await global.utils.getStreamFromURL(kickVideoUrl)
      });
    }
  }
};
