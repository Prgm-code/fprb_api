
const createError = require('http-errors');
const mqtt = require('./mqtt.controller.js')
const logger = require('../utils/logger.util.js');


exports.handleMqttInit = async () => {
    try {
        await mqtt.initialize();

        await mqtt.subscribeToTopic('FPRB/response');
    } catch (error) {
        console.log(error);
    }
}

let responseValues = {
    generatorValues: null,
    systemValues: null

}

exports.handleMqttMessage = async  () => {
    await mqtt.listenForMessages(async (topic, message) => {
        let data = null;

        logger.info(`Mensaje recibido en ${topic}: ${message}`, { service: 'mqttClient.listenForMessages' });

        try {
            data = JSON.parse(message);
        } catch (error) {
            logger.error(`Error al parsear el mensaje: ${error.message}`, { service: 'mqttClient.listenForMessages' });
        }

        if (!data) {
            logger.error(`mensaje vacío`, { service: 'mqttClient.listenForMessages' });
        }

        console.log('mensaje recibido :', data);
        console.log('data.Payload:', data?.payload);

        if (data?.responseData === 'getGenerator') {
            console.log('FPRB/Response :', data);
            if (resolver) {
                resolver(data?.payload);
                resolver = null;
            }
            responseValues.generatorValues = data?.payload;
        }
        
        if (data?.responseData === 'getSystem') {
            console.log('FPRB/Response :', data);
            if (resolver) {
                resolver(data?.payload);
                resolver = null;
            }
            responseValues.systemValues = data?.payload;
        }
    });
}





exports.getGeneratorRelatedValues = async (req, res, next) => {
    try {
        mqtt.publishMessage('FPRB/control', JSON.stringify({ getData: 'getGenerator' }));
        // Espera la respuesta o timeout
        const result = await new Promise((resolve, reject) => {
            resolver = resolve;  // Establecer el resolver globalmente para que pueda ser llamado desde handleMqttMessage

            // Establece un timeout para la promesa
            setTimeout(() => {
                if (!responseValues.generatorValues) {
                    reject(new Error("Timeout waiting for generator data"));
                }
            }, 10000);  // Espera 10 segundos antes de rechazar
        });

        // Elimina la respuesta pendiente ya que se ha resuelto
        responseValues.generatorValues = null;

        if (result) {
            res.status(200).json(result);
        } else {
            res.status(500).json({ message: 'Error retrieving generator values (timeout)' });
        }
    } catch (error) {
        next(createError(500, error));
    }
}

exports.postGeneratorRelatedValues = async (req, res, next) => {
    const data = req.body;

    try {

        await mqtt.publishMessage('FPRB/control', JSON.stringify({ postData: 'setGenerator', payload: data }));

        res.status(200).json({ message: 'Generator parameters sent' });

    } catch (error) {

        // Pass the error to the error-handling middleware}
        next(createError(httpErrorCode, error));
    }
}





exports.getSystemRelatedValues = async (req, res, next) => {
    try {

        mqtt.publishMessage('FPRB/control', JSON.stringify({ getData: 'getSystem' }));
        // Espera la respuesta o timeout
        const result = await new Promise((resolve, reject) => {
            resolver = resolve;  // Establecer el resolver globalmente para que pueda ser llamado desde handleMqttMessage

            // Establece un timeout para la promesa
            setTimeout(() => {
                if (!responseValues.systemValues) {
                    reject(new Error("Timeout waiting for generator data"));
                }
            }, 10000);  // Espera 10 segundos antes de rechazar
        });
        // Elimina la respuesta pendiente ya que se ha resuelto
        responseValues.systemValues = null;

        if (result) {
            res.status(200).json(result);

        } else {
            res.status(500).json({ message: 'Error retrieving system values (timeout)' });
        }

    } catch (error) {


        // Pass the error to the error-handling middleware}
        next(createError(500, error));
    }
}

exports.postSystemRelatedValues = async (req, res, next) => {
    const data = req.body;
    try {

        await mqtt.publishMessage('FPRB/control', JSON.stringify({ postData: 'setSystem', payload: data }));

        res.status(200).json({ message: 'System parameters sent' });

    } catch (error) {

        // Pass the error to the error-handling middleware}
        next(createError(httpErrorCode, error));

    }

}


