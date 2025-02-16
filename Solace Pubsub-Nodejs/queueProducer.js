const solace = require('solclientjs').debug;

// Initialize Solace factory
const factoryProps = new solace.SolclientFactoryProperties();
factoryProps.profile = solace.SolclientFactoryProfiles.version10;
solace.SolclientFactory.init(factoryProps);

let session;

function runProducer(queue, messageText, url, vpnName, userName, password) {
  return new Promise((resolve, reject) => {
    if (!queue.trim()) {
      return reject('Queue name cannot be empty!');
    }

    session = solace.SolclientFactory.createSession({
      url,
      vpnName,
      userName,
      password,
      publisherProperties: {
        acknowledgeMode: solace.MessagePublisherAcknowledgeMode.PER_MESSAGE, // Ensure messages are acknowledged
      }
    });

    session.on(solace.SessionEventCode.UP_NOTICE, () => {
      console.log(`[Producer] Connected to Solace!`);
      setTimeout(() => {  // Ensure session is fully ready
        sendMessage(queue, messageText).then(resolve).catch(reject);
      }, 2000);  // Wait for 2 seconds
    });

    session.on(solace.SessionEventCode.CONNECT_FAILED_ERROR, (event) => {
      console.error(`[Producer] Connection failed: ${event.infoStr}`);
      reject(`Connection failed: ${event.infoStr}`);
    });

    session.on(solace.SessionEventCode.DISCONNECTED, () => {
      console.log(`[Producer] Disconnected.`);
      session = null;
    });

    try {
      session.connect();
    } catch (error) {
      reject(`Session connection error: ${error.toString()}`);
    }
  });
}

function sendMessage(queue, messageText) {
  return new Promise((resolve, reject) => {
    if (!session) {
      return reject("Not connected to Solace!");
    }

    try {
      const message = solace.SolclientFactory.createMessage();
      message.setDestination(solace.SolclientFactory.createDurableQueueDestination(queue));
      message.setBinaryAttachment(messageText);
      message.setDeliveryMode(solace.MessageDeliveryModeType.PERSISTENT);

      session.send(message, (error) => {
        if (error) {
          reject(`Error sending message: ${error.toString()}`);
        } else {
          console.log(`[Producer] Message sent to queue "${queue}": ${messageText}`);
          resolve(`Message sent to queue "${queue}"`);
        }
      });
    } catch (error) {
      reject(`Error sending message: ${error.toString()}`);
    }
  });
}

module.exports = { runProducer };
