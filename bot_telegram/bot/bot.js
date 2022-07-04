require('dotenv').config()
const { Telegraf } = require('telegraf')
const axios = require('axios')

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.help(ctx => {
    const helpMessage = `
    *Purocodigo frases bot*
    /start - Iniciar bot
    `

    bot.telegram.sendMessage(ctx.from.id, helpMessage, {
        parse_mode: "Markdown"
    })
})

bot.command('start', ctx => {
    sendStartMessage(ctx);
})

function sendStartMessage (ctx) {
    const startMessage = "Hola Bienvenid@, Soy un bot de Restaurante los angeles";

    bot.telegram.sendMessage(ctx.chat.id, startMessage, {
        reply_markup: {
            inline_keyboard: [
                [
                    {text: "Quiero todas las categorias del restaurante", callback_data: 'quote'}
                ],
                [
                    {text: "Ubicacion", url: "https://www.google.com/maps/dir/-18.038784,-70.2447616/-17.9849478,-70.2118099/@-17.9888351,-70.2657538,13z/data=!4m4!4m3!1m1!4e1!1m0"}
                ],
                [
                    {text: "Creditos", callback_data: 'credits'}
                ]
            ]
        }
    })
}

bot.action('credits', ctx => {
    ctx.answerCbQuery();
    ctx.reply('Este ChatBot fue creado por Alexander Huallpa, Jenny Anahua y Kiara coloma');
})

bot.action('quote', ctx => {
    ctx.answerCbQuery();

    const menuMessage = "¿Que tipo de alimento o bebida estas buscando?"
    bot.telegram.sendMessage(ctx.chat.id, menuMessage, {
        reply_markup: {
            keyboard: [
                [
                    { text: "Carnes y parrillas" },
                    { text: "Postres" },
                    { text: "Bebidas" }
                ],
                [
                    { text: "Salir" }
                ]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    })
    
})

async function fetchQuote(type) {
    const res = await axios.get('http://localhost:3000/quotes/' + type);
    return res.data.quote;
}

bot.hears('Carnes y parrillas', async (ctx) => {
    const quote = await fetchQuote('carnes')
    ctx.reply(quote);
})

bot.hears('Postres', async (ctx) => {
    const quote = await fetchQuote('postres')
    ctx.reply(quote);
})

bot.hears('Bebidas', async (ctx) => {
    const quote = await fetchQuote('bebidas')
    ctx.reply(quote);
})

bot.hears('Salir', ctx => {
    bot.telegram.sendMessage(ctx.chat.id, "Muchas gracias por tu visita ;)", {
        reply_markup: {
            remove_keyboard: true
        }
    })
})

bot.launch();