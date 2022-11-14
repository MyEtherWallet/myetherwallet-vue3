<template>
  <div class="component-container">
    <div class="py-6 py-md-12" />

    <v-container>
      <v-sheet max-width="600px" class="mb-12">
        <app-block-title no-page-title :data="state.titleData" class="mb-8" />
      </v-sheet>
      <v-row>
        <v-col
          v-for="content in state.blockContent"
          :key="content.title"
          cols="12"
          sm="6"
          md="6"
          lg="4"
          class="pb-12"
        >
          <img :src="content.img" height="60" />
          <h5 class="font-weight-bold mt-3">
            {{ $t(content.title) }}
          </h5>
          <div class="mt-3 pr-md-12">
            {{ $t(content.description) }}
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import Contract from '@/assets/images/icons/icon-contract-mew.svg';
import Message from '@/assets/images/icons/icon-message-mew.svg';
import BuyEth from '@/assets/images/icons/icon-buy-eth-mew.svg';
import AppBlockTitle from '@/core/components/AppBlockTitle.vue';
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n({ useScope: 'global' });
const state = reactive({
  titleData: {
    textProps: '',
    toptitle: '',
    title: t('howItWorks.more.title'),
    description: '',
    centered: false
  },
  blockContent: [
    {
      img: Contract,
      title: t('howItWorks.more.smart-contracts.title'),
      description: t('howItWorks.more.smart-contracts.description')
    },
    {
      img: Message,
      title: t('howItWorks.more.messages.title'),
      description: t('howItWorks.more.messages.description')
    },
    {
      img: BuyEth,
      title: t('howItWorks.more.buy-eth.title'),
      description: t('howItWorks.more.buy-eth.description')
    }
  ]
});
</script>
