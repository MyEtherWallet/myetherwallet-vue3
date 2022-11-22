<template class="AccessSoftwareWallet">
  <!--
  =====================================================================================
    Overlay - access using software
  =====================================================================================
  -->
  <mew-overlay
    :footer="state.footer"
    content-size="large"
    :show-overlay="open"
    :title="title"
    :back="showBackBtn && !switchAddress ? accessBack : null"
    :close="close"
  >
    <!--
    =====================================================================================
      Overview: prompts user to select options
    =====================================================================================
    -->
    <div
      v-if="walletType === state.types.OVERVIEW"
      style="max-width: 650px; width: 100%"
      class="mx-auto"
    >
      <div v-for="(btn, key) in state.buttons" :key="key" class="mb-5">
        <mew-button
          :class="btn.class"
          has-full-width
          color-theme="greyMedium"
          btn-style="outline"
          style="height: 160px"
          @click="btn.fn"
        >
          <div
            class="text-left d-flex align-center justify-space-between px-2"
            style="width: 100%"
          >
            <div class="mew-heading-2 textDark--text">
              {{ btn.label }}
            </div>
            <img width="80" class="mr-4 d-none d-sm-block" :src="btn.icon" />
          </div>
        </mew-button>
      </div>
    </div>
    <!--
    =====================================================================================
      Access With Keystore
    =====================================================================================
    -->
    <access-wallet-keystore
      v-if="walletType === state.types.KEYSTORE"
      :handler-access-wallet="state.accessHandler"
      class="mb-6"
      @unlock="unlockWallet"
    />
    <!--
    =====================================================================================
      Access With Mnemonic
    =====================================================================================
    -->
    <access-wallet-mnemonic
      v-if="walletType === state.types.MNEMONIC"
      :handler-access-wallet="state.accessHandler"
      :switch-address="switchAddress"
      class="mb-6"
      @unlock="unlockWallet"
    />
    <!--
    =====================================================================================
      Access With PrivateKey
    =====================================================================================
    -->
    <access-wallet-private-key
      v-else-if="walletType === state.types.PRIVATE_KEY"
      :handler-access-wallet="state.accessHandler"
      class="mb-6"
      @unlock="unlockWallet"
    />
    <!--
    =====================================================================================
      Warning
    =====================================================================================
    -->
    <mew-warning-sheet
      title="Not Recommended"
      description="This information is sensitive, and these options should only be used in offline settings by experienced crypto users."
      :link-obj="state.warningSheetObj"
      class="mt-0 mb-0"
    />
  </mew-overlay>
</template>

<script setup lang="ts">
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import { SOFTWARE_WALLET_TYPES } from './software/handlers/helpers';
import { ROUTES_WALLET } from '@/core/configs/configRoutes';

import handlerAccessWalletSoftware from './software/handlers/handlerAccessWalletSoftware';

import AccessWalletKeystore from './software/components/AccessWalletKeystore';
import AccessWalletMnemonic from './software/components/AccessWalletMnemonic';
import AccessWalletPrivateKey from './software/components/AccessWalletPrivateKey';
import { useAnalytics } from '@/core/Common/handlerAnalytics';
import { computed, onMounted, onUnmounted, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import MewOverlay from '@/tempComponents/MewOverlay.vue';

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  close: {
    type: Function,
    default: () => {}
  },
  walletType: {
    type: String,
    default: ''
  },
  switchAddress: {
    type: Boolean,
    default: false
  }
});

const state = reactive({
  type: '',
  types: SOFTWARE_WALLET_TYPES,
  warningSheetObj: {
    title: 'Learn More',
    url: ''
  },
  buttons: [
    /* Keystore Button */
    {
      label: 'Keystore',
      icon: require('@/assets/images/icons/icon-keystore-file.svg'),
      fn: () => {
        setType(SOFTWARE_WALLET_TYPES.KEYSTORE);
      }
    },
    /* Mnemonic */
    {
      label: 'Mnemonic Phrase',
      icon: require('@/assets/images/icons/icon-mnemonic.svg'),
      fn: () => {
        setType(SOFTWARE_WALLET_TYPES.MNEMONIC);
      }
    },
    /* Private Key */
    {
      label: 'Private Key',
      icon: require('@/assets/images/icons/icon-private-key-grey.png'),
      class: 'AccessPrivateKeyWallet',
      fn: () => {
        if (process.env.VUE_APP_PRIV_KEY && state.accessHandler) {
          state.accessHandler.unlockPrivateKeyWallet(
            process.env.VUE_APP_PRIV_KEY
          );
          unlockWallet();
        } else {
          setType(SOFTWARE_WALLET_TYPES.PRIVATE_KEY);
        }
      }
    }
  ],
  accessHandler: {},
  footer: {
    text: 'Need help?',
    linkTitle: 'Contact support',
    link: 'mailto:support@myetherwallet.com'
  }
});

/**
 * @returns if the back button on overlay should be displayed
 */
const showBackBtn = computed(() => {
  return props.walletType !== SOFTWARE_WALLET_TYPES.OVERVIEW;
});
/**
 * @returns correct title of the overlay according to the wallet type selected
 */
const title = computed(() => {
  if (props.switchAddress) return 'Switch Address';
  switch (props.walletType) {
    case SOFTWARE_WALLET_TYPES.KEYSTORE:
      return 'Access Wallet with Keystore File';
    case SOFTWARE_WALLET_TYPES.MNEMONIC:
      return 'Access Wallet with Mnemonic Phrase';
    case SOFTWARE_WALLET_TYPES.PRIVATE_KEY:
      return 'Access Wallet with Private Key';
    default:
      return 'Select Software Wallet';
  }
});
// TODO add when store states are available
// ...mapState('external', ['path']),
// ...mapState('wallet', ['identifier', 'isOfflineApp']),
// ...mapGetters('article', ['getArticle'])

watch(
  () => props.open,
  () => {
    if (identifier && props.switchAddress && props.open) {
      setType(identifier);
    }
  }
);
/**
 * Lifecycle hooks to create and destroy access wallet handler
 */
onMounted(() => {
  state.accessHandler = new handlerAccessWalletSoftware();
  if (isOfflineApp) {
    state.footer = {
      text: 'Need help? Email us at support@myetherwallet.com',
      linkTitle: '',
      link: ''
    };
    state.warningSheetObj = {};
  } else state.warningSheetObj.url = getArticle('not-rec-when-access-wallet');
});
onUnmounted(() => {
  state.accessHandler = {};
});

const router = useRouter();
const { trackAccessWallet } = useAnalytics();

/**
 * Sets Wallet in the store
 */
// TODO enable when store actions are available
// ...mapActions('wallet', ['setWallet']),

/**
 * Sets Wallet and Pushes new route query param
 * Used in overlay back button
 * account is defined in Mnemonic phrase access
 */
const unlockWallet = (account = undefined) => {
  try {
    const wallet = !account ? state.accessHandler.getWalletInstance() : account;
    setWallet([wallet])
      .then(() => {
        if (props.switchAddress) {
          props.close();
          return;
        }
        if (path !== '') {
          router.push({ path: path });
        } else {
          router.push({ name: ROUTES_WALLET.WALLETS.NAME });
        }
        trackAccessWallet(state.type);
      })
      .catch(e => {
        Toast(e, {}, ERROR);
      });
  } catch (e) {
    Toast(e, {}, ERROR);
  }
};

/**
 * Directs user back to software overview
 * Pushes new route query param
 * Used in overlay back button
 */
const accessBack = () => {
  if (props.walletType !== SOFTWARE_WALLET_TYPES.OVERVIEW) {
    try {
      router.push({
        query: { type: SOFTWARE_WALLET_TYPES.OVERVIEW }
      });
    } catch (e) {
      Toast(e, {}, ERROR);
    }
  }
};

/**
 * Sets a wallet type, pushes new route
 * This method is used in create overview block
 * @type - must be one of the SOFTWARE_WALLET_TYPES
 */
const setType = (newType: string) => {
  if (Object.values(SOFTWARE_WALLET_TYPES).includes(newType)) {
    try {
      state.type = newType;
      router.push({
        query: { type: newType }
      });
    } catch (e) {
      Toast(e, {}, ERROR);
    }
  } else {
    throw new Error('Not a valid type!');
  }
};
</script>
