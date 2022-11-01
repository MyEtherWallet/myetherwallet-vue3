import { formatters } from 'web3-core-helpers';
// import Notification, {
//   NOTIFICATION_TYPES,
//   NOTIFICATION_STATUS
// } from '@/modules/notifications/handlers/handlerNotification';
import { clone } from 'lodash';
//import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
const getSanitizedTx = (tx: any) => {
  return new Promise((resolve, reject) => {
    if (!tx.gas && !tx.gasLimit && !tx.chainId)
      return reject(new Error('"gas" or "chainId" is missing'));
    if (tx.nonce < 0 || tx.gas < 0 || tx.gasPrice < 0 || tx.chainId < 0)
      return reject(
        new Error('Gas, gasPrice, nonce or chainId is lower than 0')
      );

    try {
      tx = formatters.inputCallFormatter(tx);
      const transaction = tx;
      if (tx.to) transaction.to = tx.to;
      transaction.data = tx.data || '0x';
      transaction.value = tx.value || '0x';
      transaction.chainId = tx.chainId;
      resolve(transaction);
    } catch (e) {
      reject(e);
    }
  });
};

const setEvents = (promiObj: any, tx: any, dispatch: any) => {
  // create a no reference copy specifically for notification
  const newTxObj = clone(tx);
  //newTxObj.type = NOTIFICATION_TYPES.OUT;
  const isExempt = newTxObj.handleNotification ? true : false;

  if (!newTxObj.to) {
    newTxObj['to'] = '0x0000000000000000000000000000000000000000';
  }

  promiObj
    .once('transactionHash', (hash: any) => {
      //newTxObj.status = NOTIFICATION_STATUS.PENDING;
      newTxObj.hash = hash;
      if (!isExempt) {
        const notification = new Notification(newTxObj);
        dispatch('notifications/addNotification', notification, {
          root: true
        });
      }
    })
    .once('receipt', () => {
      if (!isExempt) {
        //newTxObj.status = NOTIFICATION_STATUS.SUCCESS;
        const notification = new Notification(newTxObj);
        setTimeout(() => {
          dispatch(
            'external/setTokenAndEthBalance',
            {},
            {
              root: true
            }
          );
        }, 3000); //give network some time to update
        dispatch('notifications/updateNotification', notification, {
          root: true
        });
      }
    })
    .on('error', (err: any) => {
      if (!isExempt) {
        if (!newTxObj.hash) {
          //Toast(err, {}, ERROR);
          return;
        }
        //newTxObj.status = NOTIFICATION_STATUS.FAILED;
        newTxObj.errMessage = err.message;
        if (!newTxObj.hash) {
          newTxObj['hash'] = '0x';
        }
        const notification = new Notification(newTxObj);
        setTimeout(() => {
          dispatch(
            'external/setTokenAndEthBalance',
            {},
            {
              root: true
            }
          );
        }, 3000); //give network some time to update
        dispatch('notifications/updateNotification', notification, {
          root: true
        });
      }
    });
};

export { getSanitizedTx, setEvents };
