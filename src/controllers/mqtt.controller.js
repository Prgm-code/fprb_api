const MqttService = require('../services/mqttConnection.service.js');
const logger = require('../utils/logger.util.js');

const mqttService = MqttService.getInstance();  // Get the Singleton instance;  // Create a new instance

function updateMqttClient(newClient) {
    mqttService.setClient(newClient);
    console.log('MQTT client updated');
}

// Register mqttClient as an observer for the MQTT Service
mqttService.registerObserver({
    updateClient: updateMqttClient
});

async function initialize() {
    try {
        await mqttService.connectToBroker();
        logger.info("MQTT client initialized successfully", { service: 'mqttClient.initialize' });
    } catch (error) {
        logger.error(`Error initializing MQTT client: ${error.message}`, { service: 'mqttClient.initialize' });
        return error;
    }
}

async function publishMessage(topic, message) {
    try {
        return await mqttService.publishMessage(topic, message);
    } catch (error) {
        logger.error(`Error publishing message: ${error.message}`, { service: 'mqttClient.publishMessage' });
        return error;
    }
}

async function subscribeToTopic(topic) {
    try {
        return await mqttService.subscribeToTopic(topic);
    } catch (error) {
        logger.error(`Error subscribing to topic: ${error.message}`, { service: 'mqttClient.subscribeToTopic' });
        return error;
    }
}

function listenForMessages(handler) {
    try {
        return mqttService.listenForMessages(handler);
    } catch (error) {
        logger.error(`Error listening for messages: ${error.message}`, { service: 'mqttClient.listenForMessages' });
        return error;
    }
}

async function mqttClose() {
    try {
        await mqttService.disconnect();
    } catch (error) {
        logger.error(`Error closing mqtt: ${error.message}`, { service: 'mqttClient.mqttClose' });
        return error;
    }
}

module.exports = {
    initialize,
    publishMessage,
    subscribeToTopic,
    listenForMessages,
    mqttClose
};
