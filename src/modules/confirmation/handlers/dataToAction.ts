import Web3 from 'web3';
const signatures: Signatures = {
  '0x095ea7b3': ({ data }): string => {
    const params = new Web3().eth.abi.decodeParameters(
      ['address', 'uint256'],
      `${data.substring(10)}`
    );
    const value = Web3.utils.toBigInt(params[1]);
    if (value === 0n) return 'Reset Approval';
    return 'Approval';
  },
  '0x7c025200': () => {
    return 'Swap';
  },
  '0x28ed4f6c': () => {
    return 'Set ENS controller';
  },
  '0x23b872dd': () => {
    return 'Transfer ENS name';
  },
  '0xacf1a841': () => {
    return 'Renew ENS name';
  },
  '0xac9650d8': () => {
    return 'Set ENS coins/text records';
  },
  '0xa9059cbb': () => {
    return 'Transfer Tokens';
  },
  '0xca0bfcce': () => {
    return `Eth2 Staking`;
  },
  '0xf14fcbc8': () => {
    return 'ENS Commitment';
  },
  '0xf7a16963': () => {
    return 'ENS Registration';
  },
  '0x33aaf6f2': () => {
    return 'ETH Blocks Mint';
  }
};
const getSignature = (data: string) => data.substring(0, 10);
export default (tx: TX) => {
  if (!tx.data || tx.data === '0x') return '';
  else if (!signatures[getSignature(tx.data)]) return '';
  return signatures[getSignature(tx.data)]({
    from: tx.from,
    to: tx.to,
    data: tx.data,
    value: tx.value
  });
};

interface Signatures {
  [key: string]: (tx: TX) => string;
}

type TX = {
  from: string;
  to: string;
  data: string;
  value: string;
};
