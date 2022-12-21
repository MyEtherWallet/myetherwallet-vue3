import { Node } from '@/utils/networks/nodes/types';
import { Hardfork, Common } from '@ethereumjs/common/src';

const commonGenerator = (network: Node) => {
  return Common.custom({
    chainId: network.type.chainID,
    defaultHardfork: Hardfork.London
  });
};

export default commonGenerator;
