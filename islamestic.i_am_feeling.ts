import * as dom from "jsdom"
const main = async () => {
    const res = await fetch('https://www.islamestic.com/i-am-feeling/')
    const data = await res.text();
    const html = new dom.JSDOM(data)
    for(const i of html.window.document.getElementsByClassName("ultp-block-item")){
        const inner_html = i.innerHTML;
        const inner_html_dom = new dom.JSDOM(inner_html)
        const a_href = inner_html_dom.window.document.getElementsByTagName("a")[0].getAttribute("href")
        if(!a_href) continue;
        const individual_res = await fetch(a_href)
        const individual_data = await individual_res.text();
        const individual_html = new dom.JSDOM(individual_data)
        const individual_inner_html = individual_html.window.document.getElementsByClassName("entry-content");
        const title = individual_html.window.document.getElementsByClassName("entry-title rt-supports-deeplink")
        for(const j of individual_inner_html){
            const individual_inner_html_dom = new dom.JSDOM(j.innerHTML)    
            console.log(title[0].innerHTML)
            console.log("====================================================")
            const arabic_text_translation = individual_inner_html_dom.window.document.getElementsByTagName("cite")
            for(const k of arabic_text_translation){
                console.log(k.innerHTML)
            }
            console.log();
        }
    }
}

await main()