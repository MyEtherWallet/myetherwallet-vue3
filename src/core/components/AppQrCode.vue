<template>
  <canvas ref="qrCodeCanvas"></canvas>
</template>

<script setup lang="ts">
import mewIcon from '@/assets/images/icons/icon-mew-logo.svg';
import { tryOnBeforeUnmount, tryOnMounted } from '@vueuse/shared';
import QrCodeWithLogo from 'qrcode-with-logos/types';
import { reactive, watch, ref } from 'vue';
const qrCodeCanvas = ref(new HTMLCanvasElement());
const props = defineProps({
  width: {
    type: Number,
    default: 150
  },
  data: {
    type: String,
    default: ''
  }
});
type State = {
  qrCode: null | QrCodeWithLogo;
};
const state: State = reactive({
  qrCode: null
});
watch(
  () => props.data,
  val => {
    if (val !== '') {
      generateQRCode();
    }
  }
);
const generateQRCode = () => {
  state.qrCode = new QrCodeWithLogo({
    canvas: qrCodeCanvas.value,
    content: props.data,
    width: props.width,
    logo: {
      borderRadius: 100,
      logoSize: 0.23,
      borderSize: 0,
      src: mewIcon
    }
  });
  state.qrCode.toCanvas();
};

tryOnMounted(generateQRCode);
tryOnBeforeUnmount(() => {
  state.qrCode = null;
});
</script>
