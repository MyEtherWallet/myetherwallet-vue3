import {
  hashPersonalMessage,
  ecrecover,
  pubToAddress
} from 'ethereumjs-util/dist';
import toBuffer from '@/core/helpers/toBuffer';
import ErrorList from '../errors';
import { useWalletStore } from '@/stores/wallet';

export default class SignAndVerifyMessage {
  signMessage(message: string) {
    try {
      const walletStore = useWalletStore();
      return walletStore
        .web3()
        .eth.sign(message, walletStore.address)
        .then((_signedMessage: string) => {
          const signature = JSON.stringify(
            {
              address: walletStore.address,
              msg: message,
              sig: _signedMessage,
              version: '3',
              signer: walletStore.isHardware ? walletStore.identifier : 'MEW'
            },
            null,
            2
          );
          return signature;
        });
    } catch (e) {
      throw ErrorList.SIGN_FAILED;
    }
  }

  verifyMessage(message: string) {
    try {
      const walletStore = useWalletStore();
      const json = JSON.parse(message);
      let hash = hashPersonalMessage(toBuffer(json.msg));
      const sig = Buffer.from(json.sig.replace('0x', ''), 'hex');
      if (sig.length !== 65) {
        throw ErrorList.INVALID_LENGTH;
      }
      sig[64] = sig[64] === 0 || sig[64] === 1 ? sig[64] + 27 : sig[64];
      if (json.version === '1') {
        hash = walletStore.web3.utils.sha3(json.msg);
      }
      const pubKey = ecrecover(
        hash,
        sig[64],
        sig.slice(0, 32),
        sig.slice(32, 64)
      );
      return {
        verified: !(
          json.address.replace('0x', '').toLowerCase() !==
          pubToAddress(pubKey).toString('hex').toLowerCase()
        ),
        signer: pubToAddress(pubKey).toString('hex').toLowerCase()
      };
    } catch (e) {
      throw ErrorList.FAILED_TO_VERIFY;
    }
  }
}
type Message = {
  msg: string;
  sig: string;
  version: string;
};
