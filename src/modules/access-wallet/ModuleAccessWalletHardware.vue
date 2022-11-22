<template>
  <!--
=====================================================================================
  Overlay - access using hardware
=====================================================================================
-->
  <mew-overlay
    :footer="{
      text: state.step === 1 ? 'Need help? Read about' : 'Need help? Read',
      linkTitle: footerLink.title,
      link: footerLink.url
    }"
    :show-overlay="open"
    :title="title"
    :back="showBack ? undefined : back"
    :close="overlayClose"
    content-size="xlarge"
  >
    <div
      v-if="state.step === 1"
      :class="[
        'pa-5 mb-4 full-width text-center rounded subtitle-container',
        isMobile ? 'mt-3' : ''
      ]"
    >
      <span class="full-width"
        >The highest standard of security in the crypto space.
        <router-link to="/buy-hardware">
          Get a Hardware Wallet today
        </router-link>
      </span>
    </div>
    <!--
        =====================================================================================
        Step 1: Select hardware wallet
        =====================================================================================
        -->
    <div v-if="state.step === 1">
      <!--
      =====================================================================================
        Different hardware instances
      =====================================================================================
      -->
      <v-row dense no-gutters justify="start">
        <v-col
          v-for="button in state.buttons"
          :key="button.label"
          class="button-container full-width pa-1"
          cols="12"
          sm="6"
        >
          <mew-button
            has-full-width
            style="height: 90px"
            color-theme="greyMedium"
            btn-style="outline"
            @click="
              button.bluetooth && !state.bluetooth
                ? (state.bluetoothModal = true)
                : setWalletInstance(button)
            "
          >
            <div class="text-left d-flex align-center" style="width: 100%">
              <img width="40" class="mr-4" :src="button.icon" />
              <div class="mew-heading-3 textDark--text">
                {{ button.label }}
              </div>
            </div>
          </mew-button>
        </v-col>
      </v-row>
    </div>
    <v-dialog v-model="state.bluetoothModal" persistent max-width="500">
      <v-sheet color="white" class="pa-5">
        <h2 class="mb-5 text-center">Bluetooth Required</h2>
        <v-list>
          <h3>Supported Browsers</h3>
          <v-list-item v-for="(browser, i) in state.supportedBrowsers" :key="i">
            <v-list-item-content>
              <v-list-item-title>
                {{ browser }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <h4 class="mb-5">* Remember to enable bluetooth on your device</h4>
        <h3 class="mb-5 text-center">Enable bluetooth on supported browsers</h3>
        <v-expansion-panels
          v-for="(browser, i) in state.enableBluetooth"
          :key="i"
          class="mt-1"
          accordion
        >
          <v-expansion-panel>
            <v-expansion-panel-header>
              {{ browser.title }}
            </v-expansion-panel-header>
            <v-expansion-panel-content
              v-for="(direction, browserIndex) in browser.direction"
              :key="browserIndex"
            >
              <h4 class="mb-3">{{ direction.title }}</h4>
              <ul v-for="(s, index) in direction.steps" :key="index">
                <li v-if="s.length" class="mb-1">
                  {{ s }}
                </li>
                <li v-if="!s.length" class="mb-1">
                  <a :href="s.link" target="_blank">Learn More</a>
                </li>
              </ul>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <div class="text-center">
          <mew-button
            class="mt-6"
            title="Close"
            btn-size="xlarge"
            btn-style="outline"
            @click="state.bluetoothModal = false"
          />
        </div>
      </v-sheet>
    </v-dialog>
    <!--
            =====================================================================================
              Step 2: Start Access to Selected Hardware Wallet
            =====================================================================================
            -->
    <div v-if="state.step <= walletInitialized" class="full-width">
      <!--
        =====================================================================================
          Bitbox2
        =====================================================================================
        -->
      <access-wallet-bitbox
        v-if="onBitbox2"
        :paths="paths"
        :set-path="setPath"
        :hw-wallet-instance="state.hwWalletInstance"
        :unlock="bitbox02Unlock"
        :device-not-paired="bitBox2NotPaired"
        :device-connected="bitBox2Connected"
        :device-unpaired="bitBox2Unpaired"
        :device-pairing-code="bitBox2PairingCode"
        :device-confirmed="bitBox2Confirmed"
        :device-initialized="bitBox2Initialized"
      />
      <!--
        =====================================================================================
          Keepkey
        =====================================================================================
        -->
      <access-wallet-keepkey
        v-if="onKeepkey"
        :paths="paths"
        :selected-path="state.selectedPath"
        :handler-loaded="state.loaded"
        :set-path="setPath"
      />
      <!--
        =====================================================================================
          Cool Wallet
        =====================================================================================
        -->
      <access-wallet-cool-wallet
        v-if="onCoolWallet"
        :cool-wallet-unlock="coolWalletUnlock"
        :password-error="state.passwordError"
        @password="setPassword"
      />
      <!--
        =====================================================================================
          Ledger
        =====================================================================================
        -->
      <access-wallet-ledger
        v-if="onLedger || onLedgerX"
        :ledger-unlock="nextStep"
        :ledger-apps="state.ledgerApps"
        :paths="paths"
        :selected-path="state.selectedPath"
        :set-path="setPath"
        @setBluetoothLedgerUnlock="setBluetoothLedgerUnlock"
      />

      <!--
        =====================================================================================
          Trezor
        =====================================================================================
        -->
      <div v-if="onTrezor">
        <access-wallet-trezor :trezor-unlock="trezorUnlock" :reset="reset" />
      </div>
    </div>
    <!--
      =====================================================================================
        Step 3: Select Address and Network | (If Applicable)
      =====================================================================================
      -->
    <!--
    =====================================================================================
    Network Address Step
    =====================================================================================
    -->
    <access-wallet-address-network
      v-if="state.step > walletInitialized"
      :back="null"
      :hide-path-selection="onKeepkey || onLedger"
      :disable-custom-paths="onLedger"
      :handler-wallet="state.hwWalletInstance"
      :selected-path="state.selectedPath"
      :paths="paths"
      :hide-networks="switchAddress"
      @unlock="setHardwareWallet"
      @setPath="setPath"
    />
  </mew-overlay>
</template>

<script setup lang="ts">
import { isEmpty, isObject } from 'lodash';
import { mapActions, mapGetters, mapState } from 'vuex';

import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';

import appPaths from './hardware/handlers/hardwares/ledger/appPaths.js';
import allPaths from '@/modules/access-wallet/hardware/handlers/bip44';
import wallets from '@/modules/access-wallet/hardware/handlers/configs/configWallets';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import { ROUTES_WALLET } from '@/core/configs/configRoutes';
import { EventBus } from '@/plugins/eventBus';
import { computed, onMounted, onUnmounted, reactive, watch } from 'vue';
import AccessWalletKeepkey from './hardware/components/AccessWalletKeepkey';
import AccessWalletCoolWallet from './hardware/components/AccessWalletCoolWallet';
import AccessWalletTrezor from './hardware/components/AccessWalletTrezor.vue';
import AccessWalletLedger from './hardware/components/AccessWalletLedger.vue';
import AccessWalletLedgerX from './hardware/components/AccessWalletLedgerX.vue';
import AccessWalletAddressNetwork from '@/modules/access-wallet/common/components/AccessWalletAddressNetwork';
import AccessWalletBitbox from './hardware/components/AccessWalletBitbox';

import { useAnalytics } from '@/core/Common/handlerAnalytics';

import MewOverlay from '@/tempComponents/MewOverlay.vue';
import { useRouter } from 'vue-router';
import { useDisplay } from 'vuetify/lib/framework.mjs';

const concatAddress = (val: string) => {
  // should probably be moved globablly
  return `${val.substring(0, 11)}...${val.substring(
    val.length - 4,
    val.length
  )}`;
};

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  close: {
    type: Function,
    default: () => {}
  },
  switchAddress: {
    type: Boolean,
    default: false
  }
});

const state = reactive({
  buttons: [
    {
      label: 'Ledger',
      icon: require('@/assets/images/icons/hardware-wallets/Ledger-Nano-X-Label-Icon.svg'),
      type: WALLET_TYPES.LEDGER
    },
    {
      label: 'Trezor',
      icon: require('@/assets/images/icons/hardware-wallets/icon-trezor.svg'),
      type: WALLET_TYPES.TREZOR
    },
    {
      label: 'KeepKey',
      icon: require('@/assets/images/icons/hardware-wallets/icon-keepkey.svg'),
      type: WALLET_TYPES.KEEPKEY
    },
    {
      label: 'BitBox02',
      icon: require('@/assets/images/icons/hardware-wallets/icon-bitbox.svg'),
      type: WALLET_TYPES.BITBOX2
    },
    {
      label: 'CoolWallet',
      icon: require('@/assets/images/icons/hardware-wallets/icon-coolwallet.svg'),
      type: WALLET_TYPES.COOL_WALLET,
      bluetooth: true
    }
  ],
  enableBluetooth: [
    {
      title: 'Chrome',
      direction: [
        {
          title: 'Enable experimental flags',
          steps: [
            'chrome://flags/#enable-web-bluetooth',
            'chrome://flags/#enable-web-bluetooth-new-permissions-backend',
            'chrome://flags/#enable-experimental-web-platform-features'
          ]
        },
        {
          title: 'Official browser directions',
          steps: [
            {
              link: 'https://support.google.com/chrome/answer/6362090?hl=en&co=GENIE.Platform%3DDesktop'
            }
          ]
        }
      ]
    },
    {
      title: 'Opera',
      direction: [
        {
          title: 'Enable experimental flags',
          steps: [
            'opera://flags/#enable-web-bluetooth-new-permissions-backend',
            'opera://flags/#enable-experimental-web-platform-features'
          ]
        }
      ]
    },
    {
      title: 'Edge',
      direction: [
        {
          title: 'Official browser directions',
          steps: [
            {
              link: 'https://support.microsoft.com/en-us/microsoft-edge/connect-a-website-to-a-bluetooth-or-usb-device-in-microsoft-edge-107ba8a4-60aa-0fd3-2d26-afd63d0964f4'
            }
          ]
        }
      ]
    }
  ],
  bluetooth: false,
  bluetoothModal: false,
  supportedBrowsers: ['Chrome', 'Edge', 'Opera'],
  ledgerApps: appPaths.map(item => {
    return {
      name: item.network.name_long,
      value: item.network.name,
      img: item.network.icon
    };
  }),
  wallets: wallets,
  step: 1,
  hwWalletInstance: {},
  ledgerApp: {},
  selectedPath: {
    name: 'Ethereum',
    value: "m/44'/60'/0'"
  },
  walletType: '',
  selectedLedgerApp: {},
  password: '',
  loaded: false,
  ledgerConnected: false,
  callback: () => {},
  unwatch: () => {},
  passwordError: false,
  transport: null,
  address: '',
  ledgerBluetooth: false
});

// TODO enable once stores are available
// ...mapGetters('global', ['Networks', 'network']),
// ...mapGetters('wallet', ['getLedgerApp']),
// ...mapState('wallet', ['identifier', 'ledgerBLE']),

const isMobile = computed(() => {
  const { smAndDown } = useDisplay();
  return smAndDown.value;
});

const walletInitialized = computed(() => {
  return state.wallets[state.walletType]
    ? state.wallets[state.walletType]?.when
    : 1;
});
/**
 * Returns the correct network icon
 */
const icon = computed(() => {
  if (getLedgerApp !== null) {
    const found = appPaths.find(item => {
      return item.network.name_long === getLedgerApp.name;
    });
    return found ? found.network.icon : appPaths[0].network.icon;
  }
  return appPaths[0].network.icon;
});
/**
 * Footer links to display beneath container
 * TODO: get link urls from Russ
 */
const footerLink = computed(() => {
  // Commented for now as the new articles aren't available yet
  // if (this.onKeepkey) {
  //   return {
  //     title: 'Using a KeepKey Hardware wallet with MEW',
  //     url: 'https://kb.myetherwallet.com/en/hardware-wallets/using-keepkey-with-mew/'
  //   };
  // } else if (this.onCoolWalletS) {
  //   return {
  //     title: 'Using a CoolWallet S Hardware Wallet with MEW',
  //     url: 'https://kb.myetherwallet.com/en/hardware-wallets/using-coolwallet-with-mew/'
  //   };
  // }
  // if (this.onLedger) {
  //   return {
  //     title: 'Using a Ledger Hardware wallet with MEW',
  //     url: 'https://kb.myetherwallet.com/en/hardware-wallets/using-ledger-with-mew/'
  //   };
  // }
  // if (this.onTrezor) {
  //   return {
  //     title: 'Using a Trezor Hardware wallet with MEW',
  //     url: 'https://kb.myetherwallet.com/en/hardware-wallets/using-trezor-with-mew/'
  //   };
  // }
  return {
    title: 'Hardware Wallets',
    url: 'https://help.myetherwallet.com/en/collections/3043244-access-wallet'
  };
});
const showBack = computed(() => {
  if (props.switchAddress) {
    return state.step === 2;
  }

  return state.step === 1;
});
/**
 * On Bitbox2
 */
const onBitbox2 = computed(() => {
  return state.walletType === WALLET_TYPES.BITBOX2;
});
/**
 * On Ledger
 */
const onLedger = computed(() => {
  return state.walletType == WALLET_TYPES.LEDGER;
});
/**
 * On Ledger X
 */
const onLedgerX = computed(() => {
  return state.walletType === WALLET_TYPES.LEDGER;
});
/**
 * On CoolWallet
 */
const onCoolWallet = computed(() => {
  return (
    state.walletType === WALLET_TYPES.COOL_WALLET &&
    isEmpty(state.hwWalletInstance)
  );
});
/**
 * On Keepkey
 */
const onKeepkey = computed(() => {
  return state.walletType === WALLET_TYPES.KEEPKEY;
});
/**
 * On Trezor
 */
const onTrezor = computed(() => {
  return state.walletType === WALLET_TYPES.TREZOR;
});
/**
 * On Password step
 */
const onPassword = computed(() => {
  return (
    state.walletType !== '' &&
    state.wallets[state.walletType] &&
    state.wallets[state.walletType].requiresPassword &&
    (state.step === 3 || state.step === 1)
  );
});
/**
 * On Paths step
 */
const paths = computed(() => {
  const newArr: { name: string; value: string }[] = [];
  if (state.walletType === WALLET_TYPES.LEDGER) {
    if (getLedgerApp !== null) {
      const found = appPaths.find(item => {
        return item.network.name_long === getLedgerApp.name;
      });
      const path = found ? found.paths : appPaths[0].paths;
      return path.map(item => {
        return {
          name: item.label,
          value: item.path
        };
      });
    }

    appPaths[0].paths.forEach(item => {
      newArr.push({
        name: item.label,
        value: item.path
      });
    });
  }
  if (
    state.wallets[state.walletType] &&
    state.wallets[state.walletType].hasPaths
  ) {
    allPaths[state.walletType].forEach(item => {
      newArr.push({
        name: item.label,
        value: item.path
      });
    });
  }
  return newArr;
});
/**
 * Overlay title
 */
const title = computed(() => {
  if (props.switchAddress) return 'Switch Address';
  if (state.step > walletInitialized.value) {
    return 'Select Network and Address';
  } else if (state.step === 1) {
    return 'Select a hardware wallet';
  }
  if (onBitbox2.value) return bitbox2Titles;
  return state.walletType
    ? state.wallets[state.walletType].title
    : 'Select a hardware wallet';
});
const bitBox2NotPaired = computed(() => {
  return (
    isEmpty(state.hwWalletInstance) ||
    (!isEmpty(state.hwWalletInstance) && !state.hwWalletInstance?.status)
  );
});
const bitBox2Connected = computed(() => {
  return (
    !bitBox2NotPaired.value && state.hwWalletInstance?.status === 'connected'
  );
});
const bitBox2Unpaired = computed(() => {
  return (
    !bitBox2NotPaired.value && state.hwWalletInstance?.status === 'unpaired'
  );
});
const bitBox2Initialized = computed(() => {
  return (
    !bitBox2NotPaired.value && state.hwWalletInstance?.status === 'initialized'
  );
});
const bitBox2PairingCode = computed(() => {
  return !bitBox2NotPaired.value ? state.hwWalletInstance?.pairingCode : '';
});
const bitBox2Confirmed = computed(() => {
  return !bitBox2NotPaired.value
    ? state.hwWalletInstance?.pairingConfirmed
    : false;
});
const bitbox2Titles = computed(() => {
  if (bitBox2Connected.value) return 'Enter BitBox02 password';
  if (bitBox2Unpaired.value) return 'Confirm pairing code';
  if (bitBox2Initialized.value)
    return 'BitBox02 succesfully initialized. Loading wallet';
  return state.walletType ? state.wallets[state.walletType].title : '';
});

const that = this;
watch(
  () => state.selectedPath,
  () => {
    /**
     * only call this when hwWalletInstance is not empty (ledger will error out)
     * and when walletType has been selected (closing modal will error out)
     */
    if (state.walletType && !isEmpty(state.hwWalletInstance)) {
      state.hwWalletInstance = {};
      that[`${state.walletType}Unlock`]();
    }
  },
  { deep: true }
);

watch(
  () => props.open,
  newVal => {
    if (newVal && props.switchAddress) setupSwitchAddress();
  }
);

onMounted(async () => {
  /**
   * errors and resets for disconnect of ble
   */
  EventBus.$on('bleDisconnect', () => {
    reset();
  });

  try {
    const { bluetooth } = navigator;
    if (!bluetooth) return (state.bluetooth = false);
    state.bluetooth = await bluetooth.getAvailability();
  } catch (e) {
    Toast(e, {}, ERROR);
  }
});

onUnmounted(() => {
  EventBus.$off('bleDisconnect');
});

// TODO enable back once stores are available
// ...mapActions('wallet', [
//   'setWallet',
//   'setLedgerBluetooth',
//   'setLedgerApp'
// ])
/**
 * Resets the Data
 */
const reset = () => {
  state.step = 1;
  state.hwWalletInstance = {};
  state.selectedPath = paths.value;
  //setLedgerApp(state.ledgerApps[0]);
  state.password = '';
  state.walletType = '';
  state.ledgerConnected = false;
  state.ledgerBluetooth = false;
};
/**
 * Sets up switch address
 */
const setupSwitchAddress = () => {
  state.walletType = identifier;
  if (identifier === WALLET_TYPES.LEDGER) {
    state.ledgerBluetooth = ledgerBLE;
  }
  nextStep();
};
/**
 * calls this.close and this.setupSwitchAddress
 */
const closeAndSetupSwitch = () => {
  reset();
  setupSwitchAddress();
  close();
};
/**
 * Overlay Action: Back
 * if on keepkey step 3, it will return to step 1 so it will reset everything
 */
const back = () => {
  if (state.step > 0) {
    if (state.step === 1) {
      reset();
    } else if (state.step === 2) {
      state.step = 1;
      state.walletType = '';
    } else {
      state.hwWalletInstance = {};
      if (onLedger.value || onLedgerX.value) {
        state.step = 2;
        //this[`${this.walletType}Unlock`]();
      } else {
        state.walletType = '';
        state.step = 1;
      }
    }
  } else {
    close('showHardware');
  }
};
const overlayClose = () => {
  reset();
  close('showHardware');
};
const trezorClose = () => {
  state.step = 2;
  state.walletType = WALLET_TYPES.TREZOR;
};
const setWalletInstance = btnObj => {
  state.walletType = btnObj.type;
  nextStep();
};
const nextStep = () => {
  if (state.walletType) {
    state.step++;
    if (state.step === walletInitialized.value) {
      if (onCoolWallet.value || onBitbox2.value) return;
      that[`${state.walletType}Unlock`]();
    }
  }
};
/**
 * Unlock the hardware wallets
 */
const ledgerUnlock = () => {
  if (state.ledgerBluetooth) {
    bluetoothLedgerUnlock();
  } else {
    unlockPathOnly();
  }
};
const setBluetoothLedgerUnlock = () => {
  state.ledgerBluetooth = true;
  nextStep();
};
const bluetoothLedgerUnlock = () => {
  unlockPathOnly();
};
const trezorUnlock = () => {
  unlockPathOnly();
};
const bitbox02Unlock = () => {
  unlockPathOnly();
};
const keepkeyUnlock = () => {
  unlockPathOnly();
};
const coolWalletUnlock = () => {
  unlockPathAndPassword(null, state.password);
};
/**
 * Unlock only the path step
 */
const unlockPathOnly = () => {
  const path = isObject(state.selectedPath)
    ? state.selectedPath.hasOwnProperty('value')
      ? state.selectedPath?.value
      : state.selectedPath
    : paths.value[0].value;
  state.wallets[state.walletType]
    .create(path, state.ledgerBluetooth, getLedgerApp)
    .then(_hwWallet => {
      try {
        state.loaded = true;
        if (onLedgerX.value || onLedger.value) nextStep();
        if ((onTrezor.value || onKeepkey.value) && state.step === 2)
          state.step++;
        if (onBitbox2.value) {
          state.hwWalletInstance = _hwWallet;
          if (!state.hwWalletInstance) {
            state.wallets[state.walletType].create.errorHandler(
              'bitboxInstanceError'
            );
            return;
          }
          state.hwWalletInstance
            .init()
            .then(() => {
              nextStep();
            })
            .catch(e => {
              state.wallets[state.walletType].create.errorHandler(e);
              if (e.message === 'Error: Pairing rejected') {
                reset();
              }
            });
        } else {
          state.hwWalletInstance = _hwWallet;
        }
      } catch (err) {
        state.wallets[state.walletType].create.errorHandler(err);
      }
    })
    .catch(err => {
      if (onLedger.value || onLedgerX.value) state.step--;
      if (state.wallets[state.walletType]) {
        state.wallets[state.walletType].create.errorHandler(err);
      } else {
        Toast(err, {}, ERROR);
      }
      onTrezor.value ? trezorClose() : reset();
    });
};
/**
 * Unlock the path and password step
 */
const unlockPathAndPassword = (path: string, password: string) => {
  wallets[state.walletType]
    .create(path, password)
    .then(_hwWallet => {
      state.hwWalletInstance = _hwWallet;
      state.step++;
    })
    .catch(e => {
      if (wallets[state.walletType]) {
        if (
          e.message === 'Wrong Password' &&
          state.walletType === WALLET_TYPES.COOL_WALLET
        ) {
          state.passwordError = true;
        } else {
          wallets[state.walletType].create.errorHandler(e);
        }
      } else {
        Toast(e, {}, ERROR);
      }
      if (e.message !== 'Wrong Password') {
        reset();
      }
    });
};
/**
 * Sets Path
 */
const setPath = (obj: string) => {
  state.selectedPath = obj;
};

const router = useRouter();
const { trackAccessWallet } = useAnalytics();

/**
 * Set the selected wallet
 */
const setHardwareWallet = wallet => {
  try {
    setWallet([wallet])
      .then(() => {
        trackAccessWallet(wallet.identifier);
        if (!props.switchAddress) {
          if (wallet.identifier === WALLET_TYPES.LEDGER) {
            setLedgerBluetooth(state.ledgerBluetooth);
          }
          router.push({ name: ROUTES_WALLET.DASHBOARD.NAME });
        } else {
          reset();
          close();
        }
      })
      .catch(e => {
        reset();
        Toast(e, {}, ERROR);
      });
  } catch (e) {
    reset();
    Toast(e, {}, ERROR);
  }
};
/**
 * Sets Password
 */
const setPassword = (str: string) => {
  state.password = str;
  state.passwordError = false;
};
</script>

<style lang="scss" scoped>
.subtitle-container {
  background-color: rgba(109, 137, 166, 0.06);
}
.button-container {
  height: 100px;
}

@media screen and (min-width: 800px) {
  .expand-width {
    min-width: 740px;
  }
}
</style>
