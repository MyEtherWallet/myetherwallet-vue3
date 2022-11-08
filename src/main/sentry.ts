import * as Sentry from '@sentry/vue';
import { Integrations } from '@sentry/tracing/types';
// import { EventBus } from '@/core/plugins/eventBus';
// import errorHandler from '@/main/errorHandler';
import { useGlobalStore } from '@/stores/global';
import { useWalletStore } from '@/stores/wallet';
// Sentry
Sentry.init({
  dsn: 'https://82c2004a8ba740e1b80f8589f9ca1770@o382951.ingest.sentry.io/5652727',
  integrations: [new Integrations.BrowserTracing()],
  maxBreadcrumbs: 0,
  environment: 'web',
  //requestBodies: 'small',
  autoSessionTracking: false,
  // release: NODE_ENV === 'production' ? VERSION : 'develop',
  beforeSend(event, hint) {
    // eslint-disable-next-line
    console.error(hint.originalException || hint.syntheticException);

    const globalStore = useGlobalStore();
    const network = globalStore.network ? globalStore.network.type.name : '';
    const service = globalStore.network ? globalStore.network.service : '';

    const walletStore = useWalletStore();
    const identifier = walletStore.identifier ? walletStore.identifier : '';
    event.tags = {
      network: network,
      service: service,
      walletType: identifier
    };
    const err = event.exception?.values?.[0].value;
    //if (errorHandler(err)) return null;
    return new Promise(resolve => {
      //EventBus.$emit('issueModal', event, resolve);
    }).then(res => {
      return res === true ? event : null;
    });
  }
});
