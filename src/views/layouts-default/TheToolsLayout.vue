<template>
  <div
    class="mew-component--tools"
    :class="$vuetify.display.smAndDown ? 'mobile' : 'desktop'"
  >
    <the-layout-header title="Tools" />

    <v-container class="px-3 my-12">
      <mew-tabs
        :is-vertical="$vuetify.display.smAndDown ? false : true"
        :items="items"
        :active-tab="state.activeTab"
        show-arrows
        @onTab="tabChanged"
      >
        <template #tabItemContent1>
          <module-message-verify ref="verifyMessageModule" />
        </template>
        <template #tabItemContent2>
          <module-tools-convert />
        </template>
        <template #tabItemContent3>
          <module-tools-generate-keystore />
        </template>
        <template #tabItemContent4>
          <module-tools-offline-helper :isHomepage="true" />
        </template>
        <template #tabItemContent5>
          <module-tools-watch-only />
        </template>
      </mew-tabs>
    </v-container>
    <app-get-started />
  </div>
</template>

<script setup lang="ts">
import { ROUTES_HOME } from '@/core/configs/configRoutes';
import TheLayoutHeader from '../components-default/TheLayoutHeader.vue';
import AppGetStarted from '@/core/components/AppGetStarted.vue';
// import ModuleToolsWatchOnly from '@/modules/tools/ModuleToolsWatchOnly.vue';
// import ModuleToolsConvert from '@/modules/tools/ModuleToolsConvert.vue';
// import ModuleToolsGenerateKeystore from '@/modules/tools/ModuleToolsGenerateKeystore/ModuleToolsGenerateKeystore.vue';
// import ModuleToolsOfflineHelper from '@/modules/tools/ModuleToolsOfflineHelper.vue';
// import ModuleMessageVerify from '@/modules/message/ModuleMessageVerify.vue';
import { reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { tryOnMounted } from '@vueuse/shared';
const route = useRoute();
const router = useRouter();
const state = reactive({
  currentTool: '',
  activeTab: 0
});
const items = [
  {
    name: 'Verify Message',
    val: 'verify'
  },
  {
    name: 'Convert Units',
    val: 'convert'
  },
  {
    name: 'Generate Keystore file',
    val: 'keystore'
  },
  {
    name: 'Send Offline Helper',
    val: 'offline'
  }
  /*
      {
        name: 'Watch only address',
        val: 'watch'
      }
      */
];
watch(route, () => {
  setCurrentTool();
});
watch(
  () => state.currentTool,
  (val: string) => {
    //state.$refs.verifyMessageModule?.clearAll();
    router.push({ name: ROUTES_HOME.TOOLS.NAME, query: { tool: val } });
  }
);
tryOnMounted(() => {
  setCurrentTool();
});
const setCurrentTool = () => {
  const tools = ['watch', 'convert', 'offline', 'verify', 'keystore'];
  useRoute;
  // Check if tool value from URL is valid
  if (tools.includes(route.fullPath)) {
    //state.currentTool = route.query.tool;

    switch (state.currentTool) {
      case 'verify':
        state.activeTab = 0;
        state.currentTool = 'verify';
        break;

      case 'convert':
        state.activeTab = 1;
        state.currentTool = 'convert';
        break;
      case 'keystore':
        state.activeTab = 2;
        state.currentTool = 'keystore';
        break;
      case 'offline':
        state.activeTab = 3;
        state.currentTool = 'offline';
        break;
      default:
        state.activeTab = 0;
        state.currentTool = 'verify';
    }
  } else {
    state.activeTab = 0;
    state.currentTool = 'verify';
  }
};

const tabChanged = (tab: number) => {
  state.activeTab = tab;

  switch (tab) {
    case 0:
      state.currentTool = 'verify';
      break;
    case 1:
      state.currentTool = 'convert';
      break;
    case 2:
      state.currentTool = 'keystore';
      break;
    case 3:
      state.currentTool = 'offline';
      break;
    default:
      state.currentTool = 'verify';
  }
};
</script>

<style lang="scss">
.mew-component--tools.desktop .v-item-group.v-slide-group {
  padding-right: 40px;
  margin-right: 40px;
  border-right: 1px solid var(--v-greyLight-base) !important;
}
</style>
