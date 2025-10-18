const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");
const GIFEncoder = require("gifencoder");

module.exports = {
  config: {
    name: "owner3",
    version: "6.0",
    author: "Asif x Maya",
    shortDescription: "All-in-one animated galaxy GIF owner card",
    category: "ℹ️ Info",
    guide: { en: ".owner" },
    usePrefix: true
  },

  onStart: async function ({ api, event }) {
    const owner = {
      name: "𝗔𝘆𝗮𝗻 𝗔𝗵𝗺𝗲𝗗'𝘇",
      whatsapp: "0191***7459",
      botName: "◦•●♡ʏᴏᴜʀ ʙʙʏ♡●•◦",
      nickName: "𝗔𝗬𝗔𝗡",
      class: "𝗜𝗻𝘁𝗲𝗿 2𝗻𝗱 𝗬𝗲𝗮𝗿",
      religion: "𝗜𝘀𝗹𝗮𝗺",
      relationship: "𝗦𝗶𝗻𝗴𝗹𝗲",
      address: "𝗚𝗮𝘇𝗶𝗽𝘂𝗿"
    };

    const width = 800, height = 500, frames = 40;
    const encoder = new GIFEncoder(width, height);
    const outPath = path.join(__dirname, "cache", "owner_card.gif");
    await fs.ensureDir(path.dirname(outPath));
    const stream = fs.createWriteStream(outPath);
    encoder.createReadStream().pipe(stream);
    encoder.start();
    encoder.setRepeat(0);
    encoder.setDelay(80);
    encoder.setQuality(10);

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Load owner photo once
    let ownerImg;
    const photoPath = path.join(__dirname, "owner_photo.jpg");
    if (await fs.pathExists(photoPath)) {
      const buffer = await fs.readFile(photoPath);
      ownerImg = await loadImage(buffer);
    } else {
      ownerImg = await loadImage("https://files.catbox.moe/j7xeo4.jpg");
    }

    for (let f = 0; f < frames; f++) {
      // 🌌 Galaxy background
      const bg = ctx.createLinearGradient(0, 0, width, height);
      bg.addColorStop(0, "#000000");
      bg.addColorStop(0.5, "#1a1a40");
      bg.addColorStop(1, "#3f0d63");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // ✨ Moving stars
      for (let i = 0; i < 120; i++) {
        const x = (Math.random() * width + f * 2) % width;
        const y = (Math.random() * height + f * 3) % height;
        const r = Math.random() * 1.2;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.fill();
      }

      // 🏷️ Heading
      ctx.font = "bold 42px Sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = `hsl(${(f*10)%360},100%,70%)`;
      ctx.fillText("⭐ BOT OWNER INFO ⭐", width/2, 80);

      // 📋 Info text
      ctx.textAlign = "left";
      const lines = [
        { label: "👤 Owner:", value: owner.name },
        { label: "📱 WhatsApp:", value: owner.whatsapp },
        { label: "🤖 Bot Name:", value: owner.botName },
        { label: "📝 Nickname:", value: owner.nickName },
        { label: "🏫 Class:", value: owner.class },
        { label: "🕋 Religion:", value: owner.religion },
        { label: "❤️ Relation:", value: owner.relationship },
        { label: "🏠 Address:", value: owner.address }
      ];
      const startX = 100, startY = 180, lineHeight = 40, labelW = 180;
      lines.forEach((item, i) => {
        const y = startY + i * lineHeight;
        ctx.font = "bold 22px Sans-serif";
        ctx.fillStyle = "#ffeb66";
        ctx.fillText(item.label, startX, y);
        ctx.font = "italic 23px Sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(item.value, startX + labelW, y);
      });

      // 🖼️ Owner photo with rounded corners
      const photoW = 140, photoH = 140;
      const x = width - photoW - 40;
      const yPhoto = height - photoH - 60;
      const radius = 18;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x + radius, yPhoto);
      ctx.lineTo(x + photoW - radius, yPhoto);
      ctx.quadraticCurveTo(x + photoW, yPhoto, x + photoW, yPhoto + radius);
      ctx.lineTo(x + photoW, yPhoto + photoH - radius);
      ctx.quadraticCurveTo(x + photoW, yPhoto + photoH, x + photoW - radius, yPhoto + photoH);
      ctx.lineTo(x + radius, yPhoto + photoH);
      ctx.quadraticCurveTo(x, yPhoto + photoH, x, yPhoto + photoH - radius);
      ctx.lineTo(x, yPhoto + radius);
      ctx.quadraticCurveTo(x, yPhoto, x + radius, yPhoto);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(ownerImg, x, yPhoto, photoW, photoH);
      ctx.restore();

      // 💫 Animated glowing border
      const borderWidth = 8;
      const grad = ctx.createLinearGradient(0,0,width,height);
      grad.addColorStop(0, `hsl(${(f*12)%360},100%,60%)`);
      grad.addColorStop(1, `hsl(${(f*12+180)%360},100%,60%)`);
      ctx.lineWidth = borderWidth;
      ctx.strokeStyle = grad;
      ctx.shadowBlur = 25;
      ctx.shadowColor = `hsl(${(f*12)%360},100%,70%)`;
      ctx.strokeRect(borderWidth/2,borderWidth/2,width-borderWidth,height-borderWidth);

      // 🌈 Owner name glow
      ctx.font = "bold 28px Sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = `hsl(${(f*15)%360},100%,70%)`;
      ctx.fillText(owner.name, width/2, height - 50);

      encoder.addFrame(ctx);
    }

    encoder.finish();

    stream.on("close", () => {
      api.sendMessage(
        { body: "✨ Owner Info (Animated Galaxy GIF)", attachment: fs.createReadStream(outPath) },
        event.threadID,
        (err, info) => {
          setTimeout(() => api.unsendMessage(info.messageID), 20000);
          fs.unlinkSync(outPath);
        },
        event.messageID
      );
    });
  }
};
