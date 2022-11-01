<template>
  <div class="mew-component--convert-units">
    <the-layout-header
      title="Convert Units"
      subtitle-line-one="Our helpful conversion tool and ether unit reference allow you to calculate the total cost of your transactions."
    />
    <v-container class="my-15">
      <v-row class="conver-units mx-auto mb-15" style="max-width: 1000px">
        <v-col cols="12" md="5">
          <mew-select
            :has-filter="false"
            :items="items"
            :value="state.selectedLeft"
            class="mb-2"
            normal-dropdown
            @input="updateCurrencyLeft"
          />
          <mew-input
            :value="state.valueLeft"
            type="number"
            label="Amount"
            @input="updateAmountLeft"
          />
        </v-col>
        <v-col cols="12" md="2" class="d-flex align-center justify-center">
          <v-icon
            :style="
              $vuetify.display.smAndDown ? 'transform: rotate(90deg)' : ''
            "
            large
            >mdi-swap-horizontal</v-icon
          >
        </v-col>
        <v-col cols="12" md="5">
          <mew-select
            :has-filter="false"
            :items="items"
            :value="state.selectedRight"
            class="mb-2"
            normal-dropdown
            @input="updateCurrencyRight"
          />
          <mew-input
            :value="state.valueRight"
            type="number"
            label="Amount"
            @input="updateAmountRight"
          />
        </v-col>
      </v-row>

      <div class="mew-heading-1">
        {{ $t('convertUnits.title-refference') }}
      </div>

      <div class="unit-table">
        <table>
          <thead>
            <tr class="font-weight-medium">
              <td>Unit</td>
              <td>Wei</td>
              <td>Ether</td>
              <td>Alternate name</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="eu in etherUnitRef" :key="eu.name">
              <td>{{ eu.name }}</td>
              <td>
                <div class="d-flex align-center">
                  <div v-show="$vuetify.display.mdAndUp" class="mr-1">
                    {{ eu.unit1 }} =
                  </div>
                  <div class="unit-short">
                    {{ eu.unit2 }}
                    <span> {{ eu.unit2e }}</span>
                  </div>
                </div>
              </td>
              <td>
                <div class="d-flex align-center">
                  <div v-show="$vuetify.display.lgAndUp" class="mr-1">
                    {{ eu.etherUnit1 }} =
                  </div>
                  <div class="unit-short">
                    {{ eu.etherUnit2 }}
                    <span> {{ eu.etherUnit2e }}</span>
                  </div>
                </div>
              </td>
              <td>{{ eu.desc }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </v-container>

    <!-- <app-get-started /> -->
  </div>
</template>

<script setup lang="ts">
import { BigNumber } from 'bignumber.js';
import { unitMap, Unit } from 'web3-utils';
import TheLayoutHeader from '../TheLayoutHeader.vue';
//import AppGetStarted from '@/core/components/AppGetStarted.vue';
import { reactive, watch } from 'vue';
import { useWalletStore } from '@/stores/wallet';

interface UnitType {
  name: string;
  value: Unit;
}
interface State {
  selectedLeft: UnitType;
  selectedRight: UnitType;
  valueLeft: string;
  valueRight: string;
}
const state: State = reactive({
  selectedLeft: {
    name: 'Wei',
    value: 'wei'
  },
  selectedRight: {
    name: 'Ether',
    value: 'ether'
  },
  valueLeft: '1000000000000000000',
  valueRight: '1'
});

const items = [
  {
    name: 'Wei',
    value: 'wei'
  },
  {
    name: 'Kwei',
    value: 'kwei'
  },
  {
    name: 'Mwei',
    value: 'mwei'
  },
  {
    name: 'Gwei',
    value: 'gwei'
  },
  {
    name: 'Szabo',
    value: 'szabo'
  },
  {
    name: 'Finney',
    value: 'finney'
  },
  {
    name: 'Ether',
    value: 'ether'
  },
  {
    name: 'Kether',
    value: 'kether'
  },
  {
    name: 'Mether',
    value: 'mether'
  },
  {
    name: 'Gether',
    value: 'gether'
  },
  {
    name: 'Tether',
    value: 'tether'
  }
];
const etherUnitRef = [
  {
    name: 'Wei',
    unit1: '1',
    unit2: '1',
    unit2e: '',
    etherUnit1: '0.000,000,000,000,000,001',
    etherUnit2: '10',
    etherUnit2e: '-18',
    desc: ''
  },
  {
    name: 'Kwei',
    unit1: '1,000',
    unit2: '10',
    unit2e: '3',
    etherUnit1: '0.000,000,000,000,001',
    etherUnit2: '10',
    etherUnit2e: '-15',
    desc: 'ada, femtoether'
  },
  {
    name: 'Mwei',
    unit1: '1,000,000',
    unit2: '10',
    unit2e: '6',
    etherUnit1: '0.000,000,000,001',
    etherUnit2: '10',
    etherUnit2e: '-12',
    desc: 'babbage, picoether'
  },
  {
    name: 'Gwei',
    unit1: '1,000,000,000',
    unit2: '10',
    unit2e: '9',
    etherUnit1: '0.000,000,001',
    etherUnit2: '10',
    etherUnit2e: '-9',
    desc: 'shannon, nanoether, nano'
  },
  {
    name: 'Szabo',
    unit1: '1,000,000,000,000',
    unit2: '10',
    unit2e: '12',
    etherUnit1: '0.000,001',
    etherUnit2: '10',
    etherUnit2e: '-6',
    desc: 'microether, micro'
  },
  {
    name: 'Finney',
    unit1: '1,000,000,000,000,000',
    unit2: '10',
    unit2e: '15',
    etherUnit1: '0.001',
    etherUnit2: '10',
    etherUnit2e: '-3',
    desc: 'milliether, milli'
  },
  {
    name: 'Ether',
    unit1: '1,000,000,000,000,000,000',
    unit2: '10',
    unit2e: '18',
    etherUnit1: '1',
    etherUnit2: '1',
    etherUnit2e: '',
    desc: ''
  },
  {
    name: 'Kether',
    unit1: '1,000,000,000,000,000,000,000',
    unit2: '10',
    unit2e: '21',
    etherUnit1: '1,000',
    etherUnit2: '10',
    etherUnit2e: '3',
    desc: 'grand, einstein'
  },
  {
    name: 'Mether',
    unit1: '1,000,000,000,000,000,000,000,000',
    unit2: '10',
    unit2e: '24',
    etherUnit1: '1,000,000',
    etherUnit2: '10',
    etherUnit2e: '6',
    desc: ''
  },
  {
    name: 'Gether',
    unit1: '1,000,000,000,000,000,000,000,000,000',
    unit2: '10',
    unit2e: '27',
    etherUnit1: '1,000,000,000',
    etherUnit2: '10',
    etherUnit2e: '9',
    desc: ''
  },
  {
    name: 'Tether',
    unit1: '1,000,000,000,000,000,000,000,000,000,000',
    unit2: '10',
    unit2e: '30',
    etherUnit1: '1,000,000,000,000',
    etherUnit2: '10',
    etherUnit2e: '12',
    desc: ''
  }
];
const { web3 } = useWalletStore();
watch(
  () => state.valueLeft,
  newVal => {
    state.valueRight = convertFromTo(
      newVal,
      state.selectedLeft,
      state.selectedRight
    );
  }
);
watch(
  () => state.valueLeft,
  newVal => {
    state.valueLeft = convertFromTo(
      newVal,
      state.selectedRight,
      state.selectedLeft
    );
  }
);
watch(
  () => state.selectedLeft,
  newVal => {
    state.valueRight = convertFromTo(
      state.valueLeft,
      newVal,
      state.selectedRight
    );
  }
);
watch(
  () => state.selectedRight,
  newVal => {
    state.valueLeft = convertFromTo(
      state.valueRight,
      newVal,
      state.selectedLeft
    );
  }
);
const getValueOfUnit = (unit: UnitType) => {
  const unitValue = unitMap()[unit.value];
  return new BigNumber(unitValue, 10);
};
const convertFromTo = (amt: number | string, from: UnitType, to: UnitType) => {
  return new BigNumber(String(amt))
    .times(getValueOfUnit(from))
    .div(getValueOfUnit(to))
    .toString(10);
};
const updateCurrencyLeft = (e: UnitType) => {
  state.selectedLeft = e;
};
const updateCurrencyRight = (e: UnitType) => {
  state.selectedRight = e;
};
const updateAmountLeft = (e: string) => {
  state.valueLeft = e;
};
const updateAmountRight = (e: string) => {
  state.valueRight = e;
};
</script>

<style lang="scss" scoped>
.unit-table {
  margin-top: 20px;
  table {
    width: 100%;
    border-collapse: collapse;
    thead {
      tr {
        border-top: 1px solid var(--v-textDark-base);
        border-bottom: 1px solid var(--v-textDark-base);
      }
    }
    tbody {
      tr:nth-child(even) {
        background-color: var(--v-greyLight-base);
      }
    }
    tr {
      td {
        padding: 12px 10px;
        position: relative;
      }
    }
  }
}

.unit-short {
  position: relative;
  span {
    position: absolute;
    top: 3px;
    left: 17px;
    font-size: 9px;
    margin-top: -10px;
  }
}
</style>

<style lang="scss">
.mew-component--convert-units {
  .v-text-field__details {
    display: none;
  }
}
</style>
