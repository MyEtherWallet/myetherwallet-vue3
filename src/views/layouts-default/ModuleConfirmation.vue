<template>
  <div>
    <success-modal
      :show-success-modal="showSuccessModal"
      :show-success-swap="showSuccessSwap"
      :success-title="successTitle"
      :reset-success="resetSuccess"
      :reset="reset"
      :network="network"
      :links="links"
      :success-body-text="successBodyText"
      :has-close-button="false"
    />
    <cross-chain-confirmation
      :show-cross-chain-modal="showCrossChainModal"
      :tx-obj="tx"
      :title="title"
      :reset="rejectTransaction"
      :sent-btc="sendCrossChain"
    />
    <app-modal
      :show="showTxOverlay"
      :title="title !== '' ? title : 'Confirmation'"
      :close="rejectTransaction"
      :btn-action="btnAction"
      :btn-enabled="disableBtn"
      :btn-text="toNonEth ? 'Proceed with swap' : 'Confirm & Send'"
      :scrollable="true"
      :anchored="true"
      width="650"
      @close="rejectTransaction"
    >
      <template #dialogBody>
        <v-card-text ref="scrollableContent" class="py-0 px-4 px-md-0">
          <div
            v-if="toNonEth"
            class="px-4 py-6 pr-6 textBlack2--text border-radius--5px mb-5"
          >
            <b>Please double check everything.</b> MEW team will not be able to
            reverse your transaction once its submitted. You will still be
            charged gas fee even if the transaction fails.
            <a
              :href="getArticle('my-txn-failed-charged')"
              target="_blank"
              rel="noopener noreferrer"
              >Learn more.</a
            >
          </div>
          <confirmation-send-transaction-details
            v-if="!isSwap"
            :to="txTo"
            :network="network"
            :tx-fee="txFee"
            :tx-fee-usd="txFeeUSD"
            :value="value"
            :to-tx-data="tx.toTxData"
            :to-details="allToDetails"
            :send-currency="sendCurrency"
          />
          <confirmation-swap-transaction-details
            v-else
            :to="swapInfo.to"
            :from="swapInfo.from"
            :from-img="swapInfo.fromImg"
            :from-type="swapInfo.fromType"
            :to-type="swapInfo.toType"
            :to-img="swapInfo.toImg"
            :from-val="swapInfo.fromVal"
            :to-val="swapInfo.toVal"
            :provider="swapInfo.selectedProvider"
            :to-usd="swapInfo.toUsdVal"
            :from-usd="swapInfo.fromUsdVal"
            :tx-fee="swapInfo.txFee"
            :gas-price-type="swapInfo.gasPriceType"
            :is-hardware="isHardware"
            :is-to-non-eth="toNonEth"
            :to-currency="swapInfo.toType"
            :to-address="swapInfo.to"
          />
          <!-- Warning Sheet -->
          <div class="px-4 py-6 pr-6 textBlack2--text border-radius--5px mb-5">
            <b>Make sure all the information is correct.</b> Cancelling or
            reversing a transaction cannot be guaranteed. You will still be
            charged gas fee even if transaction fails.
            <a
              :href="getArticle('my-txn-failed-charged')"
              target="_blank"
              rel="noopener noreferrer"
              >Learn more.</a
            >
          </div>
          <!-- Ledger Warning Sheet -->
          <div
            v-if="isOnLedger"
            class="ledger-warning d-flex justify-space-between px-4 py-6 border-radius--5px mb-5"
          >
            <div>
              <v-img
                :src="
                  require('@/assets/images/icons/hardware-wallets/Ledger-Nano-X-Label-Icon.svg')
                "
                alt="Ledger Wallet"
                max-width="11em"
                max-height="2.5em"
                contain
                class="ml-15"
              />
            </div>
            <span class="textBlack2--text ml-2">
              <b>Using Ledger?</b> Consider turning off 'debug data' before
              proceeding. Additional steps associated with the 'debug
              <br />
              feature'on Ledger may be required to approve this transaction.
            </span>
          </div>
          <!-- transaction details -->
          <confirm-with-wallet
            v-if="showConfirmWithWallet"
            :tx-length="unsignedTxArr.length > 0 ? unsignedTxArr.length : 1"
            :signed="signingPending"
            :error="error"
          />

          <v-expansion-panels
            v-model="panel"
            accordion
            multiple
            flat
            class="expansion-border"
          >
            <v-expansion-panel
              v-for="(transaction, i) in transactions"
              :key="`${transaction.title}${transaction.value}${i}`"
              :class="{
                'expansion-panel-border-bottom':
                  transactions.length > 1 && i !== transactions.length - 1
              }"
              @click="scrollToElement(i)"
            >
              <v-expansion-panel-header
                :disable-icon-rotate="signing"
                class="expansion-header"
              >
                <v-row class="align-center pr-7 pl-2">
                  <p class="ma-0 pl-1">
                    <span class="font-weight-bold"
                      >Transaction
                      {{ transactions.length > 1 ? `${i + 1}` : `details` }}
                    </span>
                    <br />
                    <span
                      v-if="isBatch"
                      class="ma-0 mew-label greyPrimary--text"
                      >{{ isSwap ? 'Swap ' : '' }} part {{ i + 1 }} -
                      {{ dataToAction(unsignedTxArr[i]) }}</span
                    >
                    <span
                      v-else-if="dataToAction(tx) !== ''"
                      class="ma-0 mew-label greyPrimary--text"
                      >{{ dataToAction(tx) }}</span
                    >
                  </p>
                  <v-spacer />
                  <div v-if="signing">
                    <v-progress-circular
                      v-show="
                        error === '' && isBatch && signedTxArray.length < i + 1
                      "
                      indeterminate
                      color="greenPrimary"
                      size="20"
                      width="2"
                      class="pr-7"
                    />
                    <v-progress-circular
                      v-show="
                        !isBatch && Object.keys(signedTxObject).length === 0
                      "
                      indeterminate
                      color="greenPrimary"
                      size="20"
                      width="2"
                      class="pr-7"
                    />
                    <v-icon
                      v-show="
                        !isBatch && Object.keys(signedTxObject).length !== 0
                      "
                      color="greenPrimary"
                    >
                      mdi-check
                    </v-icon>
                    <v-icon
                      v-show="
                        error === '' && isBatch && signedTxArray.length >= i + 1
                      "
                      color="greenPrimary"
                    >
                      mdi-check
                    </v-icon>
                  </div>
                </v-row>
              </v-expansion-panel-header>
              <v-expansion-panel-content :id="i">
                <div class="pa-6 pt-0">
                  <v-row
                    v-for="txVal in transaction"
                    :key="`${txVal.title}${txVal.value}`"
                    class="d-flex justify-space-between mt-3"
                    no-gutters
                  >
                    <v-col
                      cols="12"
                      md="3"
                      class="d-flex d-sm-block ma-0 greyPrimary--text"
                    >
                      {{ txVal.title }}
                    </v-col>

                    <v-col cols="12" md="9">
                      <app-scroll-block>
                        <div class="data-values text-md-right">
                          {{ txVal.value }}
                        </div>
                      </app-scroll-block>
                    </v-col>
                  </v-row>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <div v-if="toNonEth" class="pt-4">
            By clicking 'Proceed with swap', I agree to the
            <a href="https://changelly.com/aml-kyc" target="_blank">
              Changelly AML/KYC
            </a>
            and <router-link :to="termRoute">Terms of Service</router-link>
          </div>
        </v-card-text>
      </template>
    </app-modal>
    <!--
    ====================================================================================
      Sign Message Confirmation
    =====================================================================================
    -->
    <mew-overlay
      :footer="{
        text: 'Need help?',
        linkTitle: 'Contact support',
        link: 'mailto:support@myetherwallet.com'
      }"
      :show-overlay="showSignOverlay"
      :title="title ? title : 'Message'"
      :close="reset"
      content-size="large"
    >
      <confirmation-messsage
        ref="messageConfirmationContainer"
        :msg="signature"
        :copy="copyToClipboard"
      />
    </mew-overlay>
  </div>
</template>

<script setup lang="ts">
import {
  fromWei,
  hexToNumberString,
  hexToNumber,
  toWei,
  sha3,
  isHex
} from 'web3-utils';
import { isEmpty, isArray, cloneDeep } from 'lodash';
import BigNumber from 'bignumber.js/bignumber';
import * as locStore from 'store';

import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import EventNames from '@/utils/web3-provider/events.js';

//import { Toast, SUCCESS } from '@/modules/toast/handler/handlerToast';
//import parseTokenData from './handlers/parseTokenData';
//import { EventBus } from '@/core/plugins/eventBus';
import { setEvents } from '@/utils/web3-provider/methods/utils';
//import { sanitizeHex } from '@/modules/access-wallet/common/helpers';
//import dataToAction from './handlers/dataToAction';
//import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
import { ROUTES_HOME } from '@/core/configs/configRoutes';
//import errorHandler from './handlers/errorHandler';
import AppScrollBlock from '@/core/components/AppScrollBlock.vue';
import ConfirmationMessage from './components/ConfirmationMessage.vue';
import AppModal from '@/core/components/AppModal.vue';
import ConfirmationSwapTransactionDetails from './components/ConfirmationSwapTransactionDetails.vue';
import ConfirmationSendTransactionDetails from './components/ConfirmationSendTransactionDetails.vue';
import ConfirmWithWallet from './components/ConfirmWithWallet.vue';
import SuccessModal from './components/SuccessModal.vue';
import CrossChainConfirmation from './components/CrossChainConfirmation.vue';
import { computed, reactive, watch } from 'vue';
import { useWalletStore } from '@/stores/wallet';
import { useGlobalStore } from '@/stores/global';
import { useArticleStore } from '@/stores/article';
import { useAddressBookStore } from '@/stores/addressBook';
import { tryOnMounted } from '@vueuse/shared';
const state = reactive({
  showTxOverlay: false,
  showSignOverlay: false,
  showSuccessModal: false,
  showSuccessSwap: false,
  showCrossChainModal: false,
  toNonEth: false,
  tx: {},
  resolver: () => {},
  title: '',
  signedTxObject: {},
  signature: '',
  unsignedTxArr: [],
  signedTxArray: [],
  swapInfo: {},
  sendCurrency: {},
  toDetails: {},
  signing: false,
  links: {
    ethvm: '',
    explorer: ''
  },
  error: '',
  panel: [],
  termRoute: ROUTES_HOME.TERMS_OF_SERVICE.NAME
});
const walletStore = useWalletStore();
const { network, getFiatValue } = useGlobalStore();
const {} = useArticleStore();
const addressStore = useAddressBookStore();
const txTo = computed(() => {
  if (!isBatch)
    return state.tx.hasOwnProperty('toTxData')
      ? state.tx.toTxData.to
      : state.tx.to;
  return state.unsignedTxArr[0].to;
});
const isWeb3Wallet = computed(() => {
  return (
    walletStore.identifier === WALLET_TYPES.WEB3_WALLET ||
    walletStore.identifier === WALLET_TYPES.WALLET_CONNECT
  );
});
const isOtherWallet = computed(() => {
  return (
    walletStore.identifier === WALLET_TYPES.MEW_CONNECT ||
    walletStore.identifier === WALLET_TYPES.WALLET_LINK
  );
});
const isOnLedger = computed(() => {
  return (
    state.tx.data !== '0x' && walletStore.identifier === WALLET_TYPES.LEDGER
  );
});
const isNotSoftware = computed(() => {
  return this.isHardware || isWeb3Wallet || isOtherWallet;
});
const showConfirmWithWallet = computed(() => {
  return isNotSoftware && (state.signing || state.error !== '');
});
const transactions = computed(() => {
  const newArr =
    state.unsignedTxArr.length > 0
      ? [].concat(state.unsignedTxArr)
      : isEmpty(state.tx)
      ? []
      : [state.tx];
  return this.arrayParser(newArr);
});
const allToDetails = computed(() => {
  const toNickname = walletStore.addressBookStore.find(item => {
    return state.tx.to?.toLowerCase() === item.address?.toLowerCase();
  });
  return {
    ensName: state.toDetails.type === 'RESOLVED' ? state.toDetails.value : '',
    nickname: toNickname ? toNickname.nickname : '',
    selected: state.toDetails.type
  };
});
const gasPrice = computed(() => {
  if (!isBatch) {
    const gasPrice = state.tx.gasPrice ? state.tx.gasPrice : '0x';
    return fromWei(hexToNumberString(gasPrice), 'gwei');
  }

  const batchGasPrice = state.unsignedTxArr[0].gasPrice;
  return fromWei(hexToNumberString(batchGasPrice), 'gwei');
});
const gasLimit = computed(() => {
  if (!isBatch) {
    const gasLimit = state.tx.gasLimit
      ? state.tx.gasLimit
      : state.tx.gas
      ? state.tx.gas
      : '0x';
    return hexToNumberString(gasLimit);
  }
  const batchGasPrice = state.unsignedTxArr.reduce((acc, currentValue) => {
    return acc.plus(currentValue.gas);
  }, BigNumber(0));
  return hexToNumberString(batchGasPrice);
});
const txFee = computed(() => {
  const parsedTxFee = BigNumber(toWei(gasPrice, 'gwei'))
    .times(this.gasLimit)
    .toString();
  return fromWei(parsedTxFee);
});
const txFeeUSD = computed(() => {
  return this.getFiatValue(
    BigNumber(state.txFee).times(this.fiatValue).toFixed(2)
  );
});
const value = computed(() => {
  if (!isBatch) {
    const parsedValue = state.tx.value
      ? state.tx.hasOwnProperty('toTxData')
        ? state.tx.toTxData.amount
        : fromWei(hexToNumberString(state.tx.value))
      : '0x';
    return parsedValue;
  }
  return '0';
});
const disableBtn = computed(() => {
  if (state.error !== '') return true;
  if (!state.signing) return true;
  return state.txSigned;
});
const txSigned = computed(() => {
  return isBatch
    ? state.signedTxArray.length > 0 &&
        state.signedTxArray.length === state.unsignedTxArr.length
    : !isEmpty(state.signedTxObject);
});
const isSwap = computed(() => {
  return (
    !isEmpty(state.swapInfo) ||
    (!isEmpty(state.tx) &&
      state.tx.hasOwnProperty('fromTokenType') &&
      !state.tx.fromTokenType.isEth)
  );
});
const isBatch = computed(() => {
  return state.unsignedTxArr.length > 0;
});
const signingPending = computed(() => {
  if (isBatch) {
    return state.unsignedTxArr.length === state.signedTxArray.length;
  }
  return !isEmpty(state.signedTxObject);
});
/**
 * Property returns string, deodning whether or not this is a swap or send
 */
const successTitle = computed(() => {
  return state.showSuccessSwap ? 'Swap initiated' : 'Transaction initiated';
});
/**
 * Property returns string, depending whether or not this is a swap or send
 */
const successBodyText = computed(() => {
  return state.showSuccessSwap
    ? 'Once completed, the token amount will be deposited to your wallet. This should take a few minutes depending on how congested the Ethereum network is.'
    : 'Once completed, the token amount will be deposited to the address you provided. This should take a few minutes depending on how congested the Ethereum network is.';
});
/**
 * Reset signed values if any of the tx in batch is declined
 */
watch(
  () => state.error,
  newVal => {
    if (newVal !== '') {
      state.signedTxArray = [];
      state.signedTxObject = {};
    }
  }
);
/**
 * Closes modal then brings it back to the start fetching new address data
 */
watch(
  () => walletStore.address,
  newVal => {
    if (newVal) {
      resetSuccess();
    }
  }
);
// watch(()=>state.signedTxArray,()=>{
//   handler: function (newVal) {
//     if (
//       isWeb3Wallet &&
//       newVal.length !== 0 &&
//       newVal.length === state.unsignedTxArr.length
//     ) {
//       state.showTxOverlay = false;
//       showSuccess(newVal);
//     }
//   },
// },{immediate:true,deep:true})
// tryOnMounted(()=>{
//   const _self = this;
//   /**
//    * receives an @Array
//    * arr[0] is the tx
//    * arr[1] is the to details (nickname, ens name)
//    * arr[2] is the selected currency
//    */
//   EventBus.$on(EventNames.SHOW_TX_CONFIRM_MODAL, async (tx, resolver) => {
//     this.parseRawData(tx[0]);
//     _self.title = 'Transaction Confirmation';
//     _self.tx = tx[0];
//     _self.resolver = resolver;
//     _self.showTxOverlay = true;
//     _self.tx.transactionFee = state.txFee;
//     tx[0].transactionFee = state.txFee;
//     if (tx.length > 1) {
//       _self.toDetails = tx[1];
//       _self.sendCurrency = tx[2];
//     }
//     if (!this.isHardware && walletStore.identifier !== WALLET_TYPES.WEB3_WALLET)
//       await signTx();
//   });
//   /**
//    * receives an @Array
//    * arr[0] is the tx
//    * arr[1] is the swap information
//    */
//   EventBus.$on(EventNames.SHOW_SWAP_TX_MODAL, async (arr, resolver) => {
//     _self.tx = arr[0];
//     _self.swapInfo = arr[1];
//     _self.resolver = resolver;
//     _self.showTxOverlay = true;
//     _self.title = 'Verify Swap';
//     _self.toNonEth = !_self.swapInfo.toTokenType.isEth;
//     if (!_self.isHardware && _self.identifier !== WALLET_TYPES.WEB3_WALLET) {
//       await _self.signTx();
//     }
//   });

//   /**
//    * receives an @Array
//    * arr[0] is the tx that may have confirmInfo
//    * which identifies the transaction as a swap tx
//    */
//   EventBus.$on(
//     EventNames.SHOW_BATCH_TX_MODAL,
//     async (arr, resolver, isHardware) => {
//       _self.isHardwareWallet = isHardware;
//       if (arr[0].hasOwnProperty('confirmInfo')) {
//         _self.swapInfo = arr[0].confirmInfo;
//         _self.title = 'Verify Swap';
//       }
//       _self.unsignedTxArr = arr;
//       if (!resolver) _self.resolver = () => {};
//       _self.resolver = resolver;
//       _self.showTxOverlay = true;

//       if (!isHardware && _self.identifier !== WALLET_TYPES.WEB3_WALLET) {
//         _self.signBatchTx();
//       }
//     }
//   );
//   EventBus.$on(EventNames.SHOW_MSG_CONFIRM_MODAL, (msg, resolver) => {
//     _self.title = 'Message Signed';
//     _self.instance
//       .signMessage(msg)
//       .then(res => {
//         const result = Buffer.from(res).toString('hex');
//         _self.signature = JSON.stringify(
//           {
//             address: _self.address,
//             msg: msg,
//             sig: result,
//             version: '3',
//             signer: _self.isHardware ? _self.identifier : 'MEW'
//           },
//           null,
//           2
//         );
//         _self.signedMessage = result;
//         resolver(result);
//         _self.showSignOverlay = true;
//       })
//       .catch(e => {
//         _self.reset();
//         console.log(e);
//         _self.instance.errorHandler(e);
//       });
//   });
//   /**
//    * receives an @Object which contains info about the currency and rates
//    * and a resolver which resets the module confirmation
//    */
//   EventBus.$on(EventNames.SHOW_CROSS_CHAIN_MODAL, (txObj, resolver) => {
//     _self.title = `Send ${txObj.fromType}`;
//     _self.tx = txObj;
//     _self.showCrossChainModal = true;
//     _self.resolver = val => {
//       resolver(val);
//       _self.reset();
//     };
//   });
// })
const rejectTransaction = () => {
  if (isSwap.value) trackSwap('swapRejected');
  state.resolver({ rejected: true });
  reset();
};
const sendCrossChain = bool => {
  trackSwap('swapSendCrossChain');
  state.resolver(bool);
};
const swapFailed = () => {
  trackSwap('swapFailed');
};
const dataToAction = data => {
  return dataToAction(data);
};
/**
 * Methods scrolls to an element if element is open on click.
 * Has To be a timeoute, on order to wait for the element to be open
 */
const scrollToElement = _id => {
  setTimeout(() => {
    if (state.panel.includes(_id)) {
      const panel = document.getElementById(_id);
      const wrapper = this.$refs.scrollableContent;
      const options = { duration: 500, offset: -60 };
      this.$vuetify.goTo(panel, { container: wrapper, ...options });
    }
  }, 500);
};
const resetSuccess = () => {
  state.showSuccessSwap = false;
  reset();
};
const reset = () => {
  state.showTxOverlay = false;
  state.showSignOverlay = false;
  state.showSuccessModal = false;
  state.showCrossChainModal = false;
  state.tx = {};
  state.resolver = () => {};
  state.title = '';
  state.signedTxObject = {};
  state.signature = '';
  state.unsignedTxArr = [];
  state.signedTxArray = [];
  state.swapInfo = {};
  state.sendCurrency = {};
  state.toDetails = {};
  state.signing = false;
  state.links = {
    ethvm: '',
    explorer: ''
  };
  state.error = '';
};
const parseRawData = tx => {
  let tokenData = {};
  if (tx.to && tx.data && tx.data.substr(0, 10) === '0xa9059cbb') {
    tokenData = parseTokenData(tx.data, tx.to);
    tx.fromTxData = {
      currency: network.type.currencyName,
      amount: tx.amount
    };
    tx.toTxData = {
      currency: tokenData.tokenSymbol,
      amount: tokenData.tokenTransferVal,
      to: tokenData.tokenTransferTo
    };
  }
  tx.network = network.type.name;
};
const sendBatchTransaction = async () => {
  const _method = 'sendSignedTransaction';
  const _arr = state.signedTxArray;
  const promises = _arr.map((tx, idx) => {
    const _tx = tx.tx;
    _tx.from = walletStore.address;
    const _rawTx = tx.rawTransaction;
    const promiEvent = web3.eth[_method](_rawTx);
    _tx.network = network.type.name;
    _tx.gasPrice = isHex(_tx.gasPrice)
      ? hexToNumberString(_tx.gasPrice)
      : _tx.gasPrice;
    _tx.transactionFee = fromWei(
      BigNumber(_tx.gasPrice).times(_tx.gas).toString()
    );
    _tx.gasLimit = _tx.gas;
    //setEvents(promiEvent, _tx, this.$store.dispatch);
    promiEvent
      .once('transactionHash', hash => {
        const storeKey = sha3(
          `${network.type.name}-${walletStore.address?.toLowerCase()}`
        );
        const localStoredObj = locStore.get(storeKey);
        locStore.set(storeKey, {
          nonce: sanitizeHex(
            new BigNumber(localStoredObj.nonce).plus(1).toString(16)
          ),
          timestamp: localStoredObj.timestamp
        });
        if (idx + 1 === _arr.length) {
          if (isSwap.value) {
            state.showSuccessSwap = true;
          }
          reset();
          showSuccess(hash);
        }
      })
      .catch(() => {
        if (isSwap.value) swapFailed();
      });
    return promiEvent;
  });
  state.resolver(promises);
};
const sendSignedTx = () => {
  const hash = state.signedTxObject.tx.hash;
  state.resolver(state.signedTxObject);
  if (isSwap.value) {
    state.showSuccessSwap = true;
  }
  if (state.tx.data && state.tx.data.includes('0x33aaf6f2')) {
    trackDapp('ethBlocksMinted');
  }
  reset();
  showSuccess(hash);
};
const showSuccess = param => {
  if (isSwap.value) {
    trackSwap('swapTransactionSuccessfullySent');
  }
  if (isArray(param)) {
    const lastHash = param[param.length - 1].tx.hash;
    state.links.ethvm = network.type.isEthVMSupported.supported
      ? network.type.isEthVMSupported.blockExplorerTX.replace(
          '[[txHash]]',
          lastHash
        )
      : '';
    state.links.explorer = network.type.blockExplorerTX.replace(
      '[[txHash]]',
      lastHash
    );
    state.showSuccessModal = true;
    return;
  }

  state.links.ethvm = network.type.isEthVMSupported?.supported
    ? network.type.isEthVMSupported.blockExplorerTX?.replace(
        '[[txHash]]',
        param
      ) || ''
    : '';
  state.links.explorer =
    network.type.blockExplorerTX?.replace('[[txHash]]', param) || '';
  state.showSuccessModal = true;
};
const signTx = async () => {
  state.error = '';
  if (isNotSoftware) {
    state.signing = true;
  }
  if (isWeb3Wallet) {
    const event = walletStore.instance.signTransaction(state.tx);
    event
      .on('transactionHash', res => {
        state.showTxOverlay = false;
        showSuccess(res);
      })
      .catch(e => {
        if (isSwap.value) swapFailed();
        state.signedTxObject = {};
        state.error = errorHandler(e);
        state.signing = false;
      });
    state.resolver(event);
  } else {
    await walletStore.instance
      .signTransaction(state.tx)
      .then(res => {
        state.signedTxObject = res;
        if (this.isHardware && state.txSigned) {
          this.btnAction();
        }
      })
      .catch(e => {
        if (isSwap.value) swapFailed();
        state.signedTxObject = {};
        state.error = errorHandler(e);
        state.signing = false;
        const toastError = errorHandler(e, true);
        console.log(toastError);
        if (toastError) walletStore.instance.errorHandler(toastError);
      });
  }
};
const signBatchTx = async () => {
  state.error = '';
  const signed = [];
  const batchTxEvents = [];
  if (isNotSoftware) {
    state.signing = true;
  }
  for (let i = 0; i < state.unsignedTxArr.length; i++) {
    const objClone = cloneDeep(state.unsignedTxArr[i]);
    // fixes circular reference for signing
    delete objClone['handleNotification'];
    delete objClone['currency'];
    delete objClone['confirmInfo'];
    try {
      if (!isWeb3Wallet) {
        const _signedTx = await walletStore.instance.signTransaction(objClone);
        if (state.unsignedTxArr[i].hasOwnProperty('handleNotification')) {
          _signedTx.tx['handleNotification'] =
            state.unsignedTxArr[i].handleNotification;
        }
        signed.push(_signedTx);
        if (this.isHardware && state.txSigned) {
          this.btnAction();
        }
      } else {
        const event = walletStore.instance.signTransaction(objClone);
        batchTxEvents.push(event);
        event
          .on('transactionHash', res => {
            signed.push({
              tx: {
                hash: res
              }
            });
          })
          .catch(e => {
            if (isSwap.value) swapFailed();
            console.log(e);
            walletStore.instance.errorHandler(e.message);
          });
      }
      state.signedTxArray = signed;
      if (isWeb3Wallet) state.resolver(batchTxEvents);
    } catch (err) {
      state.error = errorHandler(err);
      state.signedTxArray = [];
      return;
    }
  }
  if (!isWeb3Wallet && !this.isHardware && !isOtherWallet) {
    state.signing = false;
  }
};
const btnAction = () => {
  if (isSwap.value) {
    trackSwap('swapTransactionSend');
  }
  if (!isWeb3Wallet) {
    if (
      (state.signedTxArray.length === 0 ||
        state.signedTxArray.length < state.unsignedTxArr.length) &&
      isEmpty(state.signedTxObject)
    ) {
      isBatch ? signBatchTx() : signTx();
      return;
    }
    isBatch ? sendBatchTransaction() : sendSignedTx();
    return;
  }
  isBatch ? signBatchTx() : signTx();
};
const copyToClipboard = () => {
  this.$refs.messageConfirmationContainer.$refs.signatureContent.$refs.input.select();
  document.execCommand('copy');
  window.getSelection()?.removeAllRanges();
  //Toast(this.$t('common.copied'), {}, SUCCESS);
  reset();
};
const arrayParser = arr => {
  const newArr = arr.map(item => {
    const gasLimit = item.gasLimit ? item.gasLimit : item.gas ? item.gas : '0x';
    const gasPrice = item.gasPrice ? item.gasPrice : '0x';
    const data = item.data
      ? item.data
      : item.hasOwnProperty('encodeABI')
      ? item.encodeABI()
      : '0x';
    const symbol = isEmpty(state.sendCurrency)
      ? network.type.currencyName
      : state.sendCurrency.symbol;
    const value =
      data !== '0x'
        ? !isSwap.value && !isBatch
          ? `${this.value} ${symbol}`
          : `0 ${network.type.currencyName}`
        : `${this.value} ${symbol}`;
    const from = item.from ? item.from : walletStore.address;
    const toAdd = item.to ? item.to : state.txTo;
    return [
      {
        title: 'Network',
        value: network.type.name_long
      },
      {
        title: 'From ENS',
        value: ''
      },
      {
        title: 'From address',
        value: from
      },
      {
        title:
          data !== '0x' && !isBatch ? 'Via Contract Address' : 'To address',
        value: toAdd
      },
      {
        title: 'Sending',
        value: value
      },
      {
        title: 'Gas Price',
        value: fromWei(hexToNumberString(gasPrice), 'gwei') + ' gwei'
      },
      {
        title: 'Gas Limit',
        value: hexToNumberString(gasLimit)
      },
      // {
      //   title: 'Transaction fee',
      //   value: `${state.txFee} ${network.type.currencyName} ~ $${state.txFeeUSD}`
      // },
      {
        title: 'Nonce',
        value: hexToNumber(item.nonce)
      },
      {
        title: 'Data',
        value: data
      }
    ].filter(item => {
      if (item.value !== '') return item;
    });
  });
  return newArr;
};
</script>
<style lang="scss" scoped>
$borderPanels: 1px solid var(--v-greyLight-base) !important;
.expansion-border {
  border: $borderPanels;
  border-radius: 8px;
}

.data-values {
  overflow-wrap: break-word;
}
.expansion-header {
  height: 60px;
}
.expansion-panel-border-bottom {
  border-bottom: $borderPanels;
}
.ledger-warning {
  border: 1px solid #d7dae3;
}
</style>
