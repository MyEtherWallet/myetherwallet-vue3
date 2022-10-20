<template>
  <v-sheet
    class="mew-component--aave-amount-form pa-3 pa-md-5 text-center"
    rounded
    color="white"
    elevation="1"
    max-width="650"
  >
    <v-row justify="space-around" dense>
      <!-- <v-col cols="12" md="6">
        <mew-module
          color-type="overlayBg"
          :has-body-padding="true"
          :subtitle="leftSideValues.subTitle"
          :title="leftSideValues.title"
          :caption="leftSideValues.caption"
          class="text-left height--full"
          :style="
            $vuetify.display.smAndDown ? 'padding-top: 0 !important' : ''
          "
        />
      </v-col>
      <v-col cols="12" md="6">
        <mew-module
          color-type="overlayBg"
          :has-body-padding="true"
          :subtitle="rightSideValues.subTitle"
          :title="rightSideValues.title"
          :caption="rightSideValues.caption"
          class="text-left height--full"
          :style="
            $vuetify.display.smAndDown ? 'padding-top: 0 !important' : ''
          "
        />
      </v-col> -->
    </v-row>
    <div class="px-2 px-md-12 mt-5">
      <p class="mew-heading-3 text-left">{{ formText.title }}</p>
      <p class="mew-body pt-1 text-left">
        {{ formText.caption }}
      </p>
    </div>
    <!-- <div class="px-0 px-md-12 mt-5">
      <v-sheet max-width="300px" class="mx-auto">
        <mew-input
          :value="amount"
          label="Amount"
          :right-label="selectedToken.token"
          :hide-clear-btn="true"
          :rules="[checkIfNumerical]"
          @input="setAmount"
        />
      </v-sheet>
      <mew-toggle
        v-if="showToggle"
        :button-group="group"
        button-type="percentage"
        :on-toggle-btn-idx="startingIdx"
        @onBtnClick="onToggle"
      />
    </div> -->

    <!-- <div class="mt-12 mb-2">
      <mew-button
        :title="buttonTitle.action"
        color-theme="primary"
        btn-style="background"
        btn-size="xlarge"
        :disabled="!hasAmount"
        @click.native="emitValues"
      />
    </div>
    <div>
      <mew-button
        :title="buttonTitle.cancel"
        color-theme="error"
        btn-style="transparent"
        btn-size="xlarge"
        @click.native="cancel"
      />
    </div> -->
  </v-sheet>
</template>

<script setup lang="ts">
import BigNumber from 'bignumber.js/bignumber';
import { computed, onMounted, reactive } from 'vue';
const props = defineProps({
  selectedToken: {
    type: Object,
    default: () => {}
  },
  showToggle: {
    type: Boolean,
    default: false
  },
  leftSideValues: {
    type: Object,
    default: () => {
      return { title: '', caption: '', subTitle: '' };
    }
  },
  rightSideValues: {
    type: Object,
    default: () => {
      return { title: '', caption: '', subTitle: '' };
    }
  },
  formText: {
    type: Object,
    default: () => {
      return { title: '', caption: '' };
    }
  },
  buttonTitle: {
    type: Object,
    default: () => {
      return { action: '', cancel: '' };
    }
  },
  tokenBalance: {
    type: String,
    default: '0'
  }
});
const group = ['25%', '50%', '75%', 'MAX'];
interface State {
  amount: string | number;
  startingIdx: number;
}
const state: State = reactive({ amount: 0, startingIdx: 0 });
const hasAmount = computed(() => BigNumber(state.amount).gt(0));

onMounted(() => {
  if (props.showToggle) {
    onToggle('50%');
  }
});
const setAmount = (e: number) => {
  state.amount = e;
};
const onToggle = (e: string) => {
  switch (e) {
    case group[0]:
      state.startingIdx = 0;
      state.amount = calculatedAmt(0.25);
      break;
    case group[1]:
      state.startingIdx = 1;
      state.amount = calculatedAmt(0.5);
      break;
    case group[2]:
      state.startingIdx = 2;
      state.amount = calculatedAmt(0.75);
      break;
    default:
      state.startingIdx = 3;
      state.amount = calculatedAmt(1);
  }
};
const checkIfNumerical = (value: any) => {
  const regex = new RegExp('^-?[0-9]+.?[0-9]*$');
  const test = regex.test(value);
  if (value !== '' && !test) return 'Please enter a valid value!';
  return test;
};
// cancel() {
//   this.$emit('cancel');
// }
// const emitValues = ()=>{
//   this.$emit('emitValues', this.amount);
// }
const calculatedAmt = (per: number) => {
  const amt = BigNumber(props.tokenBalance).times(per);
  return amt.toFixed();
};
</script>
