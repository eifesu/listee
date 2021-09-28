const {
    Client
} = require('whatsapp-web.js');
const qrcode = require("qrcode-terminal");

// WhatsApp Client
// Path where the session data will be stored
const SESSION_FILE_PATH = './session.json';

// Load the session data if it has been previously saved
const client = new Client();
client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    qrcode.generate(qr, {
        small: true
    });
});

client.on('ready', async() => {
    console.log('Client is ready!');
    init();

});

client.on('message', msg => {
    if (msg.body == '!ping') {
        msg.reply('pong');
    }
});

client.initialize();
module.exports = client;