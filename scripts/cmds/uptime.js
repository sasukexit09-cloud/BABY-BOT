module.exports = {
  config: {
    name: "uptime",
    aliases: ["upt", "up"],
    version: "4.0",
    author: "BaYjid",
    role: 0,
    shortDescription: {
      en: "Displays bot uptime with auto-refreshing live RGB bars"
    },
    longDescription: {
      en: "Displays uptime, memory, CPU, total users, threads with auto-refreshing live RGB bars, inline %, and AYAN HOST signature"
    },
    category: "RUNNING-TIME",
    guide: {
      en: "Type {pn}"
    }
  },

  onStart: async function ({ api, event, usersData, threadsData }) {
    try {
      // Function to generate dynamic RGB bars
      function getDynamicRGBBar(percent, length = 20) {
        const filledBars = Math.round((percent / 100) * length);
        let bar = "";
        for (let i = 1; i <= length; i++) {
          if (i <= filledBars) {
            const ratio = i / length;
            if (ratio <= 0.33) bar += "🟥";
            else if (ratio <= 0.66) bar += "🟨";
            else bar += "🟩";
          } else {
            bar += "⬛";
          }
        }
        return bar + ` ${percent.toFixed(1)}%`;
      }

      // Function to fetch data and send dashboard
      const sendDashboard = async () => {
        const allUsers = await usersData.getAll();
        const allThreads = await threadsData.getAll();

        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        const memoryUsage = (process.memoryUsage().rss / 1024 / 1024).toFixed(2);
        const memoryMax = 1024;
        const memoryPercent = Math.min((memoryUsage / memoryMax) * 100, 100);

        const cpuUsage = process.cpuUsage();
        const cpuUserMs = (cpuUsage.user / 1000).toFixed(2);
        const cpuMax = 1000;
        const cpuPercent = Math.min((cpuUserMs / cpuMax) * 100, 100);

        const memoryBar = getDynamicRGBBar(memoryPercent);
        const cpuBar = getDynamicRGBBar(cpuPercent);

        const dashboardMessage = `
╔════════════════════════════════╗
║          🤖 BOT DASHBOARD        ║
╠════════════════════════════════╣
║ ⏱️ Uptime: ${hours}h ${minutes}m ${seconds}s
║ 👥 Total Users: ${allUsers.length}
║ 🗂️ Total Threads: ${allThreads.length}
║
║ 🧠 Memory Usage: ${memoryUsage} MB
║ ${memoryBar}
║ 💻 CPU Load: ${cpuUserMs} ms
║ ${cpuBar}
╠════════════════════════════════╣
║           AYAN HOST             ║
╚════════════════════════════════╝
`;

        // Send or update message
        await api.sendMessage(dashboardMessage, event.threadID);
      };

      // Initial send
      await sendDashboard();

      // Auto-refresh every 10 seconds
      const refreshInterval = 10000; // 10,000 ms = 10s
      setInterval(sendDashboard, refreshInterval);

    } catch (error) {
      console.error(error);
      api.sendMessage("❌ Error: Could not fetch uptime data.", event.threadID);
    }
  }
};
