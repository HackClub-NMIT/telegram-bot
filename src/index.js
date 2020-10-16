// main bot file
process.env['NTBA_FIX_319'] = 1; // to avoid a deprecation warning

require('dotenv').config();

const express = require('express');
const app = express();

const PORT = 3000;

const Discord = require('discord.js');
const client = new Discord.Client();

const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELE_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const channel_id = process.env.CHANNEL_ID;

client.on('ready', () => {
    console.log(`Discord bot ready!`);
});

client.on('message', (msg) => {
    const regExAnnounce = /\s@everyone/g;
    // regExAnnounce.test(msg.content) // also works in the if condition

    console.log(`msg.attachments:`);

    // to parse the Map and extract the picture URL
    let attachmentsWithMsg = JSON.stringify([...msg.attachments]);
    attachmentsWithMsg = JSON.parse(attachmentsWithMsg);

    // console.log(attachmentsWithMsg[0][1].url);
    console.log(attachmentsWithMsg.length);

    if (
        msg.channel.name === 'announcements' ||
        msg.channel.name === 'yt-videos'
        // msg.content.startsWith('@everyone')
    ) {
        if (attachmentsWithMsg.length === 0) {
            console.log(msg.content);

            // msg.channel.send("Sent in announcements channel telegram");

            const msgToSend = msg.content
                .replace(regExAnnounce, '')
                .replace(/\*\*/g, '');

            bot.sendMessage(channel_id, msgToSend).catch((error) => {
                console.log(error.code); // => 'ETELEGRAM'
                console.log(error.response.body); // => { ok: false, error_code: 400, description: 'Bad Request: chat not found' }
            });
        } else {
            const msgToSend = msg.content
                .replace(regExAnnounce, '')
                .replace(/\*\*/g, '');

            // bot.sendMessage(channel_id, msgToSend).catch((error) => {
            //     console.log(error.code); // => 'ETELEGRAM'
            //     console.log(error.response.body); // => { ok: false, error_code: 400, description: 'Bad Request: chat not found' }
            // });

            bot.sendPhoto(channel_id, attachmentsWithMsg[0][1].url, {
                caption: msgToSend,
            }).catch((error) => {
                console.log(error.code); // => 'ETELEGRAM'
                console.log(error.response.body); // => { ok: false, error_code: 400, description: 'Bad Request: chat not found' }
            });
        }
    } else {
        console.log(
            `This message: "${msg.content}" wasn't in the announcements channel`
        );
    }
});

bot.on('polling_error', (error) => {
    console.log(error); // => 'EFATAL'
});

client.login(process.env.DISCORD_BOT_TOKEN);

console.log(`Telegram bot ready!`);

app.get('*', (req, res) => {
    res.send({
        message: 'Bot deployed',
        link: 't.me/hackclubnmit',
    });
});

app.listen(process.env.PORT || PORT, () =>
    console.log(`Express server running on port ${PORT}`)
);
