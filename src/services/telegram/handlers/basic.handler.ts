import {Markup, Telegraf} from 'telegraf';
import {MyContext} from "../models/context.model";
import {setupCommandActionHears} from "../utils/setup";


export function setupBasicHandlers(bot: Telegraf<MyContext>) {
    setupCommandActionHears(bot, 'Start', _internal_start);
    setupCommandActionHears(bot, 'Help', _internal_help);

}

async function _internal_help(ctx: MyContext) {

    return ctx.reply(`
Available commands:
/start - Start interacting with the bot and receive a welcome message. Usage: /start
/viewcourses - View a list of all enrolled courses and their individual payment statuses. Usage: /viewcourses
/notifications - View recent notifications related to courses or payments. Usage: /notifications
/paycourse - Pay a specific amount towards the due for a selected course. Usage: /paycourse <course_name> <amount>
/courseinfo - Get detailed information about a specific course, including its description, schedule, and fees. Usage: /courseinfo <course_name>
        `,
    {
    reply_markup: {
        is_persistent: true,
        inline_keyboard: [
            [
                {text: 'Help', callback_data: 'help'},
                {text: 'Login', callback_data: 'login'},
                // {text: 'Notifications', callback_data: 'notifications'},
            ], [
                {text: 'Logout', callback_data: 'logout'},
                {text: 'Profile', callback_data: 'profile'},
                {text: 'Total Due', callback_data: 'total_due'}
            ],
            // [
            //     {text: 'Pay Course', callback_data: 'paycourse'},
            //     {text: 'Course Info', callback_data: 'courseinfo'},
            //     {text: 'View Courses', callback_data: 'viewcourses'}
            // ]
        ]
    }
})
}

async function _internal_start(ctx: MyContext) {
    return ctx.reply(`Welcome to Vector Classes! 🚀
We’re here to inspire and guide you toward success. Whether you’re aiming for top universities or looking for direction, we’ve got the resources and support you need. Let’s embark on this journey together and reach new heights!
`,
        Markup.keyboard(
            [
                [Markup.button.callback("Help", "help"), Markup.button.callback("Login", "login")],
                [Markup.button.callback("Logout", "logout"), Markup.button.callback("Profile", "profile"), Markup.button.callback("Total Due", "total_due")]
            ]
        ).resize().persistent(true)
    );
}

