require('dotenv').config();
const solace = require('solclientjs').debug;

// Initialize Solace factory
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

let session = null;

// **Function to publish a message**
function publishMessage(topic, message) {

  console.log("in this");
  return new Promise((resolve, reject) => {
    if (!topic || !message) {
      return reject(new Error('Topic and message are required.'));
    }

    if (!session) {
      session = solace.SolclientFactory.createSession(sessionProperties);

      session.on(solace.SessionEventCode.UP_NOTICE, () => {
        console.log('[Publisher] Connected to Solace!');
        sendMessage(topic, message, resolve, reject);
      });

      session.on(solace.SessionEventCode.CONNECT_FAILED_ERROR, (event) => {
        console.error(`[Publisher] Connection failed: ${event.infoStr}`);
        reject(new Error('Connection to Solace failed.'));
      });

      session.on(solace.SessionEventCode.DISCONNECTED, () => {
        console.log('[Publisher] Disconnected.');
        session = null;
      });

      session.connect();
    } else {
      sendMessage(topic, message, resolve, reject);
    }
  });
}

// **Helper function to send message**
function sendMessage(topic, message, resolve, reject) {
  try {
    const messageObj = solace.SolclientFactory.createMessage();
    messageObj.setDestination(solace.SolclientFactory.createTopicDestination(topic));
    messageObj.setBinaryAttachment(message);
    messageObj.setDeliveryMode(solace.MessageDeliveryModeType.DIRECT);

    session.send(messageObj);
    console.log(`[Publisher] Message published to "${topic}": "${message}"`);
    resolve({ success: true, message: 'Message published successfully.' });
  } catch (error) {
    console.error(`[Publisher] Failed to publish message: ${error}`);
    reject(new Error('Failed to publish message.'));
  }
}

// **Export the function**
module.exports = { publishMessage };
