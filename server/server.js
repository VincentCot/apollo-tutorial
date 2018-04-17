
import express from 'express';
import {
  graphqlExpress,
  graphiqlExpress,
} from 'graphql-server-express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';

import { schema } from './src/schema';

const PORT = 4000;
const server = express();
const ws = createServer(server);

ws.listen(PORT, () => {
  console.log(`GraphQL Server is now running on http://ec2-34-240-23-55.eu-west-1.compute.amazonaws.com:${PORT}`);
  // Set up the WebSocket for handling GraphQL subscriptions
  new SubscriptionServer({
    execute,
    subscribe,
    schema
  }, {
    server: ws,
    path: '/subscriptions',
  });
});

server.use('*', cors({ origin: 'http://ec2-34-240-23-55.eu-west-1.compute.amazonaws.com:3000' }));

server.use('/graphql', bodyParser.json(), graphqlExpress({
  schema
}));

server.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: `ws://ec2-34-240-23-55.eu-west-1.compute.amazonaws.com:4000/subscriptions`
}));

// server.listen(PORT, () => 
//   console.log(`GraphQL Server is now running on http://localhost:${PORT}`)
// );
