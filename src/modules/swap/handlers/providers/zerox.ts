import MEWPClass from './mew-provider-class';
import { ETH } from '@/utils/networks/types';
import Web3 from 'web3/types';
class ZeroX {
  constructor(web3: Web3, chain: string) {
    return new MEWPClass(
      MEWPClass.supportedDexes.ZERO_X,
      web3,
      [ETH.name],
      chain
    );
  }
}
export default ZeroX;
