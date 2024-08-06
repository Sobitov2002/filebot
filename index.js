const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const axios = require('axios');
const token = '7291745969:AAFPQ-SZnk8dZb3MvqfFDf2jGPLHQEl8NhQ';
const bot = new TelegramBot(token, { polling: true });

// PDF fayllar ro'yxati
const pdfFiles = {
  'file_1': ['BQACAgUAAx0CeZJ9SgADSWayDy3gXG56yCe-GarTqammiQbVAAKLAQACGry5VYk3AjA0F6N8NQQ', 'BQACAgUAAx0CeZJ9SgADSWayDy3gXG56yCe-GarTqammiQbVAAKLAQACGry5VYk3AjA0F6N8NQQ'],
  'file_2': ['BQACAgIAAx0CeZJ9SgADQmau-Egl8BXfpS35PIOzQ0EOZrmjAAINVgACUHkJSeiPMcASgX55NQQ', 'BQACAgIAAx0CeZJ9SgADQmau-Egl8BXfpS35PIOzQ0EOZrmjAAINVgACUHkJSeiPMcASgX55NQQ', 'BQACAgIAAx0CeZJ9SgADQmau-Egl8BXfpS35PIOzQ0EOZrmjAAINVgACUHkJSeiPMcASgX55NQQ'],
  'file_3': ['FILE_ID_6', 'FILE_ID_7', 'FILE_ID_8'],
  'file_4': ['FILE_ID_9', 'FILE_ID_10'],
  'file_5': ['BQACAgIAAx0CeZJ9SgADQmau-Egl8BXfpS35PIOzQ0EOZrmjAAINVgACUHkJSeiPMcASgX55NQQ'],
  'file_6': ['FILE_ID_12', 'FILE_ID_13', 'FILE_ID_14', 'FILE_ID_15']
};

// 1-kanal nomi
const channelUsername = '@aswwqfe';

// Foydalanuvchilar ro'yxatini saqlash 
const usersFile = 'users.json';
let users = [];
if (fs.existsSync(usersFile)) {
  users = JSON.parse(fs.readFileSync(usersFile));
}

// Bot orqali foydalanuvchilar ro'yxatini saqlash
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!users.includes(userId)) {
    users.push(userId);
    fs.writeFileSync(usersFile, JSON.stringify(users));
  }

  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Kanalga a\'zo bo\'lish', url: `https://t.me/${channelUsername.substring(1)}` },
          { text: 'A\'zo bo\'ldim', callback_data: 'joined' }
        ]
      ]
    }
  };

  bot.sendMessage(chatId, 'Assalomu aleykum ! ✅ Ushbu telegram bot sizga manfatli bo\'ladi degan umidamiz ! ✅ Kelajagingizni "DINAKOREANACADEMY" bilan qur!', options);
});

// Maxsus buyruq orqali foydalanuvchilar sonini ko'rsatish
bot.onText(/\/usercount/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  // Sizning user ID'nizni tekshiring, agar bu siz bo'lsangiz
  const adminId = ''; // Sizning Telegram ID'ingizni shu yerga qo'ying

  if (userId === adminId) {
    bot.sendMessage(chatId, `Jami foydalanuvchilar soni: ${users.length}`);
  } else {
    bot.sendMessage(chatId, 'Sizda bu ma\'lumotni ko\'rish huquqi yo\'q.');
  }
});

bot.on('callback_query', async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const userId = callbackQuery.from.id;
  const data = callbackQuery.data;

  if (data === 'joined') {
    try {
      const res = await axios.get(`https://api.telegram.org/bot${token}/getChatMember?chat_id=${channelUsername}&user_id=${userId}`);
      const status = res.data.result.status;

      if (status === 'member' || status === 'administrator' || status === 'creator') {
        const options = {
          reply_markup: {
            inline_keyboard: [
              [{ text: '✅ 비타민 한국어 ', callback_data: 'file_1' }],
              [{ text: '✅ 서울대 한국어 ', callback_data: 'file_2' }],
              [{ text: '✅ 재미있는 한국어', callback_data: 'file_3' }],
              [{ text: '✅ 한국어 ', callback_data: 'file_4' }],
              [{ text: '✅  Grammar in use', callback_data: 'file_5' }],
              // [{ text: 'Bo\'lim 6', callback_data: 'file_6' }]
            ]
          }
        };
        bot.sendMessage(chatId, '✅ Bizni tanlaganizdan xursandmiz 😌 Qaysi bo\'limni tanlaysiz?', options);
      } else {
        bot.sendMessage(chatId, `Iltimos, kanalimizga a'zo bo'ling: ${channelUsername}`);
      }
    } catch (error) {
      console.error(error);
      bot.sendMessage(chatId, 'Kanalga a’zo ekanligingizni tekshirishda xatolik yuz berdi.');
    }
  } else if (pdfFiles[data]) {
    for (const fileId of pdfFiles[data]) {
      await bot.sendDocument(chatId, fileId);
    }
  }
});

console.log('Bot ishlayapti...');
