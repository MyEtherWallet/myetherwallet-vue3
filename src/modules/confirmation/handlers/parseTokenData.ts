import BigNumber from 'bignumber.js/bignumber';
import Web3 from 'web3';
import { useExternalStore } from '@/stores/external';
function parseTokensData(data: string, to: string) {
  const web3 = new Web3();
  const token = useExternalStore().contractToToken()(to);
  const jsonInterface = {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_amount', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  };
  const transferFuncSig = web3.eth.abi.encodeFunctionSignature(jsonInterface);
  const tokenData = {
    tokenTransferTo: '',
    tokenTransferVal: '',
    tokenSymbol: ''
  };
  if (data.substring(0, 10) === transferFuncSig) {
    const params = web3.eth.abi.decodeParameters(
      ['address', 'uint256'],
      `${data.substring(10)}`
    );
    const value = new BigNumber(params[1]);
    tokenData.tokenTransferTo = params[0];
    tokenData.tokenTransferVal = token
      ? value.div(new BigNumber(10).pow(token.decimals)).toFixed().toString()
      : value.toString();
    tokenData.tokenSymbol = token ? token.symbol : 'Unidentified Token';
  }
  return tokenData;
}

export default parseTokensData;
