import MofaScholarshipService from "./scholarship/mofa.gov.bd";
import {ShedScholarshipService} from "./scholarship/shed.gov.bd";
import {send_message_to_chat} from "./services/telegram/bot";
import {FirebaseAdminService} from "./services/firebase/firebase_admin/firebase_admin.service";
import {CronJob} from "cron";
import process from "node:process";
import * as console from "node:console";

const firebase_service = new FirebaseAdminService();
const services = [
    new MofaScholarshipService(firebase_service),
    new ShedScholarshipService(firebase_service),
]
let count = 0;
const main = async () => {
    count++;
    console.log(`Running main function ${count} times\nI'm in ${process.env.NODE_ENV || "development"} mode`);
    for (const service of services) {
        try {
            const new_data = await service.requestNewData();

            if (new_data.length > 0) {
                const messageContent = `🚀 Exciting News! A new scholarship opportunity is now available on ${service.get_name()}! 🌟 \n\nDon't miss out—check it out here: ${service.get_url()} 🎓\n\n📩 Got feedback or questions? Reach out to @ma5bah — we'd love to hear from you! 📨`;

                const {
                    ok: ok_1,
                    message: message_1
                } = await send_message_to_chat("@scholarship_machine", messageContent);
                const {
                    ok: ok_2,
                    message: message_2
                } = await send_message_to_chat("@scholarship_machine_official", messageContent);


                if (!ok_1) {
                    console.error(`Error sending message for ${service.constructor.name}:`, message_1);
                }
                if (!ok_2) {
                    console.error(`Error sending message for ${service.constructor.name}:`, message_2);
                }
                // Wait for 1 second before sending the next message
                await new Promise((resolve) => setTimeout(resolve, 1000));
                break;
            }

        } catch (error) {
            console.error(`Error processing ${service.constructor.name}:`, error);
        }
    }
};
// console.log( process.env.CRON_TIME || "* * * * *" );
new CronJob(
    // "0 4-10,12-21/2 * * *", // cronTime
    process.env.CRON_TIME || "* * * * *", // cronTime
    async function () {
        await main();
    }, // onTick
    null, // onComplete
    true, // start
    'Asia/Dhaka' // timeZone
);


