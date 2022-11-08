import { WebSocketLink } from '@apollo/client/link/ws';
import {
  InMemoryCache,
  createHttpLink,
  ApolloClient,
  split
} from '@apollo/client/core';
import { getMainDefinition } from '@apollo/client/utilities';
import { onError } from '@apollo/client/link/error';
import * as Sentry from '@sentry/vue';
import { SubscriptionClient } from 'subscriptions-transport-ws/dist';

export function createApolloClient(httpsEndpoint: string, wsEndpoint: string) {
  const httpLink = createHttpLink({
    uri: httpsEndpoint
  });

  const subscriptionClient = new SubscriptionClient(wsEndpoint, {
    lazy: true,
    timeout: 60000,
    reconnect: true
  });

  const websocket = new WebSocketLink(subscriptionClient);

  const onErrorLink = onError(error => {
    if (error.graphQLErrors && process.env.NODE_ENV !== 'production') {
      error.graphQLErrors.map(({ message, locations, path }) => {
        const newError = `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`;
        // eslint-disable-next-line
        console.error(newError);
      });
    }

    if (error.graphQLErrors && process.env.NODE_ENV === 'production') {
      error.graphQLErrors.map(({ message, locations, path }) => {
        const newError = `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`;
        Sentry.captureException(newError);
      });
    }
  });

  const link = split(
    // split based on operation type
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    websocket,
    onErrorLink.concat(httpLink)
  );
  return new ApolloClient({
    link: link,
    cache: new InMemoryCache()
  });
}
