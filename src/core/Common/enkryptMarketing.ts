import { computed, reactive } from 'vue';
/**
 * Enkrypt reused functions
 */

import { usePopupStore } from '@/stores/popups';
import platform from 'platform';
import { useDisplay } from 'vuetify';
export const withState = reactive({
  extensionLinks: {
    chrome: {
      link: 'https://chrome.google.com/webstore/detail/enkrypt/kkpllkodjeloidieedojogacfhpaihoh',
      img: require('@/assets/images/icons/icon-chrome.svg')
    },
    firefox: {
      link: 'https://chrome.google.com/webstore/detail/enkrypt/kkpllkodjeloidieedojogacfhpaihoh',
      img: require('@/assets/images/icons/icon-firefox.svg')
    },
    opera: {
      link: 'https://addons.opera.com/en/extensions/details/enkrypt/',
      img: require('@/assets/images/icons/icon-opera.svg')
    },
    default: {
      link: 'https://chrome.google.com/webstore/detail/enkrypt/kkpllkodjeloidieedojogacfhpaihoh',
      img: require('@/assets/images/icons/icon-chrome.svg')
    }
  }
});
export const useEnkryptMarketing = () => {
  const enkryptLandingPopup = usePopupStore().enkryptLandingPopup;
  const { mdAndDown } = useDisplay();
  const browser = computed(() => {
    const browser: string = platform.name.toLowerCase();
    if (browser !== 'chrome' && browser !== 'firefox' && browser !== 'opera') {
      return 'default';
    }
    return browser;
  });
  const text = computed(() => {
    return browser.value !== 'default'
      ? `Install for ${platform.name}`
      : 'Download Now';
  });
  const browserLogoComputed = () => {
    return withState.extensionLinks[browser.value].img;
  };
  const browserLink = computed(() => {
    return withState.extensionLinks[browser.value].link;
  });
  const isMobile = computed(() => {
    return mdAndDown;
  });

  const openEnkrypt = () => {
    // eslint-disable-next-line
    /*
       window.open(
         this.isMobile ? 'https://www.enkrypt.com' : this.browserLink,
         '_blank'
       );
       */
    window.open('https://www.enkrypt.com', '_blank');
  };
  const openMewWallet = () => {
    if (isMobile.value) {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isAndroid = /android/i.test(userAgent);
      const isApple = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;

      if (isAndroid) {
        window.location.href =
          'https://play.google.com/store/apps/details?id=com.myetherwallet.mewwallet';
      } else if (isApple) {
        window.location.href = 'https://itunes.apple.com/app/id1464614025';
      }
    } else {
      // eslint-disable-next-line
      window.open('https://www.mewwallet.com/', '_blank');
    }
  };
  const openHelpCenter = () => {
    // eslint-disable-next-line
    window.open('https://www.enkrypt.com', '_blank');
  };
  return {
    enkryptLandingPopup,
    browser,
    text,
    browserLink,
    browserLogoComputed,
    isMobile,
    openEnkrypt,
    openMewWallet,
    openHelpCenter
  };
};
