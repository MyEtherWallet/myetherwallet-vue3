<template>
  <div class="mew-component--banner-ads cursor--pointer">
    <mew6-white-sheet class="overflow--hidden">
      <v-carousel
        v-model="state.currentSlide"
        height="100%"
        hide-delimiters
        show-arrows-on-hover
        cycle
      >
        <v-carousel-item :ripple="false">
          <a @click="openEnkrypt">
            <img
              class="slide-img"
              src="@/assets/images/slides/slide1.jpg"
              alt="Enkrypt"
            />
          </a>
        </v-carousel-item>
        <v-carousel-item :ripple="false">
          <a @click="openMewWallet">
            <img
              class="slide-img"
              src="@/assets/images/slides/slide2.jpg"
              alt="Enkrypt"
            />
          </a>
        </v-carousel-item>
        <v-carousel-item
          :ripple="false"
          :to="{ name: ROUTES_HOME.BUY_HARDWARE_WALLET.NAME }"
        >
          <img
            class="slide-img"
            src="@/assets/images/slides/slide3.jpg"
            alt="Enkrypt"
          />
        </v-carousel-item>
      </v-carousel>
    </mew6-white-sheet>
  </div>
</template>

<script setup lang="ts">
import platform from 'platform';

import { ROUTES_HOME } from '@/core/configs/configRoutes';
import { useEnkryptMarketing } from '../Common/enkryptMarketing';
import { useAnalytics } from '../Common/handlerAnalytics';
import { computed, reactive } from 'vue';
const { browserLink } = useEnkryptMarketing();
const { trackEnkryptInstall, trackMewWalletInstall } = useAnalytics();
const state = reactive({
  currentSlide: 0,
  ROUTES_HOME: ROUTES_HOME
});
const mobileOrWebLink = computed(() => {
  if (platform.os.family.includes('iOS')) {
    return 'https://apps.apple.com/app/id1464614025';
  } else if (platform.os.family.includes('Android')) {
    return 'https://play.google.com/store/apps/details?id=com.myetherwallet.mewwallet';
  }
  return 'https://www.mewwallet.com/';
});
const openMewWallet = () => {
  trackMewWalletInstall();
  // eslint-disable-next-line
  window.open(mobileOrWebLink.value, '_blank');
};
const openEnkrypt = () => {
  trackEnkryptInstall();
  // eslint-disable-next-line
  window.open(browserLink.value, '_blank');
};
</script>

<style lang="scss" scoped>
.slide-img {
  width: 100%;
  height: 100%;
}
</style>
