import ethSendTransaction from './eth_sendTransaction';
import ethSendRawTransaction from './eth_sendRawTransaction';
import ethSign from './eth_sign';
import ethAccounts from './eth_accounts';
import ethCoinbase from './eth_coinbase';
import ethSignTransaction from './eth_signTransaction';
import ethGetTransactionCount from './eth_getTransactionCount';
import netVersion from './net_version';
import { CustomRequestManager } from '../providers/given-provider';
export {
  ethSendTransaction,
  ethSendRawTransaction,
  ethSign,
  ethAccounts,
  ethCoinbase,
  ethSignTransaction,
  ethGetTransactionCount,
  netVersion
};

interface MethodData {
  payload: {
    [key: string | number | symbol]: unknown;
    params: any[];
    method: string;
    id: number;
  };
  requestManager: CustomRequestManager;
}

export type Web3Method = (
  data: MethodData,
  res: (...args: any[]) => void,
  next: () => void
) => Promise<any>;
