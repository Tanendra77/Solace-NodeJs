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

rl.question('Enter queue name (e.g., tutorial/queue): ', (queueName) => {
  if (!queueName.trim()) {
    console.error('Queue name cannot be empty!');
    process.exit(1);
  }
  runConsumer(queueName.trim());
});

function runConsumer(queue) {
  const consumer = {
    session: null,
    messageConsumer: null,
    queueName: queue,

    log: (message) => console.log(`[Consumer] ${message}`),

    run: function(url, vpnName, userName, password) {
      this.session = solace.SolclientFactory.createSession({
        url: url,
        vpnName: vpnName,
        userName: userName,
        password: password,
      });

      // Session event listeners
      this.session.on(solace.SessionEventCode.UP_NOTICE, () => {
        this.log("Connected to Solace!");
        this.createConsumer();
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

    createConsumer: function() {
      this.messageConsumer = this.session.createMessageConsumer({
        queueDescriptor: { 
          name: this.queueName, 
          type: solace.QueueType.QUEUE 
        },
        acknowledgeMode: solace.MessageConsumerAcknowledgeMode.CLIENT
      });

      // Message Consumer Events
      this.messageConsumer.on(solace.MessageConsumerEventName.UP, () => {
        this.log("Ready to receive messages");
      });

      this.messageConsumer.on(solace.MessageConsumerEventName.MESSAGE, (message) => {
        this.log(`Received message: ${message.getBinaryAttachment()}`);
        message.acknowledge(); // Acknowledge message removal from queue
      });

      try {
        this.messageConsumer.connect();
      } catch (error) {
        this.log(error.toString());
      }
    }
  };

  consumer.run(
    "wss://mr-connection-okms9u4jc2o.messaging.solace.cloud:443",
    "messaging",
    "solace-cloud-client",
    "r5b2e07qrmp5atd58p8uan8kkk"
  );

  process.stdin.resume();
}