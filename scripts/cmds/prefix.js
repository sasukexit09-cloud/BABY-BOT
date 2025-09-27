const fs = require("fs-extra");
const { utils } = global;

module.exports = {
  config: {
    name: "prefix",
    version: "1.5",
    author: "NTkhang || Kari Gori By Eren",
    countDown: 5,
    role: 0,
    description: "Change the bot prefix in your chat box or globally (admin only)",
    category: "⚙️ Configuration",
    guide: {
      en:
        "┌─『 Prefix Settings 』─┐\n"
      + "│\n"
      + "│ 🔹 {pn} <prefix>\n"
      + "│     Set prefix for this chat\n"
      + "│     Example: {pn} $\n"
      + "│\n"
      + "│ 🔹 {pn} <prefix> -g\n"
      + "│     Set global prefix (Admin only)\n"
      + "│     Example: {pn} $ -g\n"
      + "│\n"
      + "│ ♻️ {pn} reset\n"
      + "│     Reset to default prefix\n"
      + "│\n"
      + "└──────────────────────┘"
    }
  },

  langs: {
    en: {
      reset:
        "┌─『 Prefix Reset 』─┐\n"
      + `│ ✅ Reset to default: %1\n`
      + "└────────────────────┘",
      onlyAdmin:
        "┌─『 Permission Denied 』─┐\n"
      + "│ ⛔ Only bot admins can change global prefix!\n"
      + "└──────────────────────────┘",
      confirmGlobal:
        "┌─『 Global Prefix Change 』─┐\n"
      + "│ ⚙️ React to confirm global prefix update.\n"
      + "└────────────────────────────┘",
      confirmThisThread:
        "┌─『 Chat Prefix Change 』─┐\n"
      + "│ ⚙️ React to confirm this chat's prefix update.\n"
      + "└──────────────────────────┘",
      successGlobal:
        "┌─『 Prefix Updated 』─┐\n"
      + `│ ✅ Global prefix: %1\n`
      + "└─────────────────────┘",
      successThisThread:
        "┌─『 Prefix Updated 』─┐\n"
      + `│ ✅ Chat prefix: %1\n`
      + "└─────────────────────┘",
      myPrefix:
        "┌─『 Current Prefix 』─┐\n"
      + `│ 🌍 Global: %1\n`
      + `│ 💬 This Chat: %2\n`
      + "│\n"
      + `│ ➤ Type: ${2}help\n`
      + "└─────────────────────┘"
    }
  },

  onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
    if (!args[0]) return message.SyntaxError();

    if (args[0] === "reset") {
      await threadsData.set(event.threadID, null, "data.prefix");
      return message.reply(getLang("reset", global.GoatBot.config.prefix));
    }

    const newPrefix = args[0];
    const formSet = {
      commandName,
      author: event.senderID,
      newPrefix,
      setGlobal: args[1] === "-g"
    };

    if (formSet.setGlobal && role < 2) {
      return message.reply(getLang("onlyAdmin"));
    }

    const confirmMessage = formSet.setGlobal ? getLang("confirmGlobal") : getLang("confirmThisThread");
    return message.reply(confirmMessage, (err, info) => {
      formSet.messageID = info.messageID;
      global.GoatBot.onReaction.set(info.messageID, formSet);
    });
  },

  onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {
    const { author, newPrefix, setGlobal } = Reaction;
    if (event.userID !== author) return;

    if (setGlobal) {
      global.GoatBot.config.prefix = newPrefix;
      fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
      return message.reply(getLang("successGlobal", newPrefix));
    }

    await threadsData.set(event.threadID, newPrefix, "data.prefix");
    return message.reply(getLang("successThisThread", newPrefix));
  },

  onChat: async function ({ event, message, threadsData }) {
    const globalPrefix = global.GoatBot.config.prefix;
    const threadPrefix = await threadsData.get(event.threadID, "data.prefix") || globalPrefix;

    if (event.body && event.body.toLowerCase() === "prefix") {
      return message.reply({
        body:
          "╔══『 𝐏𝐑𝐄𝐅𝐈𝐗 』══╗\n"
        + `║ 🌍 System : ${globalPrefix}\n`
        + `║ 💬 Chatbox : ${threadPrefix}\n`
        + `║ ➤ ${threadPrefix}help to see all available cmds 🥵\n`
        + "╚═══════════════╝",
        attachment: await utils.getStreamFromURL("https://scontent.xx.fbcdn.net/v/t1.15752-9/552116003_1174574971168444_4024314403252670553_n.jpg?stp=dst-jpg_s480x480_tt6&_nc_cat=108&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeETpSur0t78jIGoDJLUmyxaVOLp22WztBxU4unbZbO0HJIXynToXIFOy6AyfMj2OaYvLihQp3BRYNvmW3GoaU_n&_nc_ohc=WAkcDv1FB5IQ7kNvwEcxCnF&_nc_oc=AdkDH_eORETvwhQchPta63NLT9weLMxPnBP9eqNxYIKcNVHVxUQW8TitQBDGDkrX7HE&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.xx&oh=03_Q7cD3QGb7ZBnIyAxH8K_NIIR4uZph2fIYqrt5A-mJ_A1Q9oqcQ&oe=68FEC5AE")
      });
    }
  }
};
