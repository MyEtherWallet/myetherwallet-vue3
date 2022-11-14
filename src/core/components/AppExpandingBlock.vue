<template>
  <div
    class="mew-component--app-expending-block"
    :class="btnBottom ? 'd-flex flex-column-reverse' : ''"
  >
    <!-- ================================================================ -->
    <!-- (Slot) (Clickable) Header -->
    <!-- ================================================================ -->
    <div
      :class="[
        btnLeft ? 'd-flex justify-start' : '',
        btnRight ? 'd-flex justify-end' : ''
      ]"
    >
      <!-- ========================================= -->
      <!--  <template #header> -->
      <!-- ========================================= -->
      <div class="cursor--pointer user-select--none" @click="headerClicked">
        <slot name="header" />
      </div>

      <!-- ========================================= -->
      <!--  <template #headerShow> -->
      <!-- ========================================= -->
      <div
        v-show="!state.isExpended"
        class="cursor--pointer user-select--none"
        @click="headerClicked"
      >
        <slot name="headerShow" />
      </div>

      <!-- ========================================= -->
      <!--  <template #headerHide> -->
      <!-- ========================================= -->
      <div
        v-show="state.isExpended"
        class="cursor--pointer user-select--none"
        @click="headerClicked"
      >
        <slot name="headerHide" />
      </div>
    </div>

    <!-- ================================================================ -->
    <!-- (Slot) Main content -->
    <!-- ================================================================ -->
    <div
      ref="mainContent"
      class="main-content"
      :class="state.isExpended ? 'expending-block--active' : ''"
    >
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { tryOnMounted } from '@vueuse/shared';
import { reactive, ref, watch } from 'vue';

const mainContent: null | any = ref(null);
const emit = defineEmits(['input']);

const props = defineProps({
  value: {
    type: Boolean,
    default: false
  },
  expend: {
    type: Boolean,
    default: false
  },
  btnRight: {
    type: Boolean,
    default: false
  },
  btnLeft: {
    type: Boolean,
    default: false
  },
  btnBottom: {
    type: Boolean,
    default: false
  }
});
const state = reactive({
  isExpended: false
});
watch(
  () => props.value,
  newVal => {
    // Expend when block is already closed to prevent infinite Loop
    if (newVal === true && state.isExpended === false) {
      expendBlock();
    }
    // Collapse when block is already open to prevent infinite Loop
    if (newVal === false && state.isExpended === true) {
      collapseBlock();
    }
  }
);
watch(
  () => props.expend,
  newVal => {
    // Expend when block is already closed to prevent infinite Loop
    if (newVal === true && state.isExpended === false) {
      expendBlock();
    }
    // Collapse when block is already open to prevent infinite Loop
    if (newVal === false && state.isExpended === true) {
      collapseBlock();
    }
  }
);
tryOnMounted(() => {
  // Wait for contents in the [.main-content]
  // then apply initial v-model value or expend value
  function delay(time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
  }
  delay(100).then(() => {
    if (props.value || props.expend) expendBlock();
  });
});
const headerClicked = () => {
  if (state.isExpended) collapseBlock();
  else expendBlock();
};
// Open
const expendBlock = () => {
  mainContent.value.style.maxHeight = mainContent.value.scrollHeight + 'px';

  state.isExpended = true;

  // Emit v-model
  emit('input', true);
};
// Close
const collapseBlock = () => {
  mainContent.value.style.maxHeight = '0px';

  state.isExpended = false;

  // Emit v-model
  emit('input', false);
};
</script>

<style lang="scss" scoped>
.main-content {
  opacity: 0;
  max-height: 0;
  transition: max-height 0.25s ease, opacity 0.3s ease-in 0.14s;
  overflow: hidden;
  border: 0;
}

.expending-block--active {
  opacity: 1;
}
</style>
