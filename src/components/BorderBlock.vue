<template>
  <div class="border-block border-radius--5px">
    <slot />
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.border-block {
  border: 1px solid RGB(var(--v-theme-greyMedium));
}
</style>
