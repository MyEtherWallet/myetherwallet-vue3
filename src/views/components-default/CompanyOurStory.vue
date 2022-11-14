<template>
  <div class="component-container">
    <div class="py-10" />
    <v-container class="pb-0">
      <v-sheet max-width="600px" color="transparent" class="mx-auto">
        <app-block-title no-page-title :data="state.titleData" />
      </v-sheet>
      <div class="my-11" />
      <div class="line-height--0">
        <v-img
          src="@/assets/images/backgrounds/bg-mountains.png"
          max-width="100%"
        />
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import AppBlockTitle from '@/core/components/AppBlockTitle.vue';
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n({ useScope: 'global' });
const state = reactive({
  titleData: {
    textProps: '',
    topTitle: '',
    title: t('aboutUs.about-us.title'),
    description: t('aboutUs.about-us.description'),
    centered: true
  }
});
</script>

<style lang="scss" scoped>
.component-container {
  background-color: #f2fafa;
}
.line-height--0 {
  line-height: 0 !important;
}
</style>
