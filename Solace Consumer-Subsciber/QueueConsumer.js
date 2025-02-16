require('dotenv').config();
const solace = require('solclientjs').debug;

const factoryProps = new solace.SolclientFactoryProperties();
factoryProps.profile = solace.SolclientFactoryProfiles.version10;
solace.SolclientFactory.init(factoryProps);

const sessionProperties = {
  url: process.env.SOLACE_URL || "wss://mr-connection-okms9u4jc2o.messaging.solace.cloud:443",  
  vpnName: process.env.SOLACE_VPN || "messaging",  
  userName: process.env.SOLACE_USERNAME || "solace-cloud-client",  
  password: process.env.SOLACE_PASSWORD || "r5b2e07qrmp5atd58p8uan8kkk"
};

console.log("Session Properties:", sessionProperties);

async function consumeMessages(queueName) {
  return new Promise((resolve, reject) => {
    if (!queueName) {
      return reject(new Error('Queue name is required.'));
    }

    const session = solace.SolclientFactory.createSession(sessionProperties);

    const messages = [];

    session.on(solace.SessionEventCode.UP_NOTICE, () => {
      console.log('[Consumer] Connected to Solace!');

      const messageConsumer = session.createMessageConsumer({
        queueDescriptor: { name: queueName, type: solace.QueueType.QUEUE },
        acknowledgeMode: solace.MessageConsumerAcknowledgeMode.CLIENT,
      });

      messageConsumer.on(solace.MessageConsumerEventName.UP, () => {
        console.log('[Consumer] Ready to receive messages from queue:', queueName);
      });

      messageConsumer.on(solace.MessageConsumerEventName.MESSAGE, (message) => {
        const payload = message.getBinaryAttachment();
        const timestamp = new Date().toISOString();
        console.log(`[Consumer] Received message: "${payload}" at ${timestamp}`);
        messages.push({ payload, timestamp });
        message.acknowledge();
      });

      messageConsumer.connect();

      // Collect messages for 3 seconds before disconnecting
      setTimeout(() => {
        messageConsumer.disconnect();
        session.disconnect();
        resolve(messages);
      }, 3000);
    });

    session.on(solace.SessionEventCode.CONNECT_FAILED_ERROR, (event) => {
      console.error('[Consumer] Connection failed:', event.infoStr);
      reject(new Error('Connection to Solace failed.'));
    });

    session.on(solace.SessionEventCode.DISCONNECTED, () => {
      console.log('[Consumer] Disconnected.');
    });

    try {
      session.connect();
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { consumeMessages };
