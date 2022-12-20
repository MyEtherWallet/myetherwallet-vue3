import Web3 from 'web3';
import { AbiItem } from 'web3-utils';

const ERC20: AbiItem[] = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [
      {
        name: '',
        type: 'string'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        name: '',
        type: 'uint8'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        name: '',
        type: 'string'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  }
];
const getTokenInfo = async (contractAddress: string, web3: Web3) => {
  const contract = new web3.eth.Contract(ERC20, contractAddress);
  try {
    const name = await contract.methods.name().call();
    const symbol = await contract.methods.symbol().call();
    const decimals = await contract.methods.decimals().call();
    return {
      name,
      symbol,
      decimals: parseInt(decimals)
    };
  } catch (e) {
    return null;
  }
};

export default getTokenInfo;
