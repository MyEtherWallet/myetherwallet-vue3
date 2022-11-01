<script setup lang="ts">
import TheDefaultHeader from './TheDefaultHeader.vue';
import TheDefaultFooter from './TheDefaultFooter.vue';
</script>

<template>
  <v-app>
    <div>
      <TheDefaultHeader />
      <v-main>
        <router-view />
      </v-main>
      <TheDefaultFooter />
    </div>
  </v-app>
</template>
