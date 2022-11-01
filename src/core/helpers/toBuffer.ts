import { isHexString, toBuffer as utilsToBuffer } from 'ethereumjs-util/dist';

const toBuffer = (v: string) => {
  if (isHexString(v)) {
    return utilsToBuffer(v);
  }
  return Buffer.from(v);
};
export default toBuffer;
