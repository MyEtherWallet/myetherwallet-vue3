<template>
  <div>
    <v-navigation-drawer
      v-model="state.navOpen"
      app
      class="wallet-sidemenu"
      width="300"
      :dark="$vuetify.theme.current.value.dark"
      color="#07385F"
    >
      <template #prepend>
        <mew-overlay
          :footer="state.footer"
          :show-overlay="
            state.isOpenNetworkOverlay || !globalStore.validNetwork
          "
          :title="
            globalStore.validNetwork
              ? 'Select Network'
              : 'Current network is not supported. Select a network below.'
          "
          content-size="large"
          :close="globalStore.validNetwork ? closeNetworkOverlay : null"
        >
          <network-switch
            :filter-types="filterNetworks"
            :is-swap-page="isSwapPage"
          />
        </mew-overlay>
        <div class="pa-5 pb-3">
          <div class="mt-2 mb-4 d-flex align-center justify-space-between">
            <!-- ================================================================================== -->
            <!-- MEW logo -->
            <!-- ================================================================================== -->
            <router-link :to="offlineModeRoute">
              <img width="120" src="@/assets/images/icons/logo-mew.svg" />
            </router-link>

            <!-- ================================================================================== -->
            <!-- Close Navigation Bar for xs-md screens -->
            <!-- ================================================================================== -->
            <v-btn
              icon
              class="d-block d-lg-none"
              @click="state.navOpen = false"
            >
              <v-icon color="white">mdi-close</v-icon>
            </v-btn>
          </div>

          <!-- ================================================================================== -->
          <!-- Wallet balance card -->
          <!-- ================================================================================== -->
          <balance-card :sidemenu-status="state.navOpen" />
        </div>
      </template>

      <!-- ================================================================================== -->
      <!-- Buy Sell / Send / Swap buttons -->
      <!-- ================================================================================== -->
      <v-list v-if="!walletStore.isOfflineApp" class="px-5">
        <v-list-item-group>
          <div class="d-flex align-center">
            <v-list-item
              class="px-0"
              active-class="remove-select-state"
              @click="openMoonpay"
            >
              <div class="text-center mx-auto my-2" @click="trackBuySellFunc">
                <img
                  src="@/assets/images/icons/menu/icon-menu-buy-sell.svg"
                  alt="Buy or Sell"
                  height="30"
                />
                <div class="white--text mew-label btn-title">Buy/Sell</div>
              </div>
            </v-list-item>

            <v-divider vertical class="mx-3"></v-divider>

            <v-list-item
              class="px-0 SendTransaction"
              :to="{ name: ROUTES_WALLET.SEND_TX.NAME }"
            >
              <div class="text-center mx-auto my-2">
                <img
                  src="@/assets/images/icons/menu/icon-menu-send.svg"
                  alt="Send"
                  height="30"
                />
                <div class="white--text mew-label btn-title">Send</div>
              </div>
            </v-list-item>

            <v-divider vertical class="mx-3"></v-divider>

            <v-list-item
              :class="[
                !globalStore.hasSwap ? 'opacity--30 pointer-event--none' : ''
              ]"
              class="px-0 SwapButton"
              :to="{ name: ROUTES_WALLET.SWAP.NAME }"
              @click="trackToSwap"
            >
              <div class="text-center mx-auto my-2">
                <img
                  src="@/assets/images/icons/menu/icon-menu-swap.svg"
                  alt="Swap"
                  height="30"
                />
                <div class="white--text mew-label btn-title">Swap</div>
              </div>
            </v-list-item>
          </div>
        </v-list-item-group>
      </v-list>

      <!-- ================================================================================== -->
      <!-- Wallet Side Nav -->
      <!-- ================================================================================== -->
      <v-list>
        <v-list-item-group>
          <template v-for="(item, idx) in sectionOne">
            <v-list-item
              v-if="!item.children && shouldShow(item.route)"
              :key="item + idx + 1"
              :to="item.route"
            >
              <v-list-item-icon class="mx-3">
                <img
                  width="26"
                  height="26"
                  :src="item.icon"
                  :alt="item.title"
                />
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title
                  class="white--text font-weight-regular mew-body"
                >
                  {{ item.title }}
                </v-list-item-title>
              </v-list-item-content>
              <div
                v-if="item.hasNew"
                class="new-dapp-label white--text mew-label px-1"
              >
                new
              </div>
            </v-list-item>

            <!-- Sub-menu items -->
            <v-list-group
              v-if="item.children"
              :key="item + idx + 2"
              prepend-icon=""
              :value="expendSubMenu(item.children)"
            >
              <template #activator>
                <v-list-item-icon class="mx-3">
                  <img
                    width="26"
                    height="26"
                    :src="item.icon"
                    :alt="item.title"
                  />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title
                    class="white--text font-weight-regular mew-body"
                  >
                    {{ item.title }}
                  </v-list-item-title>
                </v-list-item-content>
              </template>
              <v-list-item
                v-for="child in item.children"
                :key="child.title"
                dense
                class="pl-4"
                :to="child.route"
              >
                <v-list-item-content>
                  <v-list-item-title
                    class="pl-13 white--text font-weight-regular mew-body"
                  >
                    {{ child.title }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
          </template>
        </v-list-item-group>
      </v-list>

      <v-divider class="my-4 mx-6" />

      <v-list>
        <v-list-item
          v-for="(item, idx) in sectionTwo"
          :key="item + idx"
          :to="item.route"
          @click="item.fn()"
        >
          <v-list-item-icon class="mx-3">
            <img width="26" height="26" :src="item.icon" :alt="item.title" />
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="white--text mew-body font-weight-regular">
              {{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <div v-if="globalStore.online" class="mt-3 px-8">
          <div class="matomo-tracking-switch">
            <v-switch
              dark
              :input-value="popupStore.consentToTrack"
              inset
              :label="`Data Tracking is ${
                popupStore.consentToTrack ? 'On' : 'Off'
              }`"
              color="white"
              off-icon="mdi-alert-circle"
              @change="setConsent"
            />
          </div>
          <div class="d-flex align-center justify-space-between">
            <!-- <theme-switch /> -->
            <a
              :href="`https://github.com/MyEtherWallet/MyEtherWallet/releases/tag/v${VERSION}`"
              target="_blank"
              class="greyPrimary--text"
              >v{{ VERSION }}</a
            >
          </div>
        </div>
      </v-list>
    </v-navigation-drawer>
    <mew-popup
      max-width="400px"
      hide-close-btn
      :show="state.showLogoutPopup"
      :title="$t('interface.menu.logout')"
      :left-btn="{ text: 'Cancel', method: toggleLogout, color: 'basic' }"
      :right-btn="{
        text: 'Log out',
        color: 'error',
        method: onLogout,
        enabled: true
      }"
    ></mew-popup>
    <module-settings
      :on-settings="state.onSettings"
      @closeSettings="closeSettings"
    />
    <!--
    =====================================================================================
      Navigation Bar on top of the screen for xs-md screens
      <app-btn-menu /> opens navigation drawer
    =====================================================================================
    -->
    <v-system-bar
      v-if="!$vuetify.display.lgAndUp"
      color="#0b1a40"
      app
      :height="60"
      class="d-flex d-lg-none"
    >
      <v-row class="pa-3 align-center justify-space-between">
        <app-btn-menu class="mr-3" @click="openNavigation" />

        <router-link :to="offlineModeRoute" style="line-height: 0">
          <img height="26" src="@/assets/images/icons/logo-mew.svg" />
        </router-link>
        <v-spacer />
        <module-notifications v-if="!walletStore.isOfflineApp" invert-icon />
      </v-row>
    </v-system-bar>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue';
import send from '@/assets/images/icons/icon-send-enable.svg';
import dashboard from '@/assets/images/icons/icon-dashboard-enable.svg';
import nft from '@/assets/images/icons/icon-nft.svg';
import dapp from '@/assets/images/icons/icon-dapp-center-enable.svg';
import contract from '@/assets/images/icons/icon-contract-enable.svg';
import message from '@/assets/images/icons/icon-message-enable.svg';
import settings from '@/assets/images/icons/icon-setting-enable.svg';
import logout from '@/assets/images/icons/icon-logout-enable.svg';
import { tryOnBeforeUnmount, tryOnMounted } from '@vueuse/shared';

import { EventBus } from '@/plugins/eventBus';
import { ETH, BSC, MATIC } from '@/utils/networks/types';
import { ROUTES_WALLET } from '@/core/configs/configRoutes';
//import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
//import dappsMeta from '@/dapps/metainfo-dapps';
import { from } from '@apollo/client/core';
import { MOONPAY_EVENT } from '@/modules/moon-pay/helpers';
//import isNew from '@/core/helpers/isNew.js';
import AppBtnMenu from '@/core/components/AppBtnMenu.vue';
import BalanceCard from '@/modules/balance/ModuleBalanceCard.vue';
import ModuleSettings from '@/modules/settings/ModuleSettings.vue';
import ModuleNotifications from '@/modules/notifications/ModuleNotifications.vue';
import NetworkSwitch from '@/modules/network/components/NetworkSwitch.vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n, VERSION } from 'vue-i18n';
import { useGlobalStore } from '@/stores/global';
import { useWalletStore } from '@/stores/wallet';
import { usePopupStore } from '@/stores/popups';

const { t } = useI18n({ useScope: 'global' });
const router = useRouter();
const route = useRoute();

const globalStore = useGlobalStore();
const walletStore = useWalletStore();
const popupStore = usePopupStore();
const state = reactive({
  isOpenNetworkOverlay: false,
  navOpen: false,
  onSettings: false,
  showLogoutPopup: false,
  routeNetworks: {
    [ROUTES_WALLET.SWAP.NAME]: [ETH, BSC, MATIC],
    [ROUTES_WALLET.NFT_MANAGER.NAME]: [ETH]
  },
  footer: {
    text: 'Need help?',
    linkTitle: 'Contact support',
    link: 'mailto:support@myetherwallet.com'
  }
});
// ...mapGetters('global', ['network', 'isEthNetwork', 'hasSwap']),
// ...mapState('wallet', ['instance', 'isOfflineApp']),
// ...mapState('global', ['online', 'validNetwork']),
// ...mapState('popups', ['popupStore.consentToTrack']),
/**
 * IMPORTANT TO DO:
 * @returns {boolean}
 */
const filterNetworks = computed(() => {
  // if (this.isHardware) {
  //   return [];
  // }
  return [];
});
/**
 * Property returns whether or not you are on the swap page
 * @returns {boolean}
 */
const isSwapPage = computed(() => {
  return route.name === 'Swap';
});
const sectionOne = computed(() => {
  if (globalStore.online) {
    //dappsMeta
    const hasNew = Object.values({}).filter(item => {
      // if (isNew(item.release)) {
      //   return item;
      // }
    });
    return [
      {
        title: t('interface.menu.dashboard'),
        route: offlineModeRoute.value,
        icon: dashboard
      },
      {
        title: t('interface.menu.nft'),
        route: { name: ROUTES_WALLET.NFT_MANAGER.NAME },
        icon: nft
      },
      {
        title: t('interface.menu.dapps'),
        route: { name: ROUTES_WALLET.DAPPS.NAME },
        icon: dapp,
        hasNew: hasNew.length > 0
      },
      {
        title: t('interface.menu.contract'),
        icon: contract,
        children: [
          {
            title: t('interface.menu.deploy'),
            route: { name: ROUTES_WALLET.DEPLOY_CONTRACT.NAME }
          },
          {
            title: t('interface.menu.interact-contract'),
            route: { name: ROUTES_WALLET.INTERACT_WITH_CONTRACT.NAME }
          }
        ]
      },
      {
        title: t('interface.menu.message'),
        icon: message,
        children: [
          {
            title: t('interface.menu.sign-message'),
            route: { name: ROUTES_WALLET.SIGN_MESSAGE.NAME }
          },
          {
            title: t('interface.menu.verify-message'),
            route: { name: ROUTES_WALLET.VERIFY_MESSAGE.NAME }
          }
        ]
      }
    ];
  }
  return [
    {
      title: t('sendTx.send-offline'),
      route: { name: ROUTES_WALLET.SEND_TX_OFFLINE.NAME },
      icon: send
    },
    {
      title: t('interface.menu.sign-message'),
      route: { name: ROUTES_WALLET.SIGN_MESSAGE.NAME },
      icon: message
    }
  ];
});
const sectionTwo = computed(() => {
  if (globalStore.online) {
    return [
      {
        title: t('common.settings'),
        icon: settings,
        fn: openSettings,
        route: { name: ROUTES_WALLET.SETTINGS.NAME }
      },
      {
        title: t('common.logout'),
        icon: logout,
        fn: toggleLogout
      }
    ];
  }
  return [
    {
      title: t('common.logout'),
      icon: logout,
      fn: toggleLogout
    }
  ];
});
const offlineModeRoute = computed(() => {
  return walletStore.isOfflineApp
    ? { name: ROUTES_WALLET.WALLETS.NAME }
    : { name: ROUTES_WALLET.DASHBOARD.NAME };
});

tryOnMounted(() => {
  // If no menu item is selected on load, redirect user to Dashboard
  if (!walletStore.isOfflineApp) {
    redirectToDashboard();
  } else {
    state.footer = {
      text: 'Need help? Email us at support@myetherwallet.com',
      linkTitle: '',
      link: ''
    };
  }

  if (route.name == ROUTES_WALLET.SETTINGS.NAME) {
    openSettings();
  }
  EventBus.$on('openSettings', () => {
    openSettings();
  });
  EventBus.$on('openNetwork', () => {
    openNetwork();
  });
});

tryOnBeforeUnmount(() => {
  EventBus.$off('openSettings');
  EventBus.$off('openNetwork');
});
// ...mapActions('wallet', ['removeWallet']),
const trackToSwap = () => {
  //this.trackSwap('fromSideMenu');
};
const trackBuySellFunc = () => {
  //this.trackBuySell('buySellHome');
};
const closeNetworkOverlay = () => {
  if (globalStore.validNetwork) {
    router.go(-1);
    state.isOpenNetworkOverlay = false;
  }
};
const shouldShow = (route: { name: string }) => {
  if (state.routeNetworks[route.name]) {
    for (const net of state.routeNetworks[route.name]) {
      if (net.name === globalStore.network.type.name) return true;
    }
    return false;
  }
  return true;
};
const openNetwork = () => {
  state.isOpenNetworkOverlay = true;
};
const openMoonpay = () => {
  EventBus.$emit(MOONPAY_EVENT);
};
const openNavigation = () => {
  state.navOpen = true;
};
const openSettings = () => {
  state.onSettings = true;
};
const closeSettings = () => {
  if (router.currentRoute.value.name === ROUTES_WALLET.SETTINGS.NAME)
    router.go(-1);
  state.onSettings = false;
};
const onLogout = () => {
  state.showLogoutPopup = false;
  walletStore.removeWallet();
};
const toggleLogout = () => {
  state.showLogoutPopup = !state.showLogoutPopup;
};
/* =================================================================== */
/* If no menu item is selected on load, redirect user to Dashboard     */
/* =================================================================== */
const redirectToDashboard = () => {
  if (route.name == ROUTES_WALLET.WALLETS.NAME) {
    router.push(offlineModeRoute.value);
  }
};
/* =================================================================== */
/* If sub-menu item is selected on load, expend the sub-menu slot      */
/* =================================================================== */
const expendSubMenu = (children: any) => {
  for (const c of children) {
    if (route.name == c.route.name) return true;
  }
};
</script>

<style lang="scss" scoped>
// Make selected top three button bold
.v-list-item--active .btn-title {
  font-weight: 500;
}

.new-dapp-label {
  border-radius: 2px;
  background: #ff445b;
  animation: pulse 3s infinite;
}
@-webkit-keyframes pulse {
  0% {
    -webkit-box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
  }
  70% {
    -webkit-box-shadow: 0 0 0 5px rgba(255, 255, 255, 0);
  }
  100% {
    -webkit-box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
}
@keyframes pulse {
  0% {
    -moz-box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
  }
  70% {
    -moz-box-shadow: 0 0 0 5px rgba(255, 255, 255, 0);
    box-shadow: 0 0 0 5px rgba(255, 255, 255, 0);
  }
  100% {
    -moz-box-shadow: 0 0 0 0 rgba(204, 169, 44, 0);
    box-shadow: 0 0 0 0 rgba(204, 169, 44, 0);
  }
}
</style>

<style lang="scss">
// =======================================================
// Scoped styles for .wallet-sidemenu
// =======================================================
.wallet-sidemenu {
  .v-system-bar .v-icon {
    font-size: 36px !important;
    color: white !important;
  }

  .v-list-item--dense .v-list-item__title {
    line-height: 20px !important;
  }
  .v-list-item,
  .v-input--switch {
    opacity: 0.7 !important;

    &:hover {
      opacity: 1 !important;
    }
  }

  a.v-item--active,
  .v-input--is-label-active {
    opacity: 1 !important;
    filter: grayscale(0);
  }

  .v-list-item--active.v-list-item:not(.v-list-group__header).remove-select-state {
    background-color: transparent !important;

    &:hover {
      background-color: rgba(255, 255, 255, 0.2) !important;
    }
  }

  .v-list-item--link {
    border-top: none;
  }
  .v-list-item--active {
    .v-list-item__content {
      .v-list-item__title {
        font-weight: 500 !important;
      }
    }
  }
  .v-list-group__header__append-icon {
    .v-icon {
      color: var(--v-white-base) !important;
    }
  }
  .v-divider {
    border-color: rgba(255, 255, 255, 0.22) !important;
  }
  .v-list-item--link:hover {
    background-color: rgba(255, 255, 255, 0.2) !important;
  }
  .v-list-item:after {
    min-height: 40px !important;
  }
  .mew-body.font-weight-bold {
    font-weight: 400 !important;
  }
  .v-list-item--active.v-list-item:not(.v-list-group__header) {
    background-color: rgba(255, 255, 255, 0.1) !important;
  }
  .v-list-item--active::before {
    opacity: 0 !important;
  }
  .v-navigation-drawer__content {
    margin-right: 2px;
    &::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }
    &::-webkit-scrollbar-button {
      width: 0;
      height: 0;
    }
    &::-webkit-scrollbar-thumb {
      background: #7b91ac;
      border: 0 none #fff;
      border-radius: 50px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: #7b91ac;
    }
    &::-webkit-scrollbar-thumb:active {
      background: #4b4949;
    }
    &::-webkit-scrollbar-track {
      background: #e1dfdf;
      border: 0 none #fff;
      border-radius: 39px;
    }
    &::-webkit-scrollbar-track:hover {
      background: #ddd5d5;
    }
    &::-webkit-scrollbar-track:active {
      background: #dedede;
    }
    &::-webkit-scrollbar-corner {
      background: transparent;
    }
  }
  .matomo-tracking-switch {
    .v-label {
      color: var(--v-white-base);
    }
  }

  .opacity--30 {
    opacity: 30% !important;
  }
}
</style>
