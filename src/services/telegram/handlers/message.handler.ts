import {Telegraf} from 'telegraf';
import {message} from "telegraf/filters";
import {MyContext} from "../models/context.model";
import {find_or_create_my_session} from "../services/session.service";


export function processMessages(bot: Telegraf<MyContext>) {
    bot.on(message("text"), async (ctx) => {

        const user_session = find_or_create_my_session(ctx);

        console.log(ctx.message.text);
    });
}
