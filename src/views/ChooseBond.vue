<template>
  <div class="d-flex align-items-center justify-content-center min-vh-100">
    <div class="dapp-center-modal ohm-card">
      <div class="d-flex flex-column">
        <div class="py-4 px-4 py-md-4 px-md-4">
          <h2 class="text-center mb-4">How do you want to bond?</h2>
          <p>
            Bonds give you the opportunity to buy OHM from the protocol at a discount. All bonds
            have a 5-day vesting term. Current market price of OHM is
            {{ trim($store.state.settings.marketPrice, 2) }} DAI. If you stake instead, your ROI will be
            {{ trim($store.state.settings.fiveDayRate * 100, 2) }}%.
          </p>
        </div>

        <ul class="list-group ohm-list-group">
          <li class="list-group-item d-flex align-items-center px-4">
            <div class="ohm-pairs d-flex mr-4 justify-content-center" style="width:64px;">
              <div class="ohm-pair" style="z-index: 2;">
                <img
                  src="https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/0x383518188C0C6d7730D91b2c03a03C837814a899/logo.png"
                />
              </div>

              <div class="ohm-pair" style="z-index: 1;">
                <img
                  src="https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png"
                />
              </div>
            </div>

            <div class="text-light">
              <h3>
                OHM-DAI SLP
                <a
                  href="https://analytics.sushi.com/pairs/0x34d7d7aaf50ad4944b70b320acb24c95fa2def7c"
                  target="_blank"
                >
                  <i class="fas fa-external-link-alt fa-sm ml-1"></i>
                </a>
              </h3>
              <p class="fs-6 mb-0">
                Bond Price: {{ trim($store.state.settings.bondPrice, 2) }} DAI
              </p>
              <p class="fs-6">ROI: {{ trim($store.state.settings.bondDiscount * 100, 2) }}%</p>
            </div>

            <div class="col">
              <router-link :to="{ name: 'bond' }" class="ohm-button button float-right">
                View
              </router-link>
            </div>
          </li>

          <li class="list-group-item d-flex align-items-center px-4">
            <div class="ohm-pairs d-flex mr-4 justify-content-center" style="width:64px;">
              <div class="ohm-pair" style="z-index: 1;">
                <img
                  src="https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png"
                />
              </div>
            </div>

            <div class="text-light">
              <h3>
                DAI
              </h3>
              <p class="fs-6 mb-0">
                Bond Price: {{ trim($store.state.settings.daiBond.price, 2) }} DAI
              </p>
              <p class="fs-6">
                ROI: {{ trim($store.state.settings.daiBond.discount * 100, 2) }}%
              </p>
            </div>

            <div class="col">
              <router-link :to="{ name: 'bondai' }" class="ohm-button button float-right">
                View
              </router-link>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import mixin from '@/helpers/mixins';

export default {
  mixins: [mixin],

  async mounted() {
    await this.calcBondDetails('');
    await this.calcDaiBondDetails('');
  },

  computed: {
    ...mapState(['settings'])
  },
  methods: {
    ...mapActions(['calcBondDetails', 'calcDaiBondDetails'])
  }
};
</script>
<style scoped>
.hasEffect {
  cursor: pointer;
}
</style>
