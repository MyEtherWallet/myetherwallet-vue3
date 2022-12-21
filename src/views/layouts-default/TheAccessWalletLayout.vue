<template>
  <div class="bg-expandHeader">
    <v-container>
      <!--
      =====================================================================================
        Layout Title
      =====================================================================================
      -->
      <the-layout-header
        :title="$t('home.access-my-wallet.title')"
        :subtitle-line-one="$t('home.access-my-wallet.subtitle-one')"
        :subtitle-line-two="$t('home.access-my-wallet.subtitle-two')"
        :route-obj="state.titleRoute"
        has-link
      />
      <!--
      =====================================================================================
        Options
      =====================================================================================
      -->
      <div style="max-width: 650px" class="mx-auto">
        <div
          v-for="(btn, key) in buttons"
          :key="key"
          class="position--relative"
        >
          <div
            v-if="btn.official"
            class="chip-official d-flex align-center"
            :class="isMobile ? 'note-position-mobile' : 'note-position'"
          >
            <v-icon color="whiteAlways" size="15px" class="mr-1">
              mdi-shield-check
            </v-icon>
            <div
              class="font-weight-medium letter-spacing--initial line-height--initial"
            >
              Official
            </div>
          </div>
          <div
            v-if="!btn.recommended"
            class="text-orangePrimary mew-label note-position d-flex align-center"
          >
            <v-icon color="orangePrimary" size="18px" class="mr-1">
              mdi-shield-alert
            </v-icon>
            NOT RECOMMENDED
          </div>
          <mew-button
            has-full-width
            :class="[
              btn.title === 'Software'
                ? 'AccessWalletSoftwareButton'
                : 'mb-5 py-6'
            ]"
            style="height: initial; min-height: 157px"
            :color-theme="btn.color"
            :btn-style="btn.style === 'outline' ? 'outline' : ''"
            @click="btn.fn"
          >
            <div class="width--full d-flex align-center text-left">
              <img
                v-if="btn.icon && !isMobile"
                class="ml-5 mr-6"
                :src="btn.icon"
                :alt="btn.alt"
                style="height: 70px"
              />
              <div class="px-3">
                <div class="d-flex align-center">
                  <img
                    v-if="btn.icon && isMobile"
                    class="mr-4"
                    :src="btn.icon"
                    :alt="btn.alt"
                    style="height: 40px"
                  />

                  <div class="mew-heading-2 break-word letter-spacing--initial">
                    {{ btn.title }}
                  </div>
                </div>
                <div
                  class="mew-heading-4 reset-subtitle break-word letter-spacing--initial text-transform--none mt-4"
                >
                  {{ btn.subtitle }}
                </div>
              </div>
            </div>
          </mew-button>
        </div>
      </div>

      <!--
      =====================================================================================
        Acccess Wallet Module Overlays - activate on Options Button click
      =====================================================================================
      -->
      <div class="spacer-y-medium" />
      <!-- <module-access-wallet-mobile :open="showMobile" :close="close" />
      <module-access-wallet-hardware :open="showHardware" :close="close" />
      <module-access-wallet-software
        :open="showSoftware"
        :close="close"
        :wallet-type="type"
      /> -->
      <!-- <enkrypt-missing-snackbar
        :show="state.showInstallEnkrypt"
        @closeEnkryptMissingSnackbar="state.showInstallEnkrypt = false"
      /> -->
    </v-container>
  </div>
</template>

<script setup lang="ts">
import Web3 from 'web3';

import {
  Toast,
  ERROR,
  WARNING,
  SENTRY
} from '@/modules/toast/handler/handlerToast';
import { ACCESS_VALID_OVERLAYS } from '@/core/router/helpers';
//import { Web3Wallet, MewConnectWallet } from '@/modules/access-wallet/common';
import { ROUTES_HOME, ROUTES_WALLET } from '@/core/configs/configRoutes';
//import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
//import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';

// import ModuleAccessWalletHardware from '@/modules/access-wallet/ModuleAccessWalletHardware.vue';
// import ModuleAccessWalletSoftware from '@/modules/access-wallet/ModuleAccessWalletSoftware.vue';
// import ModuleAccessWalletMobile from '@/modules/access-wallet/ModuleAccessWalletMobile.vue';
//import EnkryptMissingSnackbar from '@/views/components-default/EnkryptMissingSnackbar.vue';
import TheLayoutHeader from '../components-default/TheLayoutHeader.vue';
import { computed, reactive } from 'vue';

import { useExternalStore } from '@/stores/external';
import { useWalletStore } from '@/stores/wallet';
import { useGlobalStore } from '@/stores/global';
import { useDisplay } from 'vuetify/lib/framework.mjs';
import { useRouter } from 'vue-router';

const props = defineProps({
  overlay: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'overview'
  }
});
const state = reactive({
  titleRoute: {
    text: 'Create Wallet',
    routeName: 'CreateWallet'
  },
  showInstallEnkrypt: false
});
const externalStore = useExternalStore();
const walletStore = useWalletStore();
const globalStore = useGlobalStore();

/**
 * Used in the creation of a MEWconnect instance
 **/

/**
 * Opens up software module overlay. Returns true if overlay prop from route is ACCESS_VALID_OVERLAYS.SOFTWARE
 * @return - boolean
 */

const showSoftware = computed(() => {
  return props.overlay === ACCESS_VALID_OVERLAYS.SOFTWARE;
});
/**
 * Opens up harware module overlay. Returns true if overlay prop from route is ACCESS_VALID_OVERLAYS.HARDWARE
 * @return - boolean
 */
const showHardware = computed(() => {
  return props.overlay === ACCESS_VALID_OVERLAYS.HARDWARE;
});
/**
 * Opens up mobile module overlay. Returns true if overlay prop from route is ACCESS_VALID_OVERLAYS.MOBILE
 * @return - boolean
 */
const showMobile = computed(() => {
  return props.overlay === ACCESS_VALID_OVERLAYS.MOBILE;
});
/**
 * Opens up software module overlay. Returns true if overlay prop from route is ACCESS_VALID_OVERLAYS.SOFTWARE
 * @return - boolean
 */
const showOffline = computed(() => {
  return props.overlay === ACCESS_VALID_OVERLAYS.SOFTWARE;
});
type Button = {
  color: string;
  style?: string;
  title: string;
  icon?: any;
  alt?: string;
  subtitle: string;
  official?: boolean;
  recommended?: boolean;
  fn: () => any;
};
const buttons = computed((): Button[] => {
  if (!globalStore.isOfflineApp) {
    return [
      /* Enkrypt */
      {
        color: 'white',
        title: 'Enkrypt',
        subtitle: 'Connect with Enkrypt browser extension',
        official: true,
        recommended: true,
        icon: require('@/assets/images/icons/icon-enkrypt-block.svg'),
        alt: 'Enkrypt',
        fn: () => {
          checkEnkrypt();
        }
      },
      /* MEW wallet Button */
      {
        color: 'white',
        title: 'MEW wallet app',
        subtitle: 'Connect MEW Wallet app to MEW web',
        official: true,
        recommended: true,
        icon: require('@/assets/images/icons/icon-mew-wallet.png'),
        alt: 'MEW wallet',
        fn: () => {
          openMEWconnect();
        }
      },
      /* Browser extension */
      {
        color: 'white',
        title: 'Browser extension',
        subtitle: 'Use your Web3 wallet with MEW',
        official: false,
        recommended: true,
        icon: require('@/assets/images/icons/icon-extensions.png'),
        alt: 'Hardware Wallets',
        fn: () => {
          openWeb3Wallet();
        }
      },
      /* Mobile Apps */
      {
        color: 'white',
        title: 'Mobile Apps',
        subtitle: 'WalletConnect, WalletLink',
        official: false,
        recommended: true,
        icon: require('@/assets/images/icons/icon-mobile-apps.png'),
        alt: 'Hardware Wallets',
        fn: () => {
          openOverlay(ACCESS_VALID_OVERLAYS.MOBILE);
        }
      },
      /* Hardware wallets */
      {
        color: 'white',
        title: 'Hardware wallets',
        subtitle: 'Ledger, Trezor, KeepKey, Cool Wallet, Bitbox02',
        official: false,
        recommended: true,
        icon: require('@/assets/images/icons/icon-hardware-wallet.png'),
        alt: 'Hardware Wallets',
        fn: () => {
          openOverlay(ACCESS_VALID_OVERLAYS.HARDWARE);
        }
      },
      /* Software */
      {
        color: 'white',
        style: 'outline',
        title: 'Software',
        subtitle: 'Keystore File, Mnemonic Phrase, and Private Key',
        official: false,
        recommended: false,
        fn: () => {
          openOverlay(ACCESS_VALID_OVERLAYS.SOFTWARE);
        }
      }
    ];
  }
  return [
    {
      color: 'white',
      title: 'Software',
      subtitle: 'Keystore files, Mnemonic phrase, Private key',
      fn: () => {
        openOverlay(ACCESS_VALID_OVERLAYS.SOFTWARE);
      }
    }
  ];
});

const isMobile = computed(() => {
  return useDisplay().smAndDown.value;
});
/**
 * Used to set the MEWconnect instance as the wallet
 **/
/**
 * Pushes route to empty Access wallet with no props
 * Consequently closing any open overlay
 * @type - must be one of the VALID_OVERLAYS
 */
const router = useRouter();
const close = () => {
  try {
    router.push({
      name: ROUTES_HOME.ACCESS_WALLET.NAME
    });
  } catch (e) {
    Toast(e, {}, ERROR);
  }
};
/**
 * Pushes a correct router prop for the overlay and sets query prop 'type' to the 'overview'.
 * Consiquently this will open the correct module overlay.
 * @type - must be one of the VALID_OVERLAYS
 */
const openOverlay = (type: string) => {
  try {
    router.push({
      name: ROUTES_HOME.ACCESS_WALLET.NAME,
      params: { overlay: type },
      query: { type: 'overview' }
    });
  } catch (e) {
    Toast(e, {}, ERROR);
  }
  //this[type] = true;
};
/**
 * Checks if Enkrypt is available
 */
const checkEnkrypt = () => {
  if (
    window.ethereum &&
    window.ethereum.isMetaMask &&
    window.ethereum.isEnkrypt
  ) {
    openWeb3Wallet();
  } else {
    state.showInstallEnkrypt = true;
  }
};
/**
 * Checks and open web3 wallet
 */
const openWeb3Wallet = async () => {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    try {
      //await window.ethereum.enable();
      const acc = await web3.eth.requestAccounts();
      //const wallet = new Web3Wallet(acc[0]);
      //walletStore.setWallet([wallet, window.ethereum]);
      //this.trackAccessWallet(WALLET_TYPES.WEB3_WALLET);
      if (externalStore.path !== '') {
        router.push({ path: externalStore.path });
      } else {
        router.push({ name: ROUTES_WALLET.WALLETS.NAME });
      }
    } catch (e: any) {
      if (
        e.message === 'Already processing eth_requestAccounts. Please wait.'
      ) {
        // Toast(
        //   'Please open the MetaMask extension and unlock your wallet.',
        //   {},
        //   WARNING
        // );
      } else {
        //Toast(e, {}, WARNING);
      }
    }
  } else {
    //Toast('No web3 wallet found!', {}, WARNING);
  }
};
/** Opens a modal to initiate a connection with a MEW mobile app.
 * Subsequently, this method creates an instance of MEWconnect with signTransaction and signMessage methods.
 */
const openMEWconnect = () => {
  // MewConnectWallet()
  //   .then(_newWallet => {
  //     this.setWallet([_newWallet]).then(() => {
  //       this.trackAccessWallet(WALLET_TYPES.MEW_WALLET);
  //       this.$router.push({ name: ROUTES_WALLET.DASHBOARD.NAME });
  //     });
  //   })
  //   .catch(e => {
  //     Toast(e.message, {}, SENTRY);
  //   });
};
</script>

<style lang="scss" scoped>
.reset-subtitle {
  line-height: 24px;
}

.chip-official {
  background-color: RGB(var(--v-theme-greenPrimary));
  color: white;
  padding: 6px 10px;
  border-radius: 30px;
  z-index: 1;
}

.note-position {
  position: absolute;
  top: 14px;
  right: 16px;
  z-index: 1;
}

.note-position-mobile {
  position: absolute;
  top: 0px;
  right: 0px;
  padding: 4px 8px;
  border-radius: 0px 10px 0 7px;
}
</style>
