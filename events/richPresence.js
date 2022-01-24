const db = require("quick.db");

module.exports = async(client) => {

  client.user.setStatus("online");
  const discordOynuyor = [
    "🚀 /yardım | 📣 /moderasyon",
    "📣 /moderasyon | 🎉 /çekiliş-sistemi"
  ]
  setInterval(function() {
    var messageRandom = Math.floor(Math.random() * (discordOynuyor.length - 0 + 1) + 0);
    client.user.setActivity(discordOynuyor[messageRandom],"");
  }, 2 * 6000);

}