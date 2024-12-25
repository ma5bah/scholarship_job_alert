import {Telegraf} from 'telegraf';
import {MyContext} from "../models/context.model";
import {setupCommandActionHears} from "../utils/setup";
import {remove_authorized_firebase_user} from "../services/session.service";

async function _internal_logout(ctx: MyContext) {
    await ctx.replyWithDice();
    remove_authorized_firebase_user(ctx);
    return await ctx.reply('You are logged out successfully!');
}


export function setupAuthHandlers(bot: Telegraf<MyContext>) {
    setupCommandActionHears(bot, 'Login', async (ctx: MyContext) => {
        await ctx.scene.enter("login-wizard")
    })

    setupCommandActionHears(bot, 'Logout', _internal_logout);
}



