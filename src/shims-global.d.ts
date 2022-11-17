import { ExternalProvider } from '@ethersproject/providers';

export {};
declare global {
  interface Window {
    opera?: any;
    MSStream?: any;
    ethereum?: Ethereum;
    Piwik?: Matomo;
  }
  const BUILD: 'production' | 'development';
}
interface Ethereum extends ExternalProvider, CustomEthereum {}

type CustomEthereum = {
  isMewWallet: any;
  isTrust: any;
  isMetaMask: any;
  isEnkrypt: any;
};

interface Matomo {
  getTracker: (trackerUrl: string, siteId: string) => MatomoObject;
  getAsyncTracker: (
    optionalMatomoUrl?: string,
    optionalMatomoSiteId?: string
  ) => MatomoObject;
}
type MatomoObject = {
  trackPageView: (customTitle?: string) => void;
  trackEvent: (
    category: string,
    action: string,
    name?: string,
    value?: string
  ) => void;
};
