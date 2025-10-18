const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");
const GIFEncoder = require("gifencoder");

module.exports = {
  config: {
    name: "owner3",
    version: "12.0",
    author: "Ayan x Maya",
    shortDescription: "Animated galaxy GIF owner card with flashy stars & rainbow info",
    category: "ℹ️ Info",
    guide: { en: ".owner" },
    usePrefix: true
  },

  onStart: async function ({ api, event }) {
    const owner = {
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
    encoder.setDelay(70); // Faster GIF
    encoder.setQuality(15);

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Load owner photo
    let ownerImg;
    const photoPath = path.join(__dirname, "owner_photo.jpg");
    if (await fs.pathExists(photoPath)) {
      ownerImg = await loadImage(photoPath);
    } else {
      ownerImg = await loadImage("https://files.catbox.moe/j7xeo4.jpg");
    }

    // Pre-generate more stars for dynamic effect
    const starCount = 200; // Increased number of stars
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2,
      twinkleSpeed: Math.random() * 0.1 + 0.05, // faster twinkle
      opacity: Math.random() * 0.5 + 0.5
    }));

    for (let f = 0; f < frames; f++) {
      // 🌌 Background
      const bg = ctx.createLinearGradient(0, 0, width, height);
      bg.addColorStop(0, "#000000");
      bg.addColorStop(0.5, "#1a1a40");
      bg.addColorStop(1, "#3f0d63");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // ✨ Flashy & fast twinkling stars
      stars.forEach(star => {
        star.x = (star.x + 4) % width; // faster movement
        star.y = (star.y + 3) % height; // faster movement
        star.opacity += star.twinkleSpeed * (Math.random() > 0.5 ? 1 : -1);
        if (star.opacity > 1) star.opacity = 1;
        if (star.opacity < 0.2) star.opacity = 0.2;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(255,255,255,${star.opacity})`;
        ctx.fill();
      });

      // 🏷️ Heading
      ctx.font = "bold 42px Sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = `hsl(${(f*10)%360},100%,70%)`;
      ctx.fillText("⭐ BOT OWNER INFO ⭐", width/2, 80);

      // 📋 Info text with flashy rainbow glow
      ctx.textAlign = "left";
      const lines = [
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

        // Flashy glow effect with faster sine wave
        const hue = (f*25 + i*60) % 360;
        const glowIntensity = 12 + 12 * Math.abs(Math.sin((f + i*5)/frames * Math.PI * 2));
        ctx.shadowBlur = glowIntensity;
        ctx.shadowColor = `hsl(${hue},100%,70%)`;

        ctx.font = "bold 22px Sans-serif";
        ctx.fillStyle = `hsl(${hue},100%,70%)`;
        ctx.fillText(item.label, startX, y);

        ctx.font = "italic 23px Sans-serif";
        ctx.fillStyle = `hsl(${(hue+30)%360},100%,90%)`;
        ctx.fillText(item.value, startX + labelW, y);

        ctx.shadowBlur = 0;
      });

      // 🖼️ Owner photo with rounded corners & pulsing glow
      const photoW = 140, photoH = 140;
      const xPhoto = width - photoW - 40;
      const yPhoto = height - photoH - 60;
      const radius = 18;

      const glow = 10 + 5 * Math.sin((f / frames) * 2 * Math.PI); // slightly more intense glow
      ctx.save();
      ctx.shadowBlur = glow;
      ctx.shadowColor = `hsl(${(f*12)%360},100%,70%)`;
      ctx.fillStyle = "#00000000";
      ctx.fillRect(xPhoto - 2, yPhoto - 2, photoW + 4, photoH + 4);
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(xPhoto + radius, yPhoto);
      ctx.lineTo(xPhoto + photoW - radius, yPhoto);
      ctx.quadraticCurveTo(xPhoto + photoW, yPhoto, xPhoto + photoW, yPhoto + radius);
      ctx.lineTo(xPhoto + photoW, yPhoto + photoH - radius);
      ctx.quadraticCurveTo(xPhoto + photoW, yPhoto + photoH, xPhoto + photoW - radius, yPhoto + photoH);
      ctx.lineTo(xPhoto + radius, yPhoto + photoH);
      ctx.quadraticCurveTo(xPhoto, yPhoto + photoH, xPhoto, yPhoto + photoH - radius);
      ctx.lineTo(xPhoto, yPhoto + radius);
      ctx.quadraticCurveTo(xPhoto, yPhoto, xPhoto + radius, yPhoto);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(ownerImg, xPhoto, yPhoto, photoW, photoH);
      ctx.restore();

      // 💫 Animated glowing border
      const borderWidth = 6;
      const grad = ctx.createLinearGradient(0,0,width,height);
      grad.addColorStop(0, `hsl(${(f*12)%360},100%,60%)`);
      grad.addColorStop(1, `hsl(${(f*12+180)%360},100%,60%)`);
      ctx.lineWidth = borderWidth;
      ctx.strokeStyle = grad;
      ctx.shadowBlur = 25;
      ctx.shadowColor = `hsl(${(f*12)%360},100%,70%)`;
      ctx.strokeRect(borderWidth/2,borderWidth/2,width-borderWidth,height-borderWidth);

      encoder.addFrame(ctx);
    }

    encoder.finish();

    stream.on("close", () => {
      api.sendMessage(
        { body: "✨ Owner Info (Dynamic Galaxy GIF)", attachment: fs.createReadStream(outPath) },
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
