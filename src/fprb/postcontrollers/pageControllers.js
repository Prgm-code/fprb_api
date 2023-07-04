const pageScrapers = require('../puppeteer/SRPScrapers');
const postScrapers = require('../puppeteer/postScrapers');
const GSScrapers = require('../puppeteer/GSScrapers');
const postGeneratorParameters = require('./postGeneratorRelatedController.js');

async function scrapeAll(browserInstance){
    let browser;
    try{
        browser = await browserInstance;
        // await pageScrapers.scraper(browser);
        //await postScrapers.scraper(browser);
       const generatorRelatedValues =  await GSScrapers.scraper(browser);
       console.log(generatorRelatedValues);
       await new Promise(resolve => setTimeout(resolve, 5000));
         console.log(`Waiting for page to load... `);
         //creamos un nuevo objeto y modificamos el valor de WEBGENSET a 0 dentro de array generatorRelatedValues
         
         const generatorRelatedValues2 = {
            "WEBGENSET": "0",  
            "WEBTURNONLVL": '-45.50',
            "WEBTURNOFFLVL": '05.00',
            "WEBFREQUENCY": '7',
            "WEBSTARTTIME": generatorRelatedValues.WEBSTARTTIME,
            "WEBDURATION": generatorRelatedValues.WEBDURATION,
            "WEBGENTEMPSET": generatorRelatedValues.WEBGENTEMPSET,
            "WEBTURNONTEMP": '33',
            "WEBGENERATORTIME": generatorRelatedValues.WEBGENERATORTIME,
            "WEBGENTEST": '0', // "Generator Signal Test"
            "WEBTURNOFFTEMP": generatorRelatedValues.WEBTURNOFFTEMP,
            "WEBACDETTIME": '600'
        };
        console.log(generatorRelatedValues2);
            

       const response = await postGeneratorParameters(generatorRelatedValues2);

    }
    catch(err){
        console.log("Could not resolve the browser instance => ", err);
    }

}

module.exports = (browserInstance) => scrapeAll(browserInstance)

