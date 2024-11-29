const url = "https://shed.gov.bd/site/view/scholarship/%E0%A6%B6%E0%A6%BF%E0%A6%95%E0%A7%8D%E0%A6%B7%E0%A6%BE%E0%A6%AC%E0%A7%83%E0%A6%A4%E0%A7%8D%E0%A6%A4%E0%A6%BF-%E0%A6%AC%E0%A6%BF%E0%A6%9C%E0%A7%8D%E0%A6%9E%E0%A6%AA%E0%A7%8D%E0%A6%A4%E0%A6%BF"

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

import * as dom from "jsdom"
interface IShedScholarship {
    id: string;
    name: string;
    date_of_creation: string;
    file: string;
    online_application_link: string;
}

const parse_link = (text_data: string) => {
    const link = text_data.match(/href="([^"]*)/)
    return link[1];
}
const parse_html = async (html: string) => {
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
        const data: IShedScholarship = {
            id: columns[0].textContent,
            name: columns[1].textContent.trim(),
            date_of_creation: columns[2].textContent,
            file: parse_link(columns[3].innerHTML),
            online_application_link: parse_link(columns[4].innerHTML),
        }
        ret_data.push(data);
        console.log(data);
        count++;
    }
    return ret_data;
}

export const shed_gov_bd = async () => {
    try {
        const response = await fetch(url, {
            method: 'GET',
            // headers: headers,
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.text();
        const parsed_html = await parse_html(data);
        return parsed_html;
    }
    catch (error) {
        console.error('Error:', error);
    }
};
