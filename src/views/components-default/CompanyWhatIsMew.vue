<template>
  <div>
    <v-container>
      <v-row align="center">
        <v-col cols="5">
          <app-block-title no-page-title :data="state.titleData" class="pr-8" />
        </v-col>
        <v-col cols="7">
          <v-img :src="SpaceMan" max-width="100%" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import AppBlockTitle from '@/core/components/AppBlockTitle.vue';
import SpaceMan from '@/assets/images/backgrounds/bg-spaceman.jpg';
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n({ useScope: 'global' });
const state = reactive({
  titleData: {
    textProps: '',
    topTitle: '',
    title: t('aboutUs.what-is-mew.title'),
    description: t('aboutUs.what-is-mew.description'),
    centered: false
  }
});
</script>
