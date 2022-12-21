import { generateMnemonic } from 'bip39';

const phrase12 = (): Array<string> => {
  return generateMnemonic(128).split(' ');
};

const phrase24 = (): Array<string> => {
  return generateMnemonic(256).split(' ');
};

export default {
  phrase12,
  phrase24
};
