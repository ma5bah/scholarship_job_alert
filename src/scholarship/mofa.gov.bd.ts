const url = 'https://mofa.gov.bd/site/page/4d3e5b27-0827-435f-b31f-47917510962b/Scholarships';

const options = {
  method: 'GET',
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
    'sec-ch-ua-platform': '"macOS"'
  }
};


import * as dom from "jsdom"
interface MofaScholarship {

    name: string;
    date_of_creation: string;
    file: string;
}

const parse_link = (text_data: string) => {
    const link = text_data.match(/href="([^"]*)/)
    return link[1];
}
const parse_html = async (html: string) => {
    const html_dom = new dom.JSDOM(html)
    // table tag with attribute border
    const table = html_dom.window.document.querySelector('table[border]')
    const rows = table.getElementsByTagName("tr")
    let count = 0
    let ret_data: MofaScholarship[] = []
    for (const row of rows) {
        if (count == 0) {
            count++;
            continue;
        }
        const columns = row.getElementsByTagName("td");
        const data: MofaScholarship = {
            name:columns[0].textContent.trim(),
            date_of_creation: columns[1].textContent.trim(),
            file: parse_link(columns[0].innerHTML)
        }
        ret_data.push(data);
        console.log(data);
        count++;
    }
    return ret_data;
}

export const mofa_gov_bd = async () => {
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
