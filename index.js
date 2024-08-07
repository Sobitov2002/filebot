const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const axios = require('axios');
const token = '7291745969:AAFPQ-SZnk8dZb3MvqfFDf2jGPLHQEl8NhQ';
const bot = new TelegramBot(token, { polling: true });

// PDF fayllar ro'yxati
const pdfFiles = {
  'file_1': ['BQACAgIAAx0CeZJ9SgADbGaySfYeG4PtJbIkNtPTQlBgcCsZAALMCAACy93RS6ADVKULnTs9NQQ',
            'BQACAgIAAx0CeZJ9SgADbWaySlEVWPeTaqAWKBIxUuhcjbyyAALeCAACy93RS2akjv5MoBxINQQ',
            'BQACAgIAAx0CeZJ9SgADbmaySlZYlVeRlbbDFan_WhQqmMbAAAL4CAACy93RS2ug6wlRasNeNQQ',
            'BQACAgIAAx0CeZJ9SgADb2aySlq2QoRn9wZ6ToJzI8yip166AAL_CAACy93RS2J6HUdjDChINQQ',
            'BQACAgIAAx0CeZJ9SgADcGayStJXk4uTfofsWZQjdkVVe8nJAAIECQACy93RS08vIVPVn23HNQQ',
            'BQACAgIAAx0CeZJ9SgADcWayStiWaHs8YUZV1FrqSZQyw8QPAAIJCQACy93RS6TvFHGglX73NQQ'  ],
  
            'file_2': ['BQACAgUAAx0CeZJ9SgADoWayT2YAATaQDU4TeMTy1r8NsmZJzwAC1AEAAhq8uVVQw-cPxr5A4jUE', 
              'BQACAgUAAx0CeZJ9SgADomayT33lESLgWE1D5XXewzZ-PlAXAAJrAQAC6-eoVVgJNkl72WdSNQQ', 
              'BQACAgUAAx0CeZJ9SgADo2ayUDSlddQ_0ps57PoNiuj38h10AAJrAQAC6-eoVVgJNkl72WdSNQQ',
              'BQACAgUAAx0CeZJ9SgADqGayUKgHGxQzdQPV-1R6gqx2lBKYAAJpAQAC6-eoVXXb6cD2ukJHNQQ',

              'BQACAgUAAx0CeZJ9SgADpGayUHLY0m04sbvHYfBQApoEPSG6AALWAQACGry5VRD12co6UojFNQQ',
              'BQACAgUAAx0CeZJ9SgADpWayUHJnoplMjr_0NgGeRKLkoq-hAALXAQACGry5VSa5cW8wC5kzNQQ',
              'BQACAgUAAx0CeZJ9SgADpmayUJDCSHhFoJYJgcVwfnGwQXxAAAJsAQAC6-eoVZ3Xv6RGorFXNQQ',
              'BQACAgUAAx0CeZJ9SgADp2ayUJDs6NX7RpiQwhKmYojj3jSoAAJtAQAC6-eoVdMIEPRwQLcGNQQ',
              
              'BQACAgUAAx0CeZJ9SgADqmayUgbDRXS9zMadXUf4LEmAtPPsAALWAQACGry5VRD12co6UojFNQQ',
              'BQACAgUAAx0CeZJ9SgADq2ayUgbDPL7gcA6gAlKtRFsoEyrXAALXAQACGry5VSa5cW8wC5kzNQQ',
              'BQACAgUAAx0CeZJ9SgADrGayUkfpV_rdHeeHxQbRRA_zw-7mAAJtAQAC6-eoVdMIEPRwQLcGNQQ',
              'BQACAgUAAx0CeZJ9SgADrWayUnL0FLEPz0Z_xPIvZN3iwktRAAJsAQAC6-eoVZ3Xv6RGorFXNQQ',

              'BQACAgUAAx0CeZJ9SgADrmayUr-wZtDtpic2IfKsxqMlXVWDAALYAQACGry5Vf6I6ZMjoKElNQQ',
              'BQACAgUAAx0CeZJ9SgADr2ayUr_m4V7Zc5tetPLMoDOJ0b5gAALZAQACGry5Ve98ARMROY7VNQQ',
              'BQACAgUAAx0CeZJ9SgADsGayUr8QthzKgB1YoD5DYzAD3_u9AAKKAQACGry5VWn2QNibP07bNQQ',
              'BQACAgUAAx0CeZJ9SgADsWayUr9N7pTlW0Buyr6MIiRikwSGAAKLAQACGry5VYd-6NYNlLsRNQQ',

              'BQACAgUAAx0CeZJ9SgADt2ayU3F4Ry_ZzyaLDwlUKMF7VQ-yAALgAQACGry5VeHYIgxQ28EfNQQ',
              ' BQACAgUAAx0CeZJ9SgADtmayU3FInQdePdtfSNgQ5x8-Q2RUAALeAQACGry5Vd5yGDIpm8ceNQQ',              
              'BQACAgUAAx0CeZJ9SgADtWayUx3Yzu5NX1Vchjbcv4NANxB1AAKWAQACGry5VQft-MkwGeoMNQQ',
              'BQACAgUAAx0CeZJ9SgADtGayUx1l1N9fdag3Enpeb1PBrs0eAAKUAQACGry5VdeiupuN8zYxNQQ',

              'BQACAgUAAx0CeZJ9SgADumayVSwGsjrJrJALzHKvbtd8U8q_AALiAQACGry5VbjKUPww5WUPNQQ',
              'BQACAgUAAx0CeZJ9SgADu2ayVSzJleX08NtFFbljZ2Fu_UYsAALkAQACGry5VZXutp6Jea6mNQQ',
              'BQACAgUAAx0CeZJ9SgADwGayVa8nmKqB2-Ed-BW1ipb-bvQoAAKeAQACGry5VdlI4ml5Nuj0NQQ',
              'BQACAgUAAx0CeZJ9SgADwWayVa8e8mbtoBEGhdS91mXNjUmZAAKgAQACGry5VbCjeAMl0L8oNQQ',
              
              
              // ' BQACAgUAAx0CeZJ9SgADzGayVqYT6g1vpQqc6GBarN-pN3YWAALlAQACGry5VdIDEj6utp-KNQQ',
              // 'QACAgUAAx0CeZJ9SgADzWayVqbNQedh98Yb-2hrTWeVoXQ_AALmAQACGry5VTHNobArcRx5NQQ',
              // 'BQACAgUAAx0CeZJ9SgAD0mayV1eAsZ3N7zEi6rrVTy8lAU6OAAKjAQACGry5VVXO1w1wmwRQNQQ',
              // 'BQACAgUAAx0CeZJ9SgAD02ayV1fJ1oWFQiE5QUs-TQhEdWobAAKkAQACGry5VdrQSur95xTrNQQ',

              // 'BQACAgUAAx0CeZJ9SgAD1GayV4bjAAHXZur0fhhrWj3O0LUHsgAC5wEAAhq8uVX0uz2p4H1oljUE',
              // 'BQACAgUAAx0CeZJ9SgAD1WayV4ZclAcuOhaFA-aNYAHnw_2yAALoAQACGry5VbBehaHOE4RmNQQ',
              // 'BQACAgUAAx0CeZJ9SgAD1mayV7b6QCT2Rx9I_v5ifYaUtVTaAAKlAQACGry5Vbw0qYcJxu70NQQ',
              // 'BQACAgUAAx0CeZJ9SgAD12ayV7afsz-Nr3P9zJMRuPDZmfm-AAKnAQACGry5VY4zGwR_u5LnNQQ',

              // 'BQACAgUAAx0CeZJ9SgAD2mayWDUmDuOr-5WbuFEulObo4HcMAALpAQACGry5VW7xPA3NCUtXNQQ',
              // 'BQACAgUAAx0CeZJ9SgAD22ayWDXW8BRgmkpOshJ99Yost_uBAALqAQACGry5VVgojIIPZeG3NQQ',
              // 'BQACAgUAAx0CeZJ9SgAD3GayWHv6P9tZHE8o11JQl16rFZJRAAKpAQACGry5VcP9Bz5rFkL8NQQ',
              // 'BQACAgUAAx0CeZJ9SgAD3WayWHux_xjTaYW7UmwTQvenwrcCAAKrAQACGry5VQABnvklQO3QizUE',

              // ' BQACAgUAAx0CeZJ9SgAD3mayWIy2IVujs9dAO31i-YF7l08nAALrAQACGry5VeyCCmoInh-6NQQ',
              // 'BQACAgUAAx0CeZJ9SgAD32ayWIw1V3J9KmLFfKyilPPdThAjAALsAQACGry5VdefIdi75ZgYNQQ',
              // 'BQACAgUAAx0CeZJ9SgAD4GayWNg8ldl0Dd_YM09lmDi2Lu1zAAKvAQACGry5VQRRt_hjJdXzNQQ',
              // 'BQACAgUAAx0CeZJ9SgAD4WayWNji39mdj-trlAKCIVSGyENrAAKyAQACGry5VYAitpD1VhmDNQQ',

              // 'BQACAgUAAx0CeZJ9SgAD4mayWVgvQBRLUE2wnIzao0ngWVXTAALtAQACGry5VYOnwmbkPGmbNQQ',
              // 'BQACAgUAAx0CeZJ9SgAD42ayWVixtVd9cxgmsu3di4TmzBlUAALuAQACGry5VbhwClN0RGhaNQQ',
              // 'BQACAgUAAx0CeZJ9SgAD5GayWVj-t6bn8Hg9SLApyzGVXhHwAALvAQACGry5VZqr8kRBuIr_NQQ',
              // 'BQACAgUAAx0CeZJ9SgAD5WayWcTAir_f6WY2y40g00Pbs23PAALPAQACGry5VXaNEVrHkP0fNQQ',
              // 'BQACAgUAAx0CeZJ9SgAD5mayWcQTkNqW-BogsApLlhkkx4GnAALQAQACGry5VacT7t0TsYJ5NQQ',
              // 'BQACAgUAAx0CeZJ9SgAD52ayWcTxW5lr9ZYRQlj9pl0uyoX1AALRAQACGry5VZ_hMppGWA51NQQ'

            ],
  'file_3': ['BQACAgQAAx0CeZJ9SgAD6GayWsQAAR8RX8e0QaTKYxdBOSk_CwACxQsAAmVoCFOXCiHtQCRUcDUE', 
              'BQACAgQAAx0CeZJ9SgAD6WayWsQaTI79AAHnxl1NZTC5U1et2AACyQsAAmVoCFMUPaZLeJQQ4DUE', 
              'BQACAgQAAx0CeZJ9SgAD6mayWsRsnnf2MaETcyPCQk-SezJ7AALaCwACZWgIUwOu5G3BHhoCNQQ',
               'BQACAgQAAx0CeZJ9SgAD62ayWsT-qs80dFubBQ52DfhXZCM4AALvCwACZWgIUzd9s9c7C4uWNQQ',
              'BQACAgQAAx0CeZJ9SgAD7GayWsTfXAr_wVbeKDy8yFtTPXcXAAL2CwACZWgIUxdKwMFBmLSJNQQ',
            'BQACAgQAAx0CeZJ9SgAD7WayWsQOUPdA3jsJalWfpkOyR8lSAAL7CwACZWgIU-8vnSuL5sowNQQ',
            'BQACAgIAAx0CeZJ9SgAD7mayWzRLRwmbusqnJygJxiikK2AsAAJWAANPzLFI_-fNtalL6WM1BA',
            'BQACAgIAAx0CeZJ9SgAD72ayWzRyGMb87vRj3RDswXQy1mDbAAJXAANPzLFITOXvINux-tg1BA',
            'BQACAgUAA0CeZJ9SgAD8GayWzRpra7aGFeoKIK3pRU5yAYGAAI0AAPFTTlWh-EGizp41GM1BA'  
          ],
  'file_4': ['BQACAgIAAx0CeZJ9SgAD8WayXGQfo7IJ0UZfi3LgpUhe_vDoAAL2TgAChmyQSXKLn9kn-1L8NQQ'],
  'file_5': ['BQACAgIAAx0CeZJ9SgAD8mayXHBF89LSraZg5QOfcHEac4TnAAJOCQACx1uASXdCQe3ekER0NQQ'],
  // 'file_6': ['FILE_ID_12', 'FILE_ID_13', 'FILE_ID_14', 'FILE_ID_15']
};

// 1-kanal nomi
const channelUsername = '@dinakorean';

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
