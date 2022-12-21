<template>
  <div class="phrase-block border-radius--5px px-7 py-4">
    <slot />
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.phrase-block {
  border: 1px solid RGB(var(--v-theme-greenPrimary));
}
</style>
