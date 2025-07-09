module.exports = {
config: {
name: "farhan",
version: "1.0",
author: "Farhan",
countDown: 5,
role: 0,
shortDescription: "no prefix",
longDescription: "no prefix",
category: "no prefix",
},

onStart: async function(){}, 
onChat: async function({ event, message, getLang }) {
if (event.body && event.body.toLowerCase() === "farhan") {
return message.reply({
body: " ╭────────────◊\n├‣ 𝐎𝐰𝐧𝐞𝐫 𝐈𝐧𝐟𝐨𝐫𝐦𝐚𝐭𝐢𝐨𝐧  \n├───────────◊ \n├‣ 𝐍𝐚𝐦𝐞 : Fᴀʀʜᴀɴ ʜᴀsᴀɴ ᴊɪʙᴏɴ  \n├‣ 𝐇𝐨𝐦𝐞 : Sɪʀᴀᴊɢᴀɴᴊ \n├‣ 𝐂𝐥𝐚𝐬𝐬 : Ssᴄ ᴅᴏɴᴇ \n╰───────────◊  ",
attachment: await global.utils.getStreamFromURL("https://files.catbox.moe/87d2eo.mp4")
});
}
}
}
