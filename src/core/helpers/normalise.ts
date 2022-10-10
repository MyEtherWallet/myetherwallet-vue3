import * as nameHashPckg from "eth-ens-namehash";
const normalise = function (str: string) {
  return nameHashPckg.normalize(str);
};

export default normalise;
