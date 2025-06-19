const axios = require('axios');

const config = {
  name: "elite",
  version: "2.0.0",
  author: "nYx",
  credits: "nYx",
  description: "AI-powered chat using elite",
  category: "AI",
  commandCategory: "elite AI",
  usePrefix: false,
  prefix: true,
  dependencies: {
    "axios": "",
  },
};

const onStart = async ({ message, event, args, commandName }) => {
  const input = args.join(' ');
  await handleResponse({ message, event, input, commandName });
};

const onReply = async ({ message, event, Reply, args, commandName }) => {
  if (event.senderID !== Reply.author) return;
  
  const input = args.join(' ');
  await handleResponse({ message, event, input, commandName });
};

async function handleResponse({ message, event, input, commandName }) {
  try {
    const { data } = await axios.get(
      `https://www.noobz-api.rf.gd/api/exxa?query=${input}`
    );
    
    return message.reply(data.data, (err, info) => {
      if (!err) {
        // GoatBot reply
        global.GoatBot.onReply.set(info.messageID, {
          commandName,
          messageID: info.messageID,
          author: event.senderID
        });
        
        // Mirai Bot 
        global.client.handleReply.push({
          name: config.name,
          type: "reply",
          messageID: info.messageID,
          author: event.senderID
        });
      }
    });
  } catch (e) {
    message.reply(`Error: ${e.message}`);
  }
}

module.exports = {
  config,
  onStart,
  onReply,
  run: onStart,
  handleReply: onReply,
};
