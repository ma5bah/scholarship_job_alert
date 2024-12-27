
import MofaScholarshipService from "./scholarship/mofa.gov.bd";
import {ShedScholarshipService} from "./scholarship/shed.gov.bd";
import {send_message_to_chat} from "./services/telegram/bot";
import {FirebaseAdminService} from "./services/firebase/firebase_admin/firebase_admin.service";
import {CronJob} from "cron";
const firebase_service=new FirebaseAdminService();
const services = [
    new MofaScholarshipService(firebase_service),
    new ShedScholarshipService(firebase_service),
]

const main = async () => {
    for (const service of services) {
        try {
            const new_data = await service.requestNewData();


            if (new_data.length > 0) {
                const messageContent = `🚀 Exciting News! A new scholarship opportunity is now available on ${service.get_name()}! \n🌟 Don't miss out—check it out here: ${service.get_url()} 🎓`;

                // const {ok, message} = await send_message_to_chat("@scholarship_machine", messageContent);
                const {ok, message} = await send_message_to_chat("@scholarship_machine_official", messageContent);


                if (!ok) {
                    console.error(`Error sending message for ${service.constructor.name}:`, message);
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

new CronJob(
    // "0 4-10,12-21/2 * * *", // cronTime
    "*/10 * * * *", // cronTime
    async function () {
        await main();
    }, // onTick
    null, // onComplete
    true, // start
    'Asia/Dhaka' // timeZone
);


