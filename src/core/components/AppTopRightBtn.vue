<template>
  <div class="mew6-component--top-right-btn cursor--pointer">
    {{ text }}
  </div>
</template>

<script setup lang="ts">
defineProps({
  text: { default: '', type: String }
});
</script>

<style lang="scss" scoped>
.mew6-component--top-right-btn {
  color: var(--v-greenPrimary-base);
  display: inline-block;
  position: absolute;
  top: -12px;
  right: 20px;
  &:hover {
    color: var(--v-greenPrimary-base);
  }
}
</style>
