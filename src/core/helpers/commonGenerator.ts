import { Node } from "@/utils/networks/nodes/types";
import { Hardfork, Common } from "@ethereumjs/common";

const commonGenerator = (network: Node) => {
  return Common.custom({
    chainId: network.type.chainID,
    hardfork: Hardfork.London,
  });
};

export default commonGenerator;
