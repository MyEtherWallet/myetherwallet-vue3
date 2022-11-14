<script setup lang="ts">
import HomeEnkrypt from '../components-default/HomeEnkrypt.vue';
import HomeLanding from '../components-default/HomeLanding.vue';
import HomeFeatures from '../components-default/HomeFeatures.vue';
import HomeEthBlocks from '../components-default/HomeEthBlocks.vue';
import HomeSocials from '../components-default/HomeSocials.vue';
import HomeWhyMew from '../components-default/HomeWhyMew.vue';
import AppMewtopiaBlock from '@/core/components/AppMewtopiaBlock.vue';
import AppGetStarted from '@/core/components/AppGetStarted.vue';
import AppPartnersBlock from '@/core/components/AppPartnersBlock.vue';
</script>

<template>
  <div>
    <HomeLanding />
    <HomeFeatures />
    <HomeEnkrypt />
    <HomeEthBlocks />
    <HomeSocials />
    <HomeWhyMew />
    <AppMewtopiaBlock />
    <AppPartnersBlock />
    <AppGetStarted />
  </div>
</template>
