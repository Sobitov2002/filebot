const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const axios = require('axios');
const token = '7291745969:AAFPQ-SZnk8dZb3MvqfFDf2jGPLHQEl8NhQ';
const bot = new TelegramBot(token, { polling: true });

// 1-kanalda joylashgan fayllar ro'yxati
const pdfFileIds = [
  'BQACAgIAAx0CeZJ9SgADQmau-Egl8BXfpS35PIOzQ0EOZrmjAAINVgACUHkJSeiPMcASgX55NQQ',
  'YOUR_SECOND_FILE_ID', // Yana bir fayl ID sini qo'shing
  // Qo'shimcha fayl IDlarini shu yerga qo'shing
];

// 1-kanal nomi
const channelUsername = '@aswwqfe';

// Foydalanuvchilar ro'yxatini saqlash uchun fayl
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

  bot.sendMessage(chatId, 'Salom! Iltimos, quyidagi tugmalardan foydalaning:', options);
});

// Maxsus buyruq orqali foydalanuvchilar sonini ko'rsatish
bot.onText(/\/usercount/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  // Sizning user ID'nizni tekshiring, agar bu siz bo'lsangiz
  const adminId = '5812196124'; // Sizning Telegram ID'ingizni shu yerga qo'ying

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
        bot.sendMessage(chatId, 'Siz allaqachon kanalga a’zosiz! Yana bir bor kanalda joylashgan fayllarni ko\'rishingiz mumkin.');

        // Fayllarni yuborish
        for (const fileId of pdfFileIds) {
          await bot.sendDocument(chatId, fileId);
        }
      } else {
        bot.sendMessage(chatId, `Iltimos, kanalimizga a'zo bo'ling: ${channelUsername}`);
      }
    } catch (error) {
      console.error(error);
      // bot.sendMessage(chatId, 'Kanalga a’zo ekanligingizni tekshirishda xatolik yuz berdi.');
    }
  }
});

console.log('Bot ishlayapti...');
