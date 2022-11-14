<template>
  <div>
    <div @click="copyToClipboard">
      <slot />
    </div>
    <mew-toast
      ref="toast"
      :duration="2000"
      toast-type="success"
      :text="successToast"
    />
  </div>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core';
import { ref } from 'vue';
const toast: null | any = ref(null);
const props = defineProps({
  copyValue: {
    type: String,
    default: ''
  },
  successToast: {
    type: String,
    default: 'Copied!'
  }
});
const { copy } = useClipboard();
const copyToClipboard = () => {
  copy(props.copyValue);
  const el: any = document.activeElement;
  el.blur();
  toast.value?.showToast();
};
</script>
