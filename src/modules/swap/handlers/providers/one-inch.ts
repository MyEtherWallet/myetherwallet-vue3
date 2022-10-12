import MEWPClass from './mew-provider-class';
import { ETH, BSC, MATIC } from '@/utils/networks/types';
import Web3 from 'web3/types';
class OneInch {
  constructor(web3: Web3, chain: string) {
    return new MEWPClass(
      MEWPClass.supportedDexes.ONE_INCH,
      web3,
      [ETH.name, BSC.name, MATIC.name],
      chain
    );
  }
}
export default OneInch;
