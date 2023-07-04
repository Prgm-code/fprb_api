const scraperObject = {
    url: 'http://root:default@192.168.88.201/i_sysrelparam.htm',
    async scraper(browser){
        let page = await browser.newPage();
        console.log(`Navigating to System Related Parameters... `);
        await page.goto(this.url, {waitUntil: 'domcontentloaded'});
        
        await new Promise(resolve => setTimeout(resolve, 5000));
        console.log(`Waiting for page to load... `);

        const PLdata = await page.evaluate(() => {
            const scriptTag = Array.from(document.getElementsByTagName('script')).find(script => script.innerHTML.includes('PLdata'));
            
            if (scriptTag) {
              const scriptContent = scriptTag.innerHTML;
              const startIndex = scriptContent.indexOf('PLdata') + 'PLdata = '.length;
              const endIndex = scriptContent.indexOf("';", startIndex);
              const PLdata = scriptContent.substring(startIndex, endIndex).trim();
            
              const PLdataArray = PLdata.replace(/'/g, "").split(";");
            
              return PLdataArray;
            } else {
              return null;
            }
        });
        
        const labels = [
            "WEBNOMOV", // 'Nominal Output Voltage'
            "WEBCCL", // 'Charge Current Limit'
            "WEBBATDISV", // 'Battery Disconnect Voltage'
            "WEBBATRECV", // 'Battery Reconnect Voltage'
            "WEBBATLOWVA", // 'Battery Low Voltage Alarm'
            "WEBBATLOWVW", // 'Battery Low Voltage Warning'
            "WEBBTD", // 'Battery Temperature Alarm High'
            "WEBBTDLOW", // 'Battery Temperature Alarm Low'
            "WEBSBCT", // 'Initial Charge Time'
            "WEBCT", // 'Charge Time'
            "WEBBCT", // 'Boost Charge Time'
            "WEBSEI", // 'System Efficiency Improvement'
            "WEBTSM", // 'Temperature Sensor Shelf A'
            "WEBTSSA", // 'Temperature Sensor Shelf B'
            "WEBTSSB" // 'Temperature Sensor Shelf C'
        ];
        
    
        let result = {};
    
        for (let i = 0; i < labels.length; i++) {
            const label = labels[i];
            result[label] = PLdata[i];
        }
    
        console.log(result);
    
        await browser.close();
    
        return result;
    }
}

module.exports = scraperObject;
