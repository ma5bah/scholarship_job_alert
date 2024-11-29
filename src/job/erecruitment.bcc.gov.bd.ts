const url = 'https://erecruitment.bcc.gov.bd/exam/Home/allNewsAjax';

const headers = {
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Accept-Language': 'en-GB,en;q=0.9',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Cookie': 'SERVERID=server_01',
    'Host': 'erecruitment.bcc.gov.bd',
    'Origin': 'https://erecruitment.bcc.gov.bd',
    'Pragma': 'no-cache',
    'Referer': 'https://erecruitment.bcc.gov.bd/exam/Home/AllNews?lang=bn',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-GPC': '1',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest',
    'sec-ch-ua': '"Brave";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
};


interface bcc_news {
    id: number,
    title: string,
    title_en: string,
    expiration_date: string,
}
export interface bcc_response {
    status: boolean,
    msg: string,
    news: bcc_news[]
}

export const erecruitment_bcc_gov_bd = async () => {
    const body = new URLSearchParams();
    body.append('lid', '50000');
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: body.toString(),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data:bcc_response = await response.json() as bcc_response;
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}
