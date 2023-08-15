const express = require('express');
const router = express.Router();  
const { getGeneratorRelatedValues, 
    getSystemRelatedValues, 
    postGeneratorRelatedValues,
    postSystemRelatedValues } = require('../controllers/fprbmqttController.js');



router.get('/generator', getGeneratorRelatedValues);
router.post('/generator', postGeneratorRelatedValues);
router.get('/system', getSystemRelatedValues);
router.post('/system', postSystemRelatedValues);


module.exports = router;