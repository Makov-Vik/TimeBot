require('dotenv').config();
const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

const Markup = require('telegraf/markup');

let notes = [];

bot.start((ctx) => ctx.reply(`Приветсвую! ${ctx.message.from.first_name}\nДа прибудет с нами сила процессоров`, Markup.keyboard([
  ['/help', 'Мои напоминания'],
  ['Время до карания Деда Мороза'],
]).resize().extra()));

bot.help((ctx) => ctx.reply('Отправь мне "Напомни" и нужно событие, далее "в" и время. Например:\nНапомни 07.02 купить билеты в 14:50\n*07.02 - это дата и месяц(если необходимо не на сегодня) '))

bot.hears('Время до карания Деда Мороза', function(ctx) {
  const now = new Date();
  const newyear = new Date(2021, 11, 31, 24, 0, 0);
  let left = newyear - now;
  let days = ~~((left) / (1000 * 60 * 60 * 24));
  left = left - (days * 1000 * 60 * 60 * 24);
  let hours = ~~((left)/ (1000 * 60 * 60));
  left -= hours * 1000 * 60 * 60;
  let min = ~~((left) / (1000 * 60));
  return ctx.replyWithHTML('Тебе осталось до карания: ' + `<i>${days} days. ${hours} hours. ${min} min.</i>`)
});

bot.hears('Мои напоминания', (ctx) => {
  if (notes.length !== 0) {
    let result = '';
    notes.map((reminder) => result += (reminder.Number + '. ' + reminder.Event + '  ' +`в <i>${reminder.Time}</i>` + '\n')) ////// тсправить с выводом даты, если её не
    return ctx.replyWithHTML(result + '<i>\n\nЖелаете что-то исправить, Сэр ?</i> 🧐',
      Markup.inlineKeyboard([
        notes.map((i) => Markup.callbackButton(`${i.Number}`, `${i.Number}`))]).extra());
  }
  else ctx.reply("Пока что, ничего мне не задал, лентяй!")
});

bot.on('text', (ctx) => {
  if ((ctx.message.text.indexOf('напомни') !== -1) || (ctx.message.text.indexOf('Напомни') !== -1)) {
    const lastIndex = ctx.message.text.lastIndexOf('в');
    const time = ctx.message.text.slice(lastIndex + 2);
    if (!isNaN(parseInt(ctx.message.text[8], 10))) {
      const indexDot = ctx.message.text.indexOf('.');
      const date = ctx.message.text.slice(indexDot - 2, indexDot + 3).trim();
      const event = ctx.message.text[indexDot + 4].toUpperCase()
+ ctx.message.text.slice(indexDot + 5, lastIndex - 1);
      notes.push({
        Number: notes.length + 1, Event: event, Date: date, Time: time,
      });
    }
    else {
      const event = ctx.message.text[8].toUpperCase() + ctx.message.text.slice(9, lastIndex - 1);
      notes.push({ Number: notes.length + 1, Event: event, Time: time });
    }
    ctx.reply("Конечно, напомню, если мой создатель меня не угробит")
  }
  setInterval(function() {
    //	let month = new Date().getMonth() + 1
        //month < 10 ? month = '0' + month : month + ''

        // const nowDate = new Date().getDate() + '.' + (new Date().getMonth() + 1);
        // const nowTime = new Date().getHours() + ':' + new Date().getMinutes();

    const nowDate = new Date().toLocaleString('ru', {day: 'numeric', month: 'numeric'});
    const nowTime = new Date().toLocaleString('ru', {hour: 'numeric', minute: 'numeric'})

        // const nowDate = new Date().toLocaleString('ru', {day: 'numeric', month: 'numeric'});
        // const nowTime = new Date().toLocaleString('ru', {hour: 'numeric', minute: 'numeric'})

        for(let i = 0; i < notes.length; i++){
            if (notes[i].Time === nowTime) {
               if  (notes[i].hasOwnProperty('Date')) {
                   if (notes[i].Date === nowDate) {
                     ctx.replyWithHTML('Вы должны сейчас ' + ` <i>${notes[i].Date} числа в ${notes[i].Time}</i> -  ` + notes[i].Event);
                     notes.splice(i, 1);
                    }
                }    
                else  {
                    ctx.replyWithHTML('Вы должны сейчас ' + `<i>(в ${notes[i].Time}</i>)   ` + notes[i].Event);
                    notes.splice(i, 1);
            }  
        }
    }
  }, 1000);
});

// bot.action(arr, (ctx) => {
// //нельзя первы парематром указать notes.map((item) => item.Number) поэтому создаю глобальную переменную
  
// ctx.reply(notes.map((item) => `${item.Number}`));
//   return ctx.reply('Что именно?', Markup.inlineKeyboard([
//     Markup.callbackButton('Изменить время', 'change'),
//   ]).extra());
// });

bot.launch();
