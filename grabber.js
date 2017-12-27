const puppeteer = require('puppeteer');
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

const token = '529306444:AAEkZEbD5Xw7dhZ-17CMv4C88d6whH0qXYY';
// 529306444:AAEkZEbD5Xw7dhZ-17CMv4C88d6whH0qXYY
const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/echo (.+)/, (msg, match) => {
	// 'msg' is the received Message from Telegram
	// 'match' is the result of executing the regexp above on the text content
	// of the message

	const chatId = msg.chat.id;
	const resp = match[1]; // the captured "whatever"

	// send back the matched "whatever" to the chat
	bot.sendMessage(chatId, resp);
});

bot.on('message', (msg) => {
	console.log(msg);
	const chatId = msg.chat.id;
	const cardName = msg.text;
	bot.sendMessage(chatId, 'wait');
	getData(cardName, msg).then(()=>{
		const photo = fs.readFileSync(`./${msg.chat.username}example.png`);
		bot.sendPhoto(chatId, photo);
	})
});

async function getData(data, msg, height = 1000) {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	page.setViewport({width: 710, height: height});
	await page.goto(`http://sales.starcitygames.com/search.php?substring=${data}&go.x=0&go.y=0&go=GO&t_all=All&start_date=2010-01-29&end_date=2012-04-22&order_1=finish&limit=25&action=Show%2BDecks&card_qty%5B1%5D=1`);
	console.log(msg.chat.id);
	await page.screenshot({path: `./${msg.chat.username}example.png`});
	await browser.close();
}


