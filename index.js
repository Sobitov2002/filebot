const TelegramBot = require('node-telegram-bot-api');
const token = '7291745969:AAFPQ-SZnk8dZb3MvqfFDf2jGPLHQEl8NhQ'; // Bot tokeningiz
const bot = new TelegramBot(token, { polling: true });
const axios = require('axios');

// 1-kanalda joylashgan fayllar ro'yxati
const pdfFileIds = [
  'BQACAgIAAx0CeZJ9SgADQmau-Egl8BXfpS35PIOzQ0EOZrmjAAINVgACUHkJSeiPMcASgX55NQQ',
  'YOUR_SECOND_FILE_ID', // Yana bir fayl ID sini qo'shing
  // Qo'shimcha fayl IDlarini shu yerga qo'shing
];

// 1-kanal nomi
const channelUsername = '@aswwqfe';

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
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

  try {
    const res = await axios.get(`https://api.telegram.org/bot${token}/getChatMember?chat_id=${channelUsername}&user_id=${userId}`);
    const status = res.data.result.status;

    if (status === 'member' || status === 'administrator' || status === 'creator') {
      bot.sendMessage(chatId, 'Siz allaqachon kanalga a’zosiz!', options);

      // Fayllarni yuborish
      for (const fileId of pdfFileIds) {
        await bot.sendDocument(chatId, fileId);
      }
    } else {
      bot.sendMessage(chatId, `Iltimos, kanalimizga a'zo bo'ling: ${channelUsername}`, options);
    }
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, 'Kanalga a’zo ekanligingizni tekshirishda xatolik yuz berdi.');
  }
});

bot.on('callback_query', async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  if (data === 'joined') {
    bot.sendMessage(chatId, 'A\'zo bo\'ldingiz! Yana bir bor kanalda joylashgan fayllarni ko\'rishingiz mumkin.');
    
    // Fayllarni yuborish
    for (const fileId of pdfFileIds) {
      await bot.sendDocument(chatId, fileId);
    }
  }
});

console.log('Bot ishlayapti...');
