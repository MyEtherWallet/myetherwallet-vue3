<template>
  <div>
    <mew-toast
      v-for="toast in toastGenerator"
      :ref="getName(toast)"
      :key="getName(toast) + getRef(toast)"
      :persistent="false"
      :duration="state.duration"
      :toast-type="getRef(toast)"
      :text="state.text"
      :link-obj="state.linkObj"
      @closed="onClose"
    />
  </div>
</template>
<script setup lang="ts">
import ToastEvents from './handler/toastEvents';
import { EventBus } from '@/plugins/eventBus';
import { reactive, computed, watch, ref } from 'vue';
import { tryOnBeforeMount, tryOnBeforeUnmount } from '@vueuse/shared';
import { ToastLink } from './types';

const state = reactive({
  text: '',
  linkObj: {},
  duration: 6000
});
type ToastObject = {
  [key: string]: string;
};
const toastGenerator = computed(() => {
  const initialArray = Object.keys(ToastEvents);
  return initialArray.map(item => {
    return {
      [item]: ToastEvents[item],
      ref: ref(ToastEvents[item])
    };
  });
});

watch(
  () => state.linkObj,
  newVal => {
    state.linkObj = newVal;
  },
  { deep: true }
);

tryOnBeforeMount(() => {
  Object.keys(ToastEvents).forEach(item => {
    EventBus.$on(ToastEvents[item], (text, obj, duration) => {
      state.text = text as string;
      state.linkObj = obj as ToastLink;
      state.duration = duration ? (duration as number) : 6000;
      callToast(ToastEvents[item]);
    });
  });
});

tryOnBeforeUnmount(() => {
  Object.keys(ToastEvents).forEach(item => {
    EventBus.$off(ToastEvents[item], () => {
      state.text = '';
      state.linkObj = {};
      state.duration = 6000;
    });
  });
});

const onClose = () => {
  state.text = '';
  state.linkObj = {};
  state.duration = 6000;
};

const getRef = (obj: ToastObject) => {
  return Object.keys(obj)[0];
};

const getName = (obj: ToastObject) => {
  return Object.values(obj)[0];
};

const callToast = (ref: string) => {
  if (this.$refs[ref] && this.$refs[ref].length > 0)
    this.$refs[ref][0].showToast();
};
</script>
