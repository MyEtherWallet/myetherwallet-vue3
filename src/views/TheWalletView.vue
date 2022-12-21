<template>
  <div class="wallet-main">
    <the-wallet-side-menu />
    <v-main>
      <v-container class="pa-2 pa-md-3 mb-14" fluid>
        <the-wallet-header />
        <module-confirmation />
        <the-enkrypt-popup v-if="!isOfflineApp" :show="walletEnkryptPopup" />
        <router-view />
      </v-container>
    </v-main>
    <the-wallet-footer :is-offline-app="isOfflineApp" />
    <enkrypt-promo-snackbar v-if="!isOfflineApp" />
  </div>
</template>

<script setup lang="ts">
import { toBN } from 'web3-utils';
import Web3 from 'web3';
import moment from 'moment/moment';
import { debounce } from 'lodash';
//import handlerWallet from '@/core/mixins/handlerWallet.mixin';
import nodeList from '@/utils/networks';
// import {
//   ERROR,
//   SUCCESS,
//   Toast,
//   WARNING
// } from '@/modules/toast/handler/handlerToast';
//import { Web3Wallet } from '@/modules/access-wallet/common';
import { ROUTES_HOME } from '@/core/configs/configRoutes';
//import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
import matchNetwork from '@/core/helpers/matchNetwork';

//import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import TheWalletSideMenu from './components-wallet/TheWalletSideMenu.vue';
import TheWalletHeader from './components-wallet/TheWalletHeader.vue';
import TheWalletFooter from './components-wallet/TheWalletFooter.vue';
// import ModuleConfirmation from '@/modules/confirmation/ModuleConfirmation.vue';
import EnkryptPromoSnackbar from '@/views/components-wallet/EnkryptPromoSnackbar.vue';
import TheEnkryptPopup from '@/views/components-default/TheEnkryptPopup.vue';
import { computed, onBeforeUnmount, watch } from 'vue';
import { usePopupStore } from '@/stores/popups';
import { useWalletStore } from '@/stores/wallet';
import { useRouter } from 'vue-router';
import { useGlobalStore } from '@/stores/global';
import { useExternalStore } from '@/stores/external';
import { tryOnMounted } from '@vueuse/shared';

// ...mapState('wallet', [
//   'address',
//   'web3',
//   'identifier',
//   'isOfflineApp',
//   'instance'
// ]),
// ...mapState('global', ['online', 'gasPriceType', 'baseGasPrice']),
// ...mapState('external', ['coinGeckoTokens']),
// ...mapState('popups', [
//   'enkryptWalletPopup',
//   'enkryptLandingPopup',
//   'enkryptLandingPopupClosed'
// ]),
// ...mapGetters('global', [
//   'network',
//   'gasPrice',
//   'isEIP1559SupportedNetwork'
// ]),
// ...mapGetters('wallet', ['balanceInWei']),
const popupStore = usePopupStore();
const walletStore = useWalletStore();
const globalStore = useGlobalStore();
const externalStore = useExternalStore();
const router = useRouter();
const walletEnkryptPopup = computed(() => {
  return (
    !popupStore.enkryptLandingPopup &&
    moment(new Date()).diff(popupStore.enkryptLandingPopupClosed, 'hours') >=
      24 &&
    popupStore.enkryptWalletPopup
  );
});
watch(
  () => walletStore.address,
  () => {
    if (!walletStore.address) {
      router.push({ name: ROUTES_HOME.HOME.NAME });
    }
  }
);
watch(
  () => globalStore.network,
  () => {
    if (globalStore.online && !globalStore.isOfflineApp) {
      setup();
      walletStore.web3.eth.clearSubscriptions();
    }
  }
);
watch(
  () => walletStore.web3,
  () => {
    if (globalStore.online && !globalStore.isOfflineApp) setup();
  }
);
watch(
  () => externalStore.coinGeckoTokens,
  () => {
    setTokenAndEthBalance();
  }
);
tryOnMounted(() => {
  if (globalStore.online && !globalStore.isOfflineApp) {
    setup();
    if (walletStore.identifier === WALLET_TYPES.WEB3_WALLET) {
      globalStore.web3Listeners();
    }
    this.checkNetwork();
  }
});
onBeforeUnmount(() => {
  if (globalStore.online && !globalStore.isOfflineApp)
    walletStore.web3.eth.clearSubscriptions();
  if (window.ethereum && window.ethereum.removeListener instanceof Function) {
    if (findAndSetNetwork instanceof Function)
      window.ethereum.removeListener('chainChanged', findAndSetNetwork);
    if (this.setWeb3Account instanceof Function)
      window.ethereum.removeListener('accountsChanged', this.setWeb3Account);
  }
});
// ...mapActions('wallet', ['setBlockNumber', 'setTokens', 'setWallet']),
// ...mapActions('global', [
//   'setNetwork',
//   'setBaseFeePerGas',
//   'updateGasPrice',
//   'setValidNetwork'
// ]),
// ...mapActions('external', ['setTokenAndEthBalance', 'setNetworkTokens']),
const setup = () => {
  processNetworkTokens();
  setTokensAndBalance();
  subscribeToBlockNumber();
};
const checkNetwork = async () => {
  const matched = await matchNetwork(
    globalStore.network.type.chainID,
    walletStore.identifier
  );
  globalStore.validNetwork = matched;
};
const processNetworkTokens = () => {
  globalStore.network.type.tokens.then((res: any) => {
    const tokenMap = new Map();
    res.forEach((item: any) => {
      tokenMap.set(item.address.toLowerCase(), item);
    });
    externalStore.networkTokens = tokenMap;
  });
};
const setTokensAndBalance = () => {
  if (externalStore.coinGeckoTokens.size > 0) {
    setTokenAndEthBalance();
  } else {
    this.setTokens([]);
  }
};
const checkAndSetBaseFee = (baseFee: string | number) => {
  if (baseFee) {
    globalStore.setBaseFeePerGas(toBN(baseFee));
  } else {
    globalStore.setBaseFeePerGas(toBN('0'));
    externalStore.setCurrency('');
    externalStore.getCoinGeckoTokenById()('');
  }
  updateGasPrice();
};
const subscribeToBlockNumber = debounce(function () {
  globalStore.web3.eth.getBlockNumber().then(bNumber => {
    this.setBlockNumber(bNumber);
    globalStore.web3.eth.getBlock(bNumber).then(block => {
      if (block) {
        this.checkAndSetBaseFee(block.baseFeePerGas);
      }
      globalStore.web3.eth
        .subscribe('newBlockHeaders')
        .on('data', (res: any) => {
          if (this.isEIP1559SupportedNetwork && res.baseFeePerGas) {
            this.checkAndSetBaseFee(toBN(res.baseFeePerGas));
          }
          this.setBlockNumber(res.number);
        })
        .on('error', (err: any) => {
          // Toast(
          //   err && err.message === 'Load failed'
          //     ? 'eth_subscribe is not supported. Please make sure your provider supports eth_subscribe'
          //     : 'Network Subscription Error: Please wait a few seconds before continuing.',
          //   {},
          //   ERROR
          // );
        });
    });
  });
}, 500);
/**
 * Checks Metamask chainID on load, switches current network if it doesn't match
 * and setup listeners for metamask changes
 */
const web3Listeners = () => {
  if (window.ethereum?.on) {
    window.ethereum.on('chainChanged', findAndSetNetwork);
    window.ethereum.on('accountsChanged', this.setWeb3Account);
  }
};
const findAndSetNetwork = async () => {
  if (
    window.ethereum &&
    this.instance.identifier === WALLET_TYPES.WEB3_WALLET
  ) {
    const networkId = await window.ethereum?.request({
      method: 'eth_chainId'
    });
    const foundNetwork = Object.values(nodeList).find(item => {
      if (toBN(networkId).eq(toBN(item[0].type.chainID))) return item;
    });
    if (window.ethereum.isMetaMask) {
      try {
        if (foundNetwork) {
          await this.setNetwork({
            network: foundNetwork[0],
            walletType: this.instance.identifier
          });
          this.setValidNetwork(true);
          await this.setTokenAndEthBalance();
          this.trackNetworkSwitch(foundNetwork[0].type.name);
          this.$emit('newNetwork');
          // Toast(
          //   `Switched network to: ${foundNetwork[0].type.name}`,
          //   {},
          //   SUCCESS
          // );
        } else {
          this.setValidNetwork(false);
          // Toast("Current wallet's network is unsupported", {}, ERROR);
        }
      } catch (er) {
        // Toast('There was an error switching networks', {}, ERROR);
      }
    } else {
      // Toast(
      //   "Can't find matching nodes for selected MetaMask node! MetaMask may not function properly. Please select a supported node",
      //   {},
      //   WARNING
      // );
    }
  }
};
const setWeb3Account = acc => {
  const web3 = new Web3(window.ethereum);
  const wallet = new Web3Wallet(acc[0]);
  this.setWallet([wallet, web3.currentProvider]);
};
</script>

<style lang="scss" scoped>
.box-shadow {
  box-shadow: 0 0 15px var(--v-greyMedium-base) !important;
}
.wallet-main {
  background-color: var(--v-greyLight-base);
  height: 100%;
}
</style>
