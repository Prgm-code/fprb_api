const mqtt = require('mqtt');
const logger = require('../utils/logger.util');

require('dotenv').config();

class MqttService {
    address = process.env.MQTT_BROKER;
    credentials = {
        username: process.env.MQTT_USERNAME,
        password: process.env.MQTT_PASSWORD,
        will: {
            topic: 'FPRB/alertas',
            payload: 'El cliente BackEnd se ha desconectado inesperadamente',
            qos: 1,
            retain: true
        }
    };

    client = null;
    connecting = false;

    observers = [];  // Lista para los observadores

     
    // Aquí vamos a añadir la instancia Singleton
    static instance = null;

    // Método para obtener la instancia Singleton
    static getInstance() {
        if (!MqttService.instance) {
            MqttService.instance = new MqttService();
        }
        return MqttService.instance;
    }

    // Haz el constructor privado para evitar que se creen más instancias desde fuera
    constructor() {
        if (MqttService.instance) {
            throw new Error('Use MqttService.getInstance() para obtener una instancia de MqttService');
        }
        // Resto del código del constructor (si lo hubiera)
    }

    async connectToBroker() {
        if (this.connecting) {
            logger.info('Connection already in progress', { service: 'MqttService.connectToBroker' });
            return this.client;
        }

        this.connecting = true;
        try {
            if (this.client) {
                logger.info('Connection already established', { service: 'MqttService._connectToBroker' });
                return(this.client);
            }
            const client = await this._connectToBroker(this.address, this.credentials);
            logger.info('Connection established successfully', { service: 'MqttService._connectToBroker' });
            this.setClient(client);
            this.connecting = false; // conexión exitosa, resetea la bandera
        } catch (error) {
            logger.error(`Error connecting to MQTT broker, retrying...`, { service: 'MqttService.connectToBroker', error: error.message });
            this.connecting = false; // conexión exitosa, resetea la bandera
            this.client = null;

        }
    }

    _connectToBroker(address, credentials) {
        return new Promise(async (resolve, reject) => {
            if (this.client) {
                logger.info('Connection already established', { service: 'MqttService._connectToBroker' });
                resolve(this.client);
            } else {
                logger.info('Connecting to MQTT broker', { service: 'MqttService._connectToBroker' });
                this.client = await mqtt.connect(address, credentials);

                this.client.on('connect', () => {
                    logger.info('Connected to MQTT broker', { service: 'MqttService._connectToBroker' });
                    this.notifyObservers(this.client);  // Notificar a los observadores
                    resolve(this.client);
                });

                this.client.on('error', (error) => {
                    logger.error('Connection error:', { service: 'MqttService._connectToBroker', error: error.message });
                    reject(new Error('Connection error'));
                });

                this.client.on('offline', () => {
                    logger.warn('MQTT broker is offline', { service: 'MqttService._connectToBroker' });
                    reject(new Error('MQTT broker is offline'));
                });

                this.client.on('close', () => {
                    logger.warn('MQTT connection closed', { service: 'MqttService._connectToBroker' });
                    this.client = null;
                    reject(new Error('MQTT connection closed'));
                });
            }
        });
    }

    async publishMessage(topic, message) {
        try {
            if (!this.client) {
                logger.warn('Client does not exist, attempting to connect...', { service: 'MqttService.publishMessage' });
                await this.connectToBroker();
            }

            return new Promise((resolve, reject) => {
                this.client.publish(topic, message, (error) => {
                    if (error) {
                        logger.error('Error publishing message:', { service: 'MqttService.publishMessage', error: error.message });
                        reject(new Error(error));
                    } else {
                        logger.info('Message published successfully', { service: 'MqttService.publishMessage' });
                        resolve();
                    }
                });
            });

        } catch (error) {
            console.error(error);
            return error;
        }
    }

    async subscribeToTopic(topic) {
        try {
            if (!this.client) {
                logger.warn('Client does not exist, attempting to connect...', { service: 'MqttService.subscribeToTopic' });
                await this.connectToBroker();
            }

            return new Promise((resolve, reject) => {
                this.client.subscribe(topic, (error) => {
                    if (error) {
                        logger.error('Error subscribing to topic:', { service: 'MqttService.subscribeToTopic', error: error.message });
                        reject(new Error(error));
                    } else {
                        logger.info('Subscribed to topic', { service: 'MqttService.subscribeToTopic', topic: topic });
                        resolve();
                    }
                });
            });

        } catch (error) {
            console.error(error);
            return error;
        }
    }

    async listenForMessages(handler) {
        try {
            if (!this.client) {
                logger.warn('Client does not exist, attempting to connect...', { service: 'MqttService.listenForMessages' });
                await this.connectToBroker();
            }

            this.client.on('message', (topic, message) => {
                logger.info('Message received on', { service: 'MqttService.listenForMessages', topic: topic, message: message.toString() });
                handler(topic, message);
            });

        } catch (error) {
            console.error(error);
            return error;
        }
    }

    async disconnect() {
        try {
            if (this.client) {
                logger.info('Disconnecting from MQTT broker', { service: 'MqttService.disconnect' });
                this.client.end();
                this.client = null;
            }
        } catch (error) {
            console.error(error);
            return error ;
        }
    }

    async setClient(client) {
        this.client = client;
    }

    // Métodos para manejar la lógica de observación:

    registerObserver(observer) {
        if (observer && typeof observer.updateClient === 'function') {
            this.observers.push(observer);
        }
    }

    removeObserver(observer) {
        const index = this.observers.indexOf(observer);
        if (index !== -1) {
            this.observers.splice(index, 1);
        }
    }

    notifyObservers(newClient) {
        for (const observer of this.observers) {
            observer.updateClient(newClient);
        }
    }
}

module.exports = MqttService;
