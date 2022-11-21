<template>
  <mew-stepper :items="state.items" :on-step="state.step" class="mx-md-0">
    <!--
      =====================================================================================
        Step 1: Create Password
      =====================================================================================
      -->
    <template v-if="state.step === 1" #stepperContent1>
      <div class="subtitle-1 font-weight-bold grey--text">STEP 1.</div>
      <div class="headline font-weight-bold mb-5">Create password</div>
      <!--
          =====================================================================================
            Enter Password
          =====================================================================================
          -->
      <mew-input
        v-model="state.password"
        hint="Password must be 8 or more characters"
        label="Password"
        placeholder="Enter Password"
        :has-clear-btn="true"
        class="flex-grow-1 mb-2 CreateWalletKeystorePasswordInput"
        :rules="state.passwordRulles"
        type="password"
      />
      <!--
          =====================================================================================
            Confirm Password
          =====================================================================================
          -->
      <mew-input
        v-model="state.cofirmPassword"
        hint=""
        label="Confirm Password"
        placeholder="Confirm password"
        class="flex-grow-1 CreateWalletKeystoreConfirmPWInput"
        :rules="passwordConfirmRulles"
        type="password"
      />
      <!--
          =====================================================================================
            Creat Wallet Button
          =====================================================================================
          -->
      <div v-if="!state.isGeneratingKeystore" class="d-flex justify-center">
        <mew-button
          class="CreateWalletKeystoreSubmitButton"
          title="Create Wallet"
          btn-size="xlarge"
          :has-full-width="false"
          :disabled="!enableCreateButton"
          @click="createWallet"
        />
      </div>
      <!--
          =====================================================================================
            Loading State: isGeneratingKeystore = true
          =====================================================================================
          -->
      <v-row v-else justify="center" align="center">
        <v-progress-circular
          indeterminate
          color="greenPrimary"
        ></v-progress-circular>
        <p class="mb-0 mx-3">Sit tight while we are encrypting your wallet</p>
      </v-row>
      <!--
        =====================================================================================
          Warning Block
        =====================================================================================
        -->
      <mew-warning-sheet
        class="mt-4 mb-0"
        title="NOT RECOMMENDED"
        description="This information is sensitive, and these options should only be used in offline settings by experienced crypto users. You will need your keystore file + password to access your wallet. Please save them in a secure location. We CAN NOT retrieve or reset your keystore/password if you lose them."
      />
    </template>
    <!--
      =====================================================================================
        Step 2: Download Keystore
      =====================================================================================
      -->
    <template v-if="state.step === 2" #stepperContent2>
      <div class="subtitle-1 font-weight-bold grey--text step-two-header">
        STEP 2.
      </div>
      <div class="headline font-weight-bold">Download keystore file</div>
      <div class="mb-5">
        Important things to know before downloading your keystore file.
      </div>
      <v-row class="align-stretch">
        <v-col
          v-for="(d, key) in state.warningData"
          :key="key"
          cols="12"
          sm="4"
        >
          <div class="pa-6 border-container">
            <div class="d-flex justify-center py-3">
              <mew-icon :icon-name="d.icon" :img-height="70" />
            </div>
            <h5 class="font-weight-bold mt-1 mb-2">{{ d.title }}</h5>
            <div>{{ d.description }}</div>
          </div>
        </v-col>
      </v-row>
      <div class="d-flex flex-column flex-md-row justify-center mt-6">
        <mew-button
          title="Back"
          btn-style="outline"
          btn-size="xlarge"
          class="mx-md-1 my-1"
          @click="updateStep(1)"
        />
        <mew-button
          title="Acknowledge & Download"
          btn-size="xlarge"
          :has-full-width="false"
          class="mx-md-1 my-1 CreateWalletKeystoreAccept"
          @click="downloadWallet"
        />
      </div>
      <a
        ref="downloadLink"
        :href="state.walletFile"
        rel="noopener noreferrer"
        :download="state.name"
        class="link"
      />
      <mew-warning-sheet
        class="mt-4 mb-0"
        title="NOT RECOMMENDED"
        description="This information is sensitive, and these options should only be used in offline settings by experienced crypto users. You will need your keystore file + password to access your wallet. Please save them in a secure location. We CAN NOT retrieve or reset your keystore/password if you lose them."
      />
    </template>
    <!--
      =====================================================================================
        Step 3: Done
      =====================================================================================
      -->
    <template v-if="state.step === 3" #stepperContent3>
      <div class="d-flex align-center">
        <div>
          <div class="subtitle-1 font-weight-bold grey--text step-three-header">
            STEP 3.
          </div>
          <div class="headline font-weight-bold mb-3">You are done!</div>
          <p class="mb-6">
            You are now ready to take advantage of all that Ethereum has to
            offer! Access with keystore file should only be used in an offline
            setting.
          </p>
          <img
            class="done-image d-block d-sm-none mx-auto mt-12 mb-12"
            src="@/assets/images/icons/icon-keystore-mew.png"
          />

          <div class="d-flex justify-center flex-column">
            <mew-button
              title="Access Wallet"
              btn-size="xlarge"
              :has-full-width="false"
              class="mb-3 CreateWalletKeystoreAccess"
              @click="goToAccess"
            />
            <mew-button
              title="Create Another Wallet"
              :has-full-width="false"
              btn-style="transparent"
              @click="restart"
            />
          </div>
        </div>
        <img
          class="d-none d-sm-block ml-8 icon-keystore"
          src="@/assets/images/icons/icon-keystore-mew.png"
        />
      </div>
    </template>
  </mew-stepper>
</template>

<script setup lang="ts">
import { isEmpty } from 'lodash';

import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import { ROUTES_HOME } from '@/core/configs/configRoutes';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import { computed, reactive, ref } from 'vue';
import { GeneratedKeyStore } from '../handlers/handlerCreateWallet';
import { useAnalytics } from '@/core/Common/handlerAnalytics';
import { useRouter } from 'vue-router';
import MewButton from '@/tempComponents/MewButton.vue';

const props = defineProps({
  handlerCreateWallet: {
    type: Object,
    default: () => {
      return {};
    }
  }
});

const router = useRouter();
const downloadLink = ref();

const state = reactive({
  step: 1,
  warningData: [
    {
      icon: 'paperPlane',
      title: "Don't lose it",
      description: 'Be careful, it can not be recovered if you lose it.'
    },
    {
      icon: 'thief',
      title: "Don't share it",
      description:
        'Your funds will be stolen if you use this file on a malicious phishing site.'
    },
    {
      icon: 'copy',
      title: 'Make a backup',
      description:
        'Secure it like the millions of dollars it may one day be worth.'
    }
  ],
  items: [
    {
      step: 1,
      name: 'STEP 1. Create password'
    },
    {
      step: 2,
      name: 'STEP 2. Download keystore file'
    },
    {
      step: 3,
      name: 'STEP 3. Well done'
    }
  ],
  password: '',
  cofirmPassword: '',
  passwordRulles: [
    (value: string) => !isEmpty(value) || 'Required',
    (value: string) =>
      value?.length >= 8 || 'Password is less than 8 characters'
  ],

  walletFile: '',
  name: '',
  isGeneratingKeystore: false
});

const enableCreateButton = computed(() => {
  return (
    !isEmpty(state.password) &&
    state.cofirmPassword === state.password &&
    state.password.length >= 8
  );
});
const passwordConfirmRulles = computed(() => {
  return [
    (value: string) => !!value || 'Required',
    (value: string) => value === state.password || 'Passwords do not match'
  ];
});

const createWallet = () => {
  state.isGeneratingKeystore = true;
  props.handlerCreateWallet
    .generateKeystore(state.password)
    .then((res: GeneratedKeyStore) => {
      state.name = res.name;
      state.walletFile = res.blobUrl;
      updateStep(2);
      state.isGeneratingKeystore = false;
    })
    .catch((e: unknown) => {
      Toast(e, {}, ERROR);
    });
};

const { trackCreateWallet } = useAnalytics();
const downloadWallet = () => {
  downloadLink.value.click();
  trackCreateWallet(WALLET_TYPES.KEYSTORE);
  updateStep(3);
};
const goToAccess = () => {
  router.push({ name: ROUTES_HOME.ACCESS_WALLET.NAME });
};
/**
 * Update step
 */
const updateStep = (step: number) => {
  state.step = step ? step : 1;
};
const restart = () => {
  state.step = 1;
  state.password = '';
  state.cofirmPassword = '';
};
</script>

<style lang="scss" scoped>
.link {
  opacity: 0;
  position: absolute;
  top: 100000px;
  z-index: -1;
}
.mew-component--keystore .mew-stepper.v-stepper {
  background: transparent !important;
}
.border-container {
  border: 1px solid RGB(var(--v-theme-greenPrimary));
  border-radius: 7px;
  box-shadow: 0 8px 15px RGB(var(--v-theme-greyLight));
  height: 100%;
}
.done-image {
  max-width: 170px;
}
.icon-keystore {
  max-width: 250px;
}
</style>
