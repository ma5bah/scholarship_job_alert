import axios from "axios";
import * as dom from "jsdom"
import https from "https";
import {createHash} from "crypto";
import {IScholarship, ScholarshipService} from "../models/abstract";
import {FirebaseAdminService} from "../services/firebase/firebase_admin/firebase_admin.service";

const headers = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Accept-Language': 'en-GB,en;q=0.9',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Cookie': 'nginx_affinity=103.115.27.26; nginx_affinity=103.115.27.26',
    'Host': 'shed.gov.bd',
    'Pragma': 'no-cache',
    'Referer': 'https://www.google.com/',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'cross-site',
    'Sec-Fetch-User': '?1',
    'Sec-GPC': '1',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    'sec-ch-ua': '"Brave";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
};

export interface IShedScholarship extends IScholarship {
    id: string;
    online_application_link: string;
}

const parse_link = (text_data: string) => {
    const link = text_data.match(/href="([^"]*)/)
    return link ? link[1] : ''; // Return an empty string if no match
}

export class ShedScholarshipService extends ScholarshipService<IShedScholarship> {
    constructor(firebaseService: FirebaseAdminService) {
        super(firebaseService); // Only allowed here
    }

    get_url(): string {
        return "https://shed.gov.bd/site/view/scholarship/%E0%A6%B6%E0%A6%BF%E0%A6%95%E0%A7%8D%E0%A6%B7%E0%A6%BE%E0%A6%AC%E0%A7%83%E0%A6%A4%E0%A7%8D%E0%A6%A4%E0%A6%BF-%E0%A6%AC%E0%A6%BF%E0%A6%9C%E0%A7%8D%E0%A6%9E%E0%A6%AA%E0%A7%8D%E0%A6%A4%E0%A6%BF";
    }

    get_name(): string {
        return 'ShedScholarship';
    }


    public async requestNewData(): Promise<IShedScholarship[]> {
        let data = await this._request_new_data()
        const ret_data = this.updateLatestData(data);
        return ret_data;
    }


    protected parse_html(html: string) {
        const html_dom = new dom.JSDOM(html)
        const table = html_dom.window.document.querySelector('table.bordered')
        const rows = table.getElementsByTagName("tr")
        let count = 0
        let ret_data: IShedScholarship[] = []
        for (const row of rows) {
            if (count == 0) {
                count++;
                continue;
            }
            const columns = row.getElementsByTagName("td");
            let file_link = parse_link(columns[3].innerHTML);
            file_link = file_link.split(`//shed.gov.bd`)[1]
            file_link = `https://shed.gov.bd${file_link}`
            const data: IShedScholarship = {
                hashed_id: createHash('sha256').update(file_link).digest('hex'),
                id: columns[0].textContent,
                name: columns[1].textContent.trim(),
                date_of_creation: columns[2].textContent,
                file: URL.parse(file_link).href,
                online_application_link: parse_link(columns[4].innerHTML),
            }
            ret_data.push(data);
            // console.log(data);
            count++;
        }
        return ret_data;
    }

    protected async _request_new_data(): Promise<IShedScholarship[]> {
        try {
            const response = await axios.get(this.get_url(), {
                headers: headers,
                httpsAgent: new https.Agent({rejectUnauthorized: false})
            });
            if (response.status !== 200) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = response.data;
            const parsed_html = this.parse_html(data);
            return parsed_html;
        } catch (error) {
            console.error('Error:', error);
        }
    };

}
