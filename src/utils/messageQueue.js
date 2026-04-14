const amqplib = require('amqplib');
//const { application } = require('express');
const {MESSAGE_BROKER_URL, EXCHANGE_NAME} = require('../config/serverConfig');

const createChannel =  async () => {
    try {
        const connection = await amqplib.connect(MESSAGE_BROKER_URL);
        const channel = await connection.createChannel();
        await channel.assertExchange(EXCHANGE_NAME, 'direct',false);
        return channel;
    } catch (error) {
        throw error;
    }
}


const subscribeMessage = async(channel, service, binding_Key) => {
    try{
    const applicationQueue = await channel.assertQueue('REMINDER_QUEUE');

    channel.bindQueue(applicationQueue.queue, EXCHANGE_NAME, binding_Key);

    channel.consume(applicationQueue.queue, msg => {
        console.log('received data');
        console.log(msg.content.toString());
        
       
       service(msg.channel.toString());
        channel.ack(msg);
    });
    }catch(error){
        throw error;
    }
}

const publishMessage = async(channel, binding_Key, message) => {
    try {
        await channel.assertQueue('REMINDER_QUEUE');
        await channel.publish(EXCHANGE_NAME, binding_Key, Buffer.from(message));
    } catch (error) {
        throw error;
    }
}

module.exports = {
    subscribeMessage, 
    createChannel,
    publishMessage
}   