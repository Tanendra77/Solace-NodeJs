const solace = require('solclientjs').debug;
const readline = require('readline');

// Initialize Solace factory
const factoryProps = new solace.SolclientFactoryProperties();
factoryProps.profile = solace.SolclientFactoryProfiles.version10;
solace.SolclientFactory.init(factoryProps);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Get the topic name from user input
rl.question('Enter topic name to subscribe (e.g., tutorial/topic): ', (topicName) => {
  // Validate topic input
  if (!topicName || topicName.trim() === '') {
    console.error('Topic name cannot be empty!');
    process.exit(1);
  }

  // Start subscriber with the user-provided topic
  runSubscriber(topicName.trim());
});

function runSubscriber(topic) {
  const subscriber = {
    session: null,
    topicName: topic, // Use the user-provided topic

    log: (message) => console.log(`[Subscriber] ${message}`),

    run: function (url, vpnName, userName, password) {
      this.session = solace.SolclientFactory.createSession({
        url: url,
        vpnName: vpnName,
        userName: userName,
        password: password,
      });

      // Session event listeners
      this.session.on(solace.SessionEventCode.UP_NOTICE, () => {
        this.log("Connected to Solace!");
        this.subscribe();
      });

      this.session.on(solace.SessionEventCode.MESSAGE, (message) => {
        this.log(`Received message: ${message.getBinaryAttachment()}`);
      });

      this.session.on(solace.SessionEventCode.SUBSCRIPTION_OK, () => {
        this.log("Subscription confirmed.");
      });

      this.session.on(solace.SessionEventCode.SUBSCRIPTION_ERROR, (event) => {
        this.log("Subscription failed: " + event.infoStr);
      });

      this.session.on(solace.SessionEventCode.DISCONNECTED, () => {
        this.log("Disconnected.");
      });

      try {
        this.session.connect();
      } catch (error) {
        this.log(error.toString());
      }
    },

    subscribe: function () {
      try {
        const topic = solace.SolclientFactory.createTopic(this.topicName);
        this.session.subscribe(
          topic,
          true, // Request confirmation
          this.topicName, // Correlation key
          10000 // Timeout
        );
        this.log(`Subscribed to topic: ${this.topicName}`);
      } catch (error) {
        this.log(error.toString());
      }
    },
  };

  subscriber.run(
    "wss://mr-connection-okms9u4jc2o.messaging.solace.cloud:443",
    "messaging",
    "solace-cloud-client",
    "r5b2e07qrmp5atd58p8uan8kkk"
  );

  // Keep the subscriber running indefinitely
  process.stdin.resume();
}