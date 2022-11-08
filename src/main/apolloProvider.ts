import { createApolloProvider } from '@vue/apollo-option';
import aave from '@/dapps/aave-dapp/apollo';
import { createApolloClient } from '@/core/helpers/createApolloClient';

const main = createApolloClient(
  'https://api-v2.ethvm.dev',
  'wss://apiws-v2.ethvm.dev'
);

const apolloProvider = createApolloProvider({
  clients: {
    main,
    aave: aave
  },
  defaultClient: main
});

export default apolloProvider;
