import {send_message_to_chat} from "./services/telegram/bot";
import {CronJob} from "cron";

let count = 0;
const main = async () => {
    console.log('Sending message to chat...');
    const {ok, message} = await send_message_to_chat(process.env.PERSONAL_CHAT_ID!, `Hello world! ${count++}`);
    if (ok) {
        console.log('Message sent:', message);
    } else {
        console.error('Error sending message:', message);
    }
}
new CronJob(
    // "0 4-10,12-21/2 * * *", // cronTime
    "* * * * *", // cronTime
    async function () {
        await main();
    }, // onTick
    null, // onComplete
    true, // start
    'Asia/Dhaka' // timeZone
);



