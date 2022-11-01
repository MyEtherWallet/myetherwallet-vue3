import MEWPClass from './mew-provider-class';
import { ETH } from '@/utils/networks/types';
class ZeroX {
  constructor(web3: any, chain: string) {
    return new MEWPClass(
      MEWPClass.supportedDexes.ZERO_X,
      web3,
      [ETH.name],
      chain
    );
  }
}
export default ZeroX;
