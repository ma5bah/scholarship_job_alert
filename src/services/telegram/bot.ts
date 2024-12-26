import * as dotenv from 'dotenv';
import {Telegraf} from "telegraf";
import {MyContext} from "./models/context.model";



dotenv.config();
const bot_secret_token = process.env.SCHOLARSHIP_BOT_TOKEN!;
const bot = new Telegraf<MyContext>(bot_secret_token);
console.log('Bot token:', bot_secret_token);


// must be the last middleware to process messages
// processMessages(bot);

// bot.launch().then(() => {
//     console.log('Bot is running');
// });

const send_message_to_chat = async (chat_id: string, message: string): Promise<{ ok: boolean, message: any }> => {
    try {
        const response = await bot.telegram.sendMessage(chat_id, message);
        // await bot.context.telegram.sendMessage(chat_id, message);
        return {
            ok: true,
            message: response
        }
    } catch (e) {
        return {
            ok: false,
            message: e
        }
    }
}


export {bot, send_message_to_chat};