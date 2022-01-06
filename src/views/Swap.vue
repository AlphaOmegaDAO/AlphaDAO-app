<template>
  <div class="d-flex align-items-center justify-content-center min-vh-100">
    <div class="dapp-center-modal">
      <div class="dapp-modal-wrapper">
        <div class="swap-input-column">
          <!-- <div class="balance-row"><p>Balance</p><p class="balance-data">{{ $store.state.settings.aOHMBalance }}</p><p>AlphaOHM</p> </div> -->
          <!-- <div class="balance-row"><p>Balance</p><p class="balance-data">{{$store.state.settings.aOHMBalance}}</p><p>AlphaOHM</p> </div> -->

          <!-- <div class="swap-input-row">
            <div class="swap-input-container">
              <input v-on:change='updateValuesOnInChange' placeholder="0.0" id="swap-input-id" class="swap-input" type="number">

              </div>

              <div class="cur-max-box">
                <img src="~/@/assets/alpha.svg" alt="">
                <div class="max-button" @click='maxSwap'>
                  100%
                </div>
                </div>
          </div> -->

          <!-- <div class="swap-arrow">
            <img src="~/@/assets/Arrow.svg" alt="" class="social-icon-small">
          </div> -->

          <!-- <div class="swap-ourput-row">
              <div class="swap-output-container">
              <input v-on:change='updateValuesOnOutChange' placeholder="0.0" id="swap-output-id" class="swap-output" type="number">
              </div>
              <div class="cur-max-box" style="margin-right:0.25rem;filter:invert(1);width:50px;transform:scale(0.8);">
                <img class="social-icon-small" src="~/@/assets/logo.svg" alt="">
                </div>
          </div> -->

          <div class="swap-price-data-column">
            <div class="swap-price-data-row">
              <p class="price-label">AlphaOHM To Reclaim</p>
              <p id="output-ohm-id" class="price-data">
                {{ trim($store.state.settings.aOHMAbleToClaim, 4) }} AlphaOHM
              </p>
            </div>
          </div>

          <div class="swap-button-container">
            <div @click="redeemAlphaOHM" class="swap-button">RECLAIM</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      form: {
        quantity: ''
      }
    };
  },

  computed: {
    ...mapState(['settings']),
    isValid() {
      return parseFloat(this.form.quantity);
    },

    maxStrike() {
      const exchangeRate = this.settings.exchangeRates[this.form.asset];
      return exchangeRate && exchangeRate.usd ? exchangeRate.usd : 1e9;
    }
  },

  methods: {
    ...mapActions(['migrateToOHM', 'getMaxSwap', 'reclaimAOHM']),

    handleSubmit() {
      this.migrateToOHM({
        value: this.form.quantity
      });
    },

    async migrate() {
      const ohmToMigrate = document.getElementById('swap-input-id').value;

      if (isNaN(ohmToMigrate)) {
        return;
      } else {
        await this.migrateToOHM(ohmToMigrate);
      }
    },

    async redeemAlphaOHM() {
      await this.reclaimAOHM();
    },

    async maxSwap() {
      await this.getMaxSwap();
      this.value = this.$store.state.settings.maxSwap;
      document.getElementById('swap-input-id').value = this.value;
      document.getElementById('swap-output-id').value = this.value;
      document.getElementById('output-ohm-id').innerHTML = this.value + ' OHM';
    },

    updateValuesOnInChange() {
      document.getElementById('swap-output-id').value = document.getElementById(
        'swap-input-id'
      ).value;
      document.getElementById('output-ohm-id').innerHTML =
        document.getElementById('swap-input-id').value + ' OHM';
    },

    updateValuesOnOutChange() {
      document.getElementById('swap-input-id').value = document.getElementById(
        'swap-output-id'
      ).value;
      document.getElementById('output-ohm-id').innerHTML =
        document.getElementById('swap-output-id').value + ' OHM';
    },

    trim(number, precision) {
      if (number == undefined) {
        number = 0;
      }
      const array = number.toString().split('.');
      array.push(array.pop().substring(0, precision));
      const trimmedNumber = array.join('.');
      return trimmedNumber;
    }
  }
};
</script>

<style scoped>
.hasEffect {
  cursor: pointer;
}
</style>
