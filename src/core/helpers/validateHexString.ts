import { isHexStrict } from "web3-utils/types";

const validateHexString = (str: string): boolean => {
  if (str === "") return true;
  return isHexStrict(str);
};

export default validateHexString;
