const puppetter = require('puppeteer');

async function startBrowser(){
        let browser;
        try {
            console.log("Opening the browser......");
            browser = await puppetter.launch({
                headless: 'new',
                args: ["--disable-setuid-sandbox"],
                'ignoreHTTPSErrors': true
            });
        } catch (error) {   
            console.log("Could not create a browser instance => : ", error);
        }
        return browser;
}

module.exports = {
    startBrowser
};

