import { isHexString, toBuffer as utilsToBuffer } from "ethereumjs-util";

const toBuffer = (v: string) => {
  if (isHexString(v)) {
    return utilsToBuffer(v);
  }
  return Buffer.from(v);
};
export default toBuffer;
