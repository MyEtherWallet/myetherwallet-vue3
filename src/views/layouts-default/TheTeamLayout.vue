<template>
  <div>
    <the-layout-header :title="$t('team.header')" />
    <div class="py-7" />
    <v-container>
      <v-sheet max-width="700px" class="mx-auto">
        <app-block-title no-page-title :data="titleData" />
      </v-sheet>
    </v-container>
    <div class="py-5" />
    <v-container class="px-0">
      <v-row class="mx-0">
        <v-col
          v-for="t in state.team"
          :key="t.key"
          cols="12"
          md="6"
          lg="4"
          class="px-0 text-center"
        >
          <v-img :src="t.img" style="background-color: #79e2e1" />
          <div class="mt-6 title">{{ t.name }}</div>
          <div class="grey--text text--lighten-1 mt-1">{{ t.title }}</div>
          <div class="py-6" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import TheLayoutHeader from '../components-default/TheLayoutHeader.vue';
import AppBlockTitle from '@/core/components/AppBlockTitle.vue';
import { reactive } from 'vue';
import { tryOnMounted } from '@vueuse/shared';
import { useI18n } from 'vue-i18n';
const { t } = useI18n({ useScope: 'global' });
const titleData = {
  textProps: '',
  toptitle: '',
  title: t('team.title'),
  description: t('team.description'),
  centered: true
};
interface State {
  team: any;
  loadingTeam: boolean;
}
const state: State = reactive({
  team: {},
  loadingTeam: true
});
tryOnMounted(() => {
  fetchTeam();
});
const fetchTeam = () => {
  axios
    .get(
      'https://raw.githubusercontent.com/MyEtherWallet/dynamic-data/main/team.json'
    )
    .then(res => {
      state.loadingTeam = false;
      state.team = res.data.Team;
    });
};
</script>
