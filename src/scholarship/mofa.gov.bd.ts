import axios from 'axios';
import https from 'https';
import {createHash} from 'crypto';
import * as dom from "jsdom"
import {ScholarshipService} from "../services/abstract";

const options = {
    headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'en-GB,en;q=0.5',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Cookie': 'nginx_affinity=103.115.27.29',
        'Host': 'mofa.gov.bd',
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
    },
};
export interface IMofaScholarship {
    hashed_id: string;
    name: string;
    date_of_creation: string;
    file: string;
}

const parse_link = (text_data: string) => {
    const link = text_data.match(/href="([^"]*)/)
    return link ? link[1] : ''; // Return an empty string if no match
}

export default class MofaScholarshipService extends ScholarshipService<IMofaScholarship> {
    public name: string = "Mofa Scholarship";
    public url = 'https://mofa.gov.bd/site/page/4d3e5b27-0827-435f-b31f-47917510962b/Scholarships';
    public async requestNewData(): Promise<IMofaScholarship[]> {
        let data =  await this._request_new_data();
        const ret_data = this.updateLatestData(data);
        return ret_data;
    }

    protected async _request_new_data(): Promise<IMofaScholarship[]>  {
        try {
            const response = await axios.get(url, {
                headers: options.headers,
                httpsAgent: new https.Agent({rejectUnauthorized: false})
            });
            if (response.status !== 200) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = response.data;
            const parsed_html = this.parse_html(data);
            return parsed_html;
        }
        catch (error) {
            console.error('Error:', error);
        }
    };
    protected parse_html(data: string): IMofaScholarship[]  {
        const html_dom = new dom.JSDOM(data)
        // table tag with attribute border
        const table = html_dom.window.document.querySelector('table[border]')
        const rows = table.getElementsByTagName("tr")
        let count = 0
        let ret_data: IMofaScholarship[] = []
        for (const row of rows) {
            if (count == 0) {
                count++;
                continue;
            }
            const columns = row.getElementsByTagName("td");
            let file_link=parse_link(columns[0].innerHTML);

            const data: IMofaScholarship = {
                hashed_id: createHash('sha256').update(file_link).digest('hex'),
                name:columns[0].textContent.trim(),
                date_of_creation: columns[1].textContent.trim(),
                file: file_link
            }
            ret_data.push(data);
            // console.log(data);
            count++;
        }
        return ret_data;
    }
}