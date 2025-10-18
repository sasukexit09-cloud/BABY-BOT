const { config } = global.GoatBot;
const { createCanvas } = require("canvas");
const GIFEncoder = require("gifencoder");

module.exports = {
    config: {
        name: "balance",
        aliases: ["bal", "money"],
        version: "2.1.0",
        author: "Nazrul",
        countDown: 1,
        role: 0,
        description: "View, transfer, request, or add/delete money",
        category: "economy",
        guide: {
            en: `
{pn}: view your balance
{pn} <@tag>: view another user's balance
{pn} transfer <@tag>/<UID>/<reply> <amount>: transfer money
{pn} request <amount>: request money from the admin
{pn} add <@tag>/<UID>/<reply> <amount>: admin adds money
{pn} delete <@tag>/<UID>/<reply> <amount>: admin deletes money`
        }
    },

    onStart: async function({ message, usersData, event, args, api }) {
        const senderID = event.senderID;
        const allowedUIDs = Array.isArray(config.adminBot) ? [...config.adminBot] : [config.adminBot];

        const formatMoney = (num) => {
            const units = ["", "K", "M", "B", "T"];
            let unit = 0;
            let number = Number(num);
            while (number >= 1000 && unit < units.length - 1) {
                number /= 1000;
                unit++;
            }
            return `${number.toFixed(2)}${units[unit]}`;
        };

        const isValidAmount = (value) => !isNaN(Number(value)) && Number(value) > 0;
        const getTargetUID = () => {
            if (event.messageReply) return event.messageReply.senderID;
            if (Object.keys(event.mentions).length > 0) return Object.keys(event.mentions)[0];
            if (!isNaN(args[1])) return args[1];
            return null;
        };
        const getAmount = () => args[args.length - 1];

        // ----- HELP -----
        if (args[0] === "help") {
            return message.reply(`
1. ${config.prefix} balance: View your balance.
2. ${config.prefix} balance <@tag>: View another user's balance.
3. ${config.prefix} balance transfer <UID> <amount>: Transfer money.
4. ${config.prefix} balance request <amount>: Request money from admin.
5. ${config.prefix} balance add <UID> <amount>: Admin adds money.
6. ${config.prefix} balance delete <UID> <amount>: Admin deletes money.
`);
        }

        // ----- ADMIN ADD/DELETE -----
        if (["add", "delete"].includes(args[0])) {
            if (!allowedUIDs.includes(senderID)) return message.reply("❌ You don't have permission.");
            const targetUID = getTargetUID();
            const amount = getAmount();
            if (!targetUID) return message.reply("❌ Could not identify the user.");
            if (!isValidAmount(amount)) return message.reply("❌ Enter a valid positive amount.");

            const userData = await usersData.get(targetUID) || { money: "0", name: "Unknown User" };
            let newBalance = Number(userData.money);
            if (args[0] === "add") newBalance += Number(amount);
            else {
                if (newBalance < Number(amount)) return message.reply("❌ Not enough money to delete.");
                newBalance -= Number(amount);
            }
            await usersData.set(targetUID, { ...userData, money: newBalance.toString() });

            return message.reply(`✅ ${args[0] === "add" ? "Added" : "Deleted"} ${formatMoney(amount)}$ ${args[0] === "add" ? "to" : "from"} ${userData.name} (UID: ${targetUID}).`);
        }

        // ----- TRANSFER -----
        if (args[0] === "transfer") {
            const targetUID = getTargetUID();
            const amount = getAmount();
            if (!targetUID) return message.reply("❌ Could not identify the user.");
            if (targetUID === senderID) return message.reply("❌ Cannot transfer to yourself.");
            if (!isValidAmount(amount)) return message.reply("❌ Enter a valid positive amount.");

            const senderData = await usersData.get(senderID) || { money: "0" };
            const recipientData = await usersData.get(targetUID) || { money: "0", name: "Unknown User" };
            if (Number(senderData.money) < Number(amount)) return message.reply("❌ Not enough money.");

            await usersData.set(senderID, { ...senderData, money: (Number(senderData.money) - Number(amount)).toString() });
            await usersData.set(targetUID, { ...recipientData, money: (Number(recipientData.money) + Number(amount)).toString() });

            return message.reply(`✅ Transferred ${formatMoney(amount)}$ to ${recipientData.name} (UID: ${targetUID}).`);
        }

        // ----- REQUEST -----
        if (args[0] === "request") {
            const amount = args[1];
            if (!isValidAmount(amount)) return message.reply("❌ Enter a valid positive amount.");

            const data = await usersData.get(senderID);
            const name = data.name || "Darling";
            const adminIDs = ["100049220893428"];
            const threadIDs = ["9191391594224159", "7272501799469344"];
            const requestMessage = `📢 User ${name} (${senderID}) requested ${formatMoney(amount)}$`;

            for (const adminID of adminIDs) api.sendMessage(requestMessage, adminID);
            for (const threadID of threadIDs) api.sendMessage(requestMessage, threadID);

            return message.reply(`✅ Request for ${formatMoney(amount)}$ sent to admins.`);
        }

        // ----- VIEW BALANCE -----
        const targetUID = getTargetUID() || senderID;
        const userData = await usersData.get(targetUID) || { money: "0", name: "Unknown User" };
        const userName = userData.name || "Unknown User";
        const userMoney = Number(userData.money);

        // ----- CREATE FLASHY GLOWING RAINBOW GIF -----
        const width = 450, height = 180;
        const encoder = new GIFEncoder(width, height);
        encoder.start();
        encoder.setRepeat(0);
        encoder.setDelay(60);
        encoder.setQuality(10);

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");

        const rainbowColors = ["#FF3C3C","#FF8C3C","#FFE93C","#3CFF3C","#3CFFFB","#3C3CFF","#B63CFF"];
        for (let i = 0; i < 20; i++) {
            ctx.clearRect(0,0,width,height);
            ctx.fillStyle = "#111"; // dark background
            ctx.fillRect(0,0,width,height);

            // glowing shadow effect
            ctx.shadowColor = rainbowColors[i % rainbowColors.length];
            ctx.shadowBlur = 20;

            ctx.font = "bold 32px Sans";
            ctx.fillStyle = rainbowColors[(i+3) % rainbowColors.length];
            ctx.fillText(`${userName}'s Balance`, 40, 60);

            ctx.font = "bold 48px Sans";
            ctx.fillStyle = rainbowColors[(i+5) % rainbowColors.length];
            ctx.fillText(`${formatMoney(userMoney)}$`, 40, 130);

            encoder.addFrame(ctx);
        }
        encoder.finish();

        const buffer = encoder.out.getData();
        return api.sendMessage({ attachment: buffer }, event.threadID);
    }
};
