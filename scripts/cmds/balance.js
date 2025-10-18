const { config } = global.GoatBot;
const { createCanvas, loadImage } = require("canvas");
const GIFEncoder = require("gifencoder");
const fs = require("fs");
const path = require("path");

module.exports = {
    config: {
        name: "balance",
        aliases: ["bal", "money"],
        version: "2.3.0",
        author: "Nazrul",
        countDown: 1,
        role: 0,
        description: "Super Animated Dashboard Balance GIF with profile pic",
        category: "economy"
    },

    onStart: async function({ message, usersData, event, args, api }) {
        const senderID = event.senderID;
        const targetUID = args[0] || (event.messageReply ? event.messageReply.senderID : senderID);
        const userData = await usersData.get(targetUID) || {};
        const username = userData.name || "Unknown";
        const balance = Number(userData.money || 0);
        const avatarURL = userData.avatar || null; // যদি profile pic থাকে

        const width = 720;
        const height = 300;
        const frames = 70;

        const encoder = new GIFEncoder(width, height);
        encoder.start();
        encoder.setRepeat(0);
        encoder.setDelay(50);
        encoder.setQuality(10);

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");

        let avatarImage = null;
        if (avatarURL) {
            try {
                avatarImage = await loadImage(avatarURL);
            } catch (e) {
                avatarImage = null;
            }
        }

        for (let i = 0; i < frames; i++) {
            const hueBg = (i*4)%360;
            const hueText = (i*10)%360;
            const scale = 1 + 0.05 * Math.sin(i*0.5);

            // Background gradient
            const gradient = ctx.createLinearGradient(0,0,width,height);
            gradient.addColorStop(0, `hsl(${hueBg},100%,25%)`);
            gradient.addColorStop(0.5, `hsl(${(hueBg+60)%360},100%,30%)`);
            gradient.addColorStop(1, `hsl(${(hueBg+180)%360},100%,35%)`);
            ctx.fillStyle = gradient;
            ctx.fillRect(0,0,width,height);

            // Profile pic circle
            if (avatarImage) {
                ctx.save();
                const avatarSize = 80;
                ctx.beginPath();
                ctx.arc(100, height/2, avatarSize/2, 0, Math.PI*2);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(avatarImage, 60, height/2-40, avatarSize, avatarSize);
                ctx.restore();
            }

            // Glowing username
            ctx.save();
            ctx.translate(width/2, height/3);
            ctx.scale(scale, scale);
            ctx.font = "bold 44px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.shadowColor = `hsl(${hueText},100%,50%)`;
            ctx.shadowBlur = 35;
            ctx.fillStyle = `hsl(${hueText},100%,50%)`;
            ctx.fillText(username, 0, 0);
            ctx.restore();

            // Glowing balance
            ctx.save();
            const displayedBalance = Math.floor((balance/frames)*i);
            ctx.translate(width/2, (height/3)*2);
            ctx.scale(scale, scale);
            ctx.font = "bold 40px Arial";
            ctx.shadowColor = `hsl(${(hueText+90)%360},100%,50%)`;
            ctx.shadowBlur = 30;
            ctx.fillStyle = `hsl(${(hueText+90)%360},100%,50%)`;
            ctx.fillText(`Balance: $${displayedBalance}`, 0, 0);
            ctx.restore();

            // Mini balance chart
            ctx.save();
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let x=0; x<50; x++){
                const y = Math.sin((x+i)/10) * 15 + 50;
                ctx.lineTo(500 + x*2, height-60 - y);
            }
            ctx.stroke();
            ctx.restore();

            // Sparkle effect
            for(let s=0;s<12;s++){
                const x = Math.random()*width;
                const y = Math.random()*height;
                ctx.fillStyle = `hsl(${Math.random()*360},100%,85%)`;
                ctx.fillRect(x,y,2,2);
            }

            encoder.addFrame(ctx);
        }

        encoder.finish();
        const buffer = encoder.out.getData();
        const gifPath = `./cache/balance_${targetUID}.gif`;
        fs.writeFileSync(gifPath, buffer);

        return api.sendMessage({ attachment: fs.createReadStream(gifPath) }, event.threadID, () => fs.unlinkSync(gifPath));
    }
};
