<template>
  <div class="mew-overview pt-5">
    <div style="max-width: 650px; width: 100%" class="mx-auto">
      <!--
      =====================================================================================
        Keystore File Button
      =====================================================================================
      -->
      <div class="mb-5">
        <mew-button
          class="CreateWalletSoftwareOverviewKeystore"
          has-full-width
          color-theme="greyMedium"
          btn-style="outline"
          style="height: 160px"
          @click="selectWalletType(state.walletTypes.KEYSTORE)"
        >
          <div
            class="text-left d-flex align-center justify-space-between px-2"
            style="width: 100%"
          >
            <div>
              <div class="mew-heading-2 textDark--text mb-2">Keystore File</div>
              <div class="break-word textDark--text">
                Using a keystore file online makes your wallet more vulnerable
                to loss of funds. We don’t recommend this method of wallet
                creation.
              </div>
            </div>
            <img
              width="80"
              class="mx-4 d-none d-sm-block"
              src="@/assets/images/icons/icon-keystore-file.svg"
            />
          </div>
        </mew-button>
      </div>

      <!--
      =====================================================================================
        Mnemonic Phrase Button
      =====================================================================================
      -->
      <div class="CreateWalletSoftwareOverviewMnemonic mb-5">
        <mew-button
          has-full-width
          color-theme="greyMedium"
          btn-style="outline"
          style="height: 160px"
          @click="selectWalletType(state.walletTypes.MNEMONIC)"
        >
          <div
            class="text-left d-flex align-center justify-space-between px-2"
            style="width: 100%"
          >
            <div>
              <div class="mew-heading-2 textDark--text mb-2">
                Mnemonic Phrase
              </div>
              <div class="break-word textDark--text">
                Using a Mnemonic Phrase online makes your wallet more vulnerable
                to loss of funds. We don’t recommend this method of wallet
                creation.
              </div>
            </div>
            <img
              width="80"
              class="mx-4 d-none d-sm-block"
              src="@/assets/images/icons/icon-mnemonic.svg"
            />
          </div>
        </mew-button>
      </div>

      <!--
      =====================================================================================
        Warning Block
      =====================================================================================
      -->
      <mew-warning-sheet
        class="mt-3"
        title="NOT RECOMMENDED"
        :link-obj="state.linkToLearnMore"
        description="This information is sensitive, and these options should only be used in offline settings by experienced crypto users."
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import eventBus from '@/plugins/eventBus';

const state = reactive({
  walletTypes: WALLET_TYPES,
  linkToLearnMore: {
    url: '',
    title: 'Learn more'
  }
});

// TODO enable after getting values from pinia store
// computed: {
//   ...mapGetters('article', ['getArticle']),
//   ...mapState('wallet', ['isOfflineApp'])

// TODO enable after getting values from pinia store
// onMounted(() => {
//   if (isOfflineApp) state.linkToLearnMore = {};
//   else state.linkToLearnMore.url = getArticle('not-rec-when-access-wallet');
// });

/**
 * Emit wallet type creation.
 * @type - is part of WALLET_TYPES
 * function is void
 */
const selectWalletType = (type: string) => {
  eventBus.$emit('typeSelect', type);
};
</script>

<style lang="scss" scoped>
.mew-overview {
  max-width: 650px;
}
</style>
