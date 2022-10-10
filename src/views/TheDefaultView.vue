<script setup lang="ts">
import TheDefaultHeader from "./TheDefaultHeader.vue";
import TheDefaultFooter from "./TheDefaultFooter.vue";
</script>

<template>
  <div>
    <TheDefaultHeader />
    <v-main>
      <router-view />
    </v-main>
    <TheDefaultFooter />
  </div>
</template>
