module.exports = () => {
  process.env['NTBA_FIX_319'] = 1; // to avoid a deprecation warning

  require('dotenv').config();

  // replace the value below with the Telegram token you receive from @BotFather
  const token = process.env.BOT_TOKEN;

  const TelegramBot = require('node-telegram-bot-api');

  const helpMessage = require('./help');

  const links = require('./links');

  const timeOut = 120000;

  // console.log(helpMessage);

  // Create a bot that uses 'polling' to fetch new updates
  const bot = new TelegramBot(token, { polling: true });

  // Matches "/echo [whatever]"
  bot.onText(/\/echo (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"

    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp).catch((error) => {
      console.log(error.code); // => 'ETELEGRAM'
      console.log(error.response.body); // => { ok: false, error_code: 400, description: 'Bad Request: chat not found' }
    });
  });

  bot.on('new_chat_members', (msg) => {
    console.log(`user joined`);
    console.log(msg);
    const chatId = msg.chat.id;

    const message = bot
      .sendMessage(
        chatId,
        `Hey @${msg.new_chat_member.username}, here are some of Hack Club's links,\n ${links}`
      )
      .catch((error) => {
        console.log(error.code); // => 'ETELEGRAM'
        console.log(error.response.body); // => { ok: false, error_code: 400, description: 'Bad Request: chat not found' }
      });

    // let messageID;

    message
      .then((res) => {
        // console.log(`The message sent by bot: \n\n`);
        // console.log(res);

        setTimeout(() => {
          bot.deleteMessage(chatId, res.message_id).catch((error) => {
            console.log(error.code); // => 'ETELEGRAM'
            console.log(error.response.body); // => { ok: false, error_code: 400, description: 'Bad Request: chat not found' }
          });
        }, timeOut);
      })
      .catch((err) => console.log(err));

    // console.log(`messageID = ${messageID}`);
    // setTimeout(() => { bot.deleteMessage(chatId, ) }, 5000);
  });

  bot.on('left_chat_member', (msg) => {
    console.log(`member left`);
    console.log(msg.left_chat_member);
  });

  // Listen for any kind of message. There are different kinds of
  // messages.
  bot.on('message', (msg) => {
    if (msg.text == null || msg.text == undefined) {
      // console.log(`message text not defined`);
      return;
    }

    const chatId = msg.chat.id;
    const userQuestion = msg.text.replace(/\//, '');

    console.log(msg);

    const regExhelp = /^((h|H)(elp|ELP))/;
    const regExLinks = /^((l|L)(inks|INKS))/;

    if (regExhelp.test(userQuestion)) {
      console.log(`User ${msg.from.username}: ${userQuestion}`);

      const helpMessage1 = bot
        .sendMessage(chatId, helpMessage)
        .catch((error) => {
          console.log(error.code); // => 'ETELEGRAM'
          console.log(error.response.body); // => { ok: false, error_code: 400, description: 'Bad Request: chat not found' }
        });

      helpMessage1
        .then((res) => {
          // console.log(`The message sent by bot: \n\n`);
          // console.log(res);

          setTimeout(() => {
            bot.deleteMessage(chatId, res.message_id).catch((error) => {
              console.log(error.code); // => 'ETELEGRAM'
              console.log(error.response.body); // => { ok: false, error_code: 400, description: 'Bad Request: chat not found' }
            });
          }, timeOut);
        })
        .catch((err) => console.log(err));
    } else if (regExLinks.test(userQuestion)) {
      const linkMessage = bot.sendMessage(chatId, links).catch((error) => {
        console.log(error.code); // => 'ETELEGRAM'
        console.log(error.response.body); // => { ok: false, error_code: 400, description: 'Bad Request: chat not found' }
      });

      linkMessage
        .then((res) => {
          // console.log(`The message sent by bot: \n\n`);
          // console.log(res);

          setTimeout(() => {
            bot.deleteMessage(chatId, res.message_id).catch((error) => {
              console.log(error.code); // => 'ETELEGRAM'
              console.log(error.response.body); // => { ok: false, error_code: 400, description: 'Bad Request: chat not found' }
            });
          }, timeOut);
        })
        .catch((err) => console.log(err));
    } else {
      const defaultMessage = bot
        .sendMessage(
          chatId,
          `Hey there, I am a bot.\nEnter "/help" to see what I can do.`
        )
        .catch((error) => {
          console.log(error.code); // => 'ETELEGRAM'
          console.log(error.response.body); // => { ok: false, error_code: 400, description: 'Bad Request: chat not found' }
        });

      defaultMessage
        .then((res) => {
          // console.log(`The message sent by bot: \n\n`);
          // console.log(res);

          setTimeout(() => {
            bot.deleteMessage(chatId, res.message_id).catch((error) => {
              console.log(error.code); // => 'ETELEGRAM'
              console.log(error.response.body); // => { ok: false, error_code: 400, description: 'Bad Request: chat not found' }
            });
          }, timeOut);
        })
        .catch((err) => console.log(err));
    }
  });

  bot.on('polling_error', (error) => {
    console.log(error); // => 'EFATAL'
  });

  console.log(`Bot is ready!`);

  app.get('/', (req, res) => {
    res.send('bot deployed');
  });
};
