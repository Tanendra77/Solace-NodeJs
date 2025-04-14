const solace = require('solclientjs');

solace.SolclientFactory.init({
  profile: solace.SolclientFactoryProfiles.version10
});

let session = null;
let isConnected = false;
let subscribedTopics = new Set();

const connectSession = (onMessage) => {
  if (session && isConnected) return;

  session = solace.SolclientFactory.createSession({
    url: "wss://mr-connection-vbx6wbdxa41.messaging.solace.cloud:443",
    vpnName: "server3-mumbai",
    userName: "solace-cloud-client",
    password: "ta8kfrtgke602k998m37m895vt",
  });

  session.on(solace.SessionEventCode.UP_NOTICE, () => {
    console.log("[Solace] Connected");
    isConnected = true;
  });

  session.on(solace.SessionEventCode.MESSAGE, onMessage);

  session.on(solace.SessionEventCode.DISCONNECTED, () => {
    console.log("[Solace] Disconnected");
    isConnected = false;
  });

  session.connect();
};

const subscribeToTopic = (topic) => {
  if (!isConnected || subscribedTopics.has(topic)) return;

  const solaceTopic = solace.SolclientFactory.createTopic(topic);
  session.subscribe(solaceTopic, true, topic, 10000);
  subscribedTopics.add(topic);
  console.log(`[Solace] Subscribed to: ${topic}`);
};

const unsubscribeFromTopic = (topic) => {
  if (!isConnected || !subscribedTopics.has(topic)) return;

  const solaceTopic = solace.SolclientFactory.createTopic(topic);
  session.unsubscribe(solaceTopic, true, topic, 10000);
  subscribedTopics.delete(topic);
  console.log(`[Solace] Unsubscribed from: ${topic}`);
};

module.exports = {
    connectSession,
    subscribeToTopic,
    unsubscribeFromTopic
  };
  
