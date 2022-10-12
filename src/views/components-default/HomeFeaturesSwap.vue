<template>
  <mew6-white-sheet
    class="mew-component--features-swap pa-6 pa-md-10"
    max-width="700px"
  >
    <div class="mew-heading-1 mb-3">{{ $t('home.features.swap.heading') }}</div>
    <div>
      {{ $t('home.features.swap.title') }}
    </div>
    <div class="mt-10">
      <v-row v-if="!loading && !error">
        <v-col
          v-for="(data, key) in swapData"
          :key="key"
          cols="12"
          md="6"
          style="padding: 4px !important"
        >
          <v-sheet
            v-if="data.rate"
            color="tableHeader"
            class="d-flex align-center justify-space-between border-radius--5px py-5 px-4 cursor cursor--pointer"
            @click="goToSwap(data)"
          >
            <div class="text-uppercase">
              1 {{ data.fromT.symbol }} / {{ data.rate }} {{ data.toT.symbol }}
            </div>
            <div class="d-flex align-center">
              <img
                width="22"
                :src="
                  require('@/assets/images/currencies/' +
                    data.fromT.symbol.toLowerCase() +
                    '.png')
                "
                alt="currency-icon"
              />
              <img
                width="18"
                class="mx-2"
                src="@/assets/images/icons/icon-swap-arrow-grey.png"
                alt="swap-icon"
              />
              <img
                width="22"
                :src="
                  require('@/assets/images/currencies/' +
                    data.toT.symbol.toLowerCase() +
                    '.png')
                "
                alt="eth-icon"
              />
            </div>
          </v-sheet>
        </v-col>
      </v-row>
      <mew-button
        title="Swap"
        btn-size="xlarge"
        class="mx-auto mt-12 d-block"
        @click.native="
          $router.push({ name: ROUTES_HOME.ACCESS_WALLET.NAME, params: {} })
        "
      />
    </div>
  </mew6-white-sheet>
</template>

<script lang="ts" setup>
import handlerSwap from '@/modules/swap/handlers/handlerSwap';
import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
//import { Toast, ERROR } from "@/modules/toast/handler/handlerToast";
import { ROUTES_HOME as Routes } from '@/core/configs/configRoutes';
import { isEmpty } from 'lodash';
import { onMounted, watch } from 'vue';
import Web3 from 'web3/types';

const STATIC_PAIRS = [
  {
    toT: {
      symbol: 'BTC',
      contract: '0xbtc'
    },
    fromT: {
      symbol: 'ETH',
      contract: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      decimals: 18
    },
    fromAmount: '100000000000000000'
  },
  {
    fromT: {
      symbol: 'ETH',
      contract: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      decimals: 18
    },
    toT: {
      symbol: 'USDT',
      contract: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      decimals: 6
    },
    fromAmount: '100000000000000000'
  },
  {
    fromT: {
      symbol: 'ETH',
      contract: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      decimals: 18
    },
    toT: {
      symbol: 'KNC',
      contract: '0xdd974d5c2e2928dea5f71b9825b8b646686bd200',
      toT: 18
    },
    fromAmount: '100000000000000000'
  },
  {
    fromT: {
      symbol: 'ETH',
      contract: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      decimals: 18
    },
    toT: {
      symbol: 'DAI',
      contract: '0x6b175474e89094c44da98b954eedeac495271d0f',
      decimals: 18
    },
    fromAmount: '100000000000000000'
  },
  {
    fromT: {
      symbol: 'ETH',
      contract: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      decimals: 18
    },
    toT: {
      symbol: 'LINK',
      contract: '0x514910771af9ca656af840dff83e8264ecf986ca',
      decimals: 18
    },
    fromAmount: '100000000000000000'
  },
  {
    fromT: {
      symbol: 'ETH',
      contract: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      decimals: 18
    },
    toT: {
      symbol: 'USDC',
      contract: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      decimals: 6
    },
    fromAmount: '100000000000000000'
  }
];
  let swapHandler:null|typeof handlerSwap = null
  let swapData:null|Array<any> = null
  let loading = true
  let error = false
  let ROUTES_HOME = Routes

  watch(web3,(val:Web3)=>{
    setSwapHandler(val);
  })
  onMounted(()=>{
    setSwapHandler(this.web3)
  })
  const setSwapHandler= (val:Web3)=>{
      swapHandler = new handlerSwap(val, network.type.name);
      fetchRates();
    }
  const fetchRates =()=> {
      try {
        swapData = null;
        loading = true;
        swapHandler.getQuotesForSet(STATIC_PAIRS).then((res:any) => {
          swapData = STATIC_PAIRS.map((itm, idx) => {
            itm['rate'] =
              res[idx].length === 0 || isEmpty(res[idx])
                ? false
                : formatFloatingPointValue(res[idx][0].amount).value;
            return itm;
          });
          loading = false;
        });
      } catch (e) {
        loading = false;
        error = true;
        //Toast(e.message, {}, ERROR);
      }
    }
  const goToSwap = (data:any) => {
      const obj = {
        fromToken: data.fromT.contract,
        toToken: data.toT.contract,
        amount: '1'
      };
      navigateToSwap(obj);
    }
  const navigateToSwap = (query: any)=> {
      const obj = { name: 'Swap', query:'' };
      if (query) {
        obj['query'] = query;
      }
      // if (this.$route.name === 'Swap') {
      //   // this will allow vue to update query param
      //   // within the swap page when user clicks on the pairs again
      //   this.$router.replace(obj);
      // } else {
      //   this.$router.push(obj);
      // }
    }
</script>

<style lang="scss" scoped></style>
