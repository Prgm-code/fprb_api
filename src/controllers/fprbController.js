
const GSScrapers = require('../fprb/puppeteer/GSScrapers.js');
const postGeneratorParameters = require('../fprb/postcontrollers/postGeneratorRelatedController.js');
const SRPScrapers = require('../fprb/puppeteer/SRPScrapers.js');
const postSystemRelatedParameters = require('../fprb/postcontrollers/postSystemRelatedController.js');
const browserObject = require('../fprb/browser.js');


exports.getGeneratorRelatedValues = async (req, res) => {
    try {
        const browserInstance = await browserObject.startBrowser();
        const generatorRelatedValues =  await GSScrapers.scraper(browserInstance);
        console.log(generatorRelatedValues);
        res.json(generatorRelatedValues);
        } catch (error) {
            console.log(error);
        }
}

exports.postGeneratorRelatedValues = async (req, res) => {
    try {
        const data = req.body;
        console.log('data:',data);
        const response = await postGeneratorParameters(data);
        console.log(response);
        res.status(200).json(response);

   
        } catch (error) {
        
            console.log(error);
            res.status(500).json(error);
        }
}


exports.getSystemRelatedValues = async (req, res) => {
    try {
        const browserInstance = await browserObject.startBrowser();
        const systemRelatedValues =  await SRPScrapers.scraper(browserInstance);
        console.log(systemRelatedValues);
        res.json(systemRelatedValues);
        } catch (error) {
            console.log(error);
        }
}

exports.postSystemRelatedValues = async (req, res) => {
    const data = req.body;
    console.log('data:',data);
    try {
        

        const response = await postSystemRelatedParameters(data);   
        console.log(response);
        res.status(200).json(response);

        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
}