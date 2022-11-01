import bip39 from 'bip39/types';

function phrase12(): Array<string> {
  return bip39.generateMnemonic(128).split(' ');
}

function phrase24(): Array<string> {
  return bip39.generateMnemonic(256).split(' ');
}

export default {
  phrase12,
  phrase24
};
