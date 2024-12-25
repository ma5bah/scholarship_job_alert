import {Telegraf} from 'telegraf';
import {MyContext} from "../models/context.model";
import {get_profile_info, get_total_due} from "../services/profile.service";
import {setupCommandActionHears} from "../utils/setup";
import {get_authorized_firebase_user} from "../services/session.service";



export function setupInfoHandlers(bot: Telegraf<MyContext>) {
    setupCommandActionHears(bot, 'Total Due', async (ctx) => {
        return await _internal_total_due(ctx);
    })


    setupCommandActionHears(bot, 'Profile', async (ctx) => {
        return await _internal_profile(ctx);
    });
}

async function _internal_profile(ctx: MyContext) {
    const user = await get_authorized_firebase_user(ctx);
    if (!user) {
        await ctx.reply('You need to login first!');
        return;
    }
    const data = await get_profile_info(user.access_token);
    console.log('Data:', data);
    return await ctx.reply(`Name: ${data.name}\nEmail: ${data.email}\nRole: ${data.role}\nCollege: ${data.college_name}\nBatch: ${data.batch_name}\nAddress: ${data.address}\nBalance: ${data.balance}\nEnrolled Courses: ${data.enrolled_course_name.join(', ')}`);
}
async function _internal_total_due(ctx: MyContext) {
    await ctx.sendSticker("https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExcTBqdWJvejJrbG9ocGt3NnB1bmcwajMzczZhNjE3ZWo2MzRqNnVqciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/tXL4FHPSnVJ0A/giphy.gif")

    const user = await get_authorized_firebase_user(ctx);

    if (!user) {
        await ctx.reply('You need to login first!');
        return;
    }
    const data = await get_total_due(user.access_token);
    console.log('Data:', data);
    return await ctx.reply(`Total due: ${data.total_due}`);
}



