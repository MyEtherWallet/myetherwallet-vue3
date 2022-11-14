import { ExternalProvider } from '@ethersproject/providers';

export {};
declare global {
  interface Window {
    opera?: any;
    MSStream?: any;
    ethereum?: Ethereum;
  }
}
interface Ethereum extends ExternalProvider, CustomEthereum {}

type CustomEthereum = {
  isMewWallet: any;
  isTrust: any;
  isMetaMask: any;
  isEnkrypt;
};
