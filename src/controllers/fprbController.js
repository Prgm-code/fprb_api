
const GSScrapers = require('../fprb/puppeteer/GSScrapers.js');
const postGeneratorParameters = require('../fprb/postcontrollers/postGeneratorRelatedController.js');
const SRPScrapers = require('../fprb/puppeteer/SRPScrapers.js');
const postSystemRelatedParameters = require('../fprb/postcontrollers/postSystemRelatedController.js');
const browserObject = require('../fprb/browser.js');
const createError = require('http-errors');

exports.getGeneratorRelatedValues = async (req, res, next) => {
    try {
        const browserInstance = await browserObject.startBrowser();
        const generatorRelatedValues =  await GSScrapers.scraper(browserInstance);
        console.log(generatorRelatedValues);
        res.json(generatorRelatedValues);
        } catch (error) {
            console.log(error);
            let httpErrorCode = 500;
            if (error.status) {
                httpErrorCode = error.status;
            }
            // Pass the error to the error-handling middleware}
            next(createError(httpErrorCode, error));

        }
}

exports.postGeneratorRelatedValues = async (req, res, next) => {
    try {
        const data = req.body;
        const response = await postGeneratorParameters(data);
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        let httpErrorCode = 500;
        if (error.status) {
            httpErrorCode = error.status;
        }
        // Pass the error to the error-handling middleware}
        next(createError(httpErrorCode, error));
    }
}





exports.getSystemRelatedValues = async (req, res, next) => {
    try {
        const browserInstance = await browserObject.startBrowser();
        const systemRelatedValues =  await SRPScrapers.scraper(browserInstance);
        console.log(systemRelatedValues);
        res.json(systemRelatedValues);
        } catch (error) {
            console.log(error);
            let httpErrorCode = 500;
            if (error.status) {
                httpErrorCode = error.status;
            }
            // Pass the error to the error-handling middleware}
            next(createError(httpErrorCode, error));
        }
}

exports.postSystemRelatedValues = async (req, res, next) => {
    const data = req.body;
    try {
        const response = await postSystemRelatedParameters(data);   
        console.log(response);
        res.status(200).json(response);
        } catch (error) {
            console.log(error);
            let httpErrorCode = 500;
            if (error.status) {
                httpErrorCode = error.status;
            }
            // Pass the error to the error-handling middleware}
            next(createError(httpErrorCode, error));
          }
}
