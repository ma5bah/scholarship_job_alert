// let count = 0;
// const main = async () => {
//     console.log('Sending message to chat...');
//     const {ok, message} = await send_message_to_chat(process.env.PERSONAL_CHAT_ID!, `Hello world! ${count++}`);
//     if (ok) {
//         console.log('Message sent:', message);
//     } else {
//         console.error('Error sending message:', message);
//     }
// }
// new CronJob(
//     // "0 4-10,12-21/2 * * *", // cronTime
//     "* * * * *", // cronTime
//     async function () {
//         await main();
//     }, // onTick
//     null, // onComplete
//     true, // start
//     'Asia/Dhaka' // timeZone
// );


import MofaScholarshipService from "./scholarship/mofa.gov.bd";
import {ShedScholarshipService} from "./scholarship/shed.gov.bd";
import {send_message_to_chat} from "./services/telegram/bot";

const services = [
    new MofaScholarshipService(),
    new ShedScholarshipService(),
]

const main = async () => {
    for (const service of services) {
        try {
            const new_data = await service.requestNewData();
            for (const data of new_data) {
                const messageContent = `New Scholarship is Available in ${service.name}! Please check the link: ${service.url}`;
                const {ok, message} = await send_message_to_chat("@scholarship_machine", messageContent);

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

main();



