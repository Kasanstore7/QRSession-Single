var makeWASocket = require("@adiwajshing/baileys").default
var qrcode = require("qrcode-terminal");
var { 
delay, 
useSingleFileAuthState 
} = require("@adiwajshing/baileys");
var { 
state, 
saveState 
} = useSingleFileAuthState('./X.data.json')

function qr() {
  var session = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    browser: ['baileys', 'Chrome', ''],
    connectTimeoutMs: 60_000,
    defaultQueryTimeoutMs: 0,
    keepAliveIntervalMs: 1000
  })
  session.ev.on("connection.update", async (s) => {
    var { 
          connection, 
          lastDisconnect 
         } = s
    if (connection == "open") {
      await delay(1000 * 10)
      process.exit(0)
    }
    if (
      connection === "close" &&
      lastDisconnect &&
      lastDisconnect.error &&
      lastDisconnect.error.output.statusCode != 401
    ) {
      qr()
    }
  })
  session.ev.on('creds.update', saveState)
  session.ev.on("messages.upsert", () => { })
}
qr()
