import Wallet from 'ethereumjs-wallet';
import {
  keystoreConfig,
  createBlob,
  generateRandomNumber,
  knuthShuffle
} from './helpers';
import MnemonicTools from '@/core/helpers/mnemonicTools';

export type GeneratedKeyStore = {
  blobUrl: string;
  name: string;
};

export default class CreateWallet {
  phrase: string[];
  verificationPhrase?: Record<string | number, unknown>[];

  constructor() {
    this.phrase = [];
    this.verificationPhrase = undefined;
  }

  // Generate new keystore wallet
  generateKeystore(password: string): Promise<GeneratedKeyStore> {
    return new Promise((resolve, reject) => {
      if (!password && password === '') {
        reject('Password missing or invalid!');
      }
      try {
        const wallet = Wallet.generate();
        wallet
          .toV3(password, {
            kdf: keystoreConfig.kdf,
            n: keystoreConfig.n
          })
          .then(res => {
            resolve({
              blobUrl: createBlob(res),
              name: wallet.getV3Filename()
            });
          });
      } catch (e) {
        reject(e);
      }
    });
  }
  // Generate new mnemonic wallet
  generateMnemonic(length: number): Promise<string[]> {
    return new Promise((resolve, reject) => {
      if (length && (length === 12 || length === 24)) {
        const phrase =
          length === 12 ? MnemonicTools.phrase12() : MnemonicTools.phrase24();
        this.phrase = phrase;
        this.generateVerification(phrase);
        resolve(phrase);
      } else {
        reject('Invalid length!');
      }
    });
  }

  // Create fake words to display for validation
  generateVerification(phrase: string[]) {
    const words = MnemonicTools.phrase24();
    const idxs = [];
    while (idxs.length < 3) {
      const random = Math.floor(Math.random() * phrase.length);
      if (idxs.indexOf(random) === -1) {
        idxs.push(random);
      }
    }
    const output = idxs.map(item => {
      const arr = [
        phrase[item],
        words[generateRandomNumber(phrase.length)],
        words[generateRandomNumber(phrase.length)]
      ];
      const randomlySortedArray = knuthShuffle(arr);
      return {
        [item]: randomlySortedArray,
        itemNumber: item
      };
    });
    this.verificationPhrase = output;
  }
  // validates the selected mnemonic values
  validateMnemonic(obj: Record<number, string>) {
    return new Promise((resolve, reject) => {
      const holder: boolean[] = [];
      Object.keys(obj).forEach(idx => {
        const check =
          obj[Number(idx)].substring(0, obj[Number(idx)].length - 2) ===
          this.phrase[Number(idx)];
        holder.push(check);
      });
      if (holder.includes(false)) {
        this.generateVerification(this.phrase);
        reject('Wrong values selected. Please try again!');
      } else {
        resolve(!holder.includes(false));
      }
    });
  }

  // getters
  getVerification() {
    return this.verificationPhrase;
  }
}
