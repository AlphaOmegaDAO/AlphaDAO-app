<template>
  <div class="d-flex align-items-center justify-content-center min-vh-100">
    <div class="dapp-center-modal py-2 px-4 py-md-4 px-md-2">
      <div class="dapp-modal-wrapper d-flex align-items-center">
        <LoadingScreen v-if="!!$store.state.settings.userDataLoading" />
        <div class="swap-input-column" v-else>
          <div class="stake-toggle-row">
            <toggle-switch
              :options="myOptions"
              v-model="selectedMapOption"
              :value="selectedMapOption"
            />
          </div>

          <div class="input-group ohm-input-group mb-3 flex-nowrap d-flex">
            <input
              v-model="quantity"
              type="number"
              class="form-control"
              placeholder="Type an amount"
            />
            <button class="btn" type="button" @click="setMax">Max</button>
          </div>

          <div class="stake-price-data-column">
            <div class="stake-price-data-row">
              <p class="price-label">Balance</p>
              <p class="price-data">{{ trim($store.state.settings.ohmBalance, 4) }} OHM</p>
            </div>
            <div class="stake-price-data-row">
              <p class="price-label">Staked</p>
              <p class="price-data">{{ trim($store.state.settings.sohmBalance, 4) }} OHM</p>
            </div>

            <div class="stake-price-data-row">
              <p class="price-label">Time until rebase</p>
              <p class="price-data">
                {{ timeUntilRebase() }}
              </p>
            </div>

            <div class="stake-price-data-row">
              <p class="price-label">Upcoming rebase</p>
              <p class="price-data">{{ trim($store.state.settings.stakingRebase * 100, 4) }}%</p>
            </div>
            <div class="stake-price-data-row">
              <p class="price-label">ROI (5-day rate)</p>
              <p class="price-data">{{ trim($store.state.settings.fiveDayRate * 100, 4) }}%</p>
            </div>
            <div class="stake-price-data-row">
              <p class="price-label">Current APY</p>
              <p class="price-data">{{ trim($store.state.settings.stakingAPY * 100, 2) }}%</p>
            </div>
            <div class="stake-price-data-row">
              <p class="price-label">Current index</p>
              <p class="price-data">{{ trim($store.state.settings.currentIndex, 4) }} OHM</p>
            </div>
          </div>

          <div v-if="hasAllowance" class="d-flex align-self-center mb-2">
            <div class="stake-button" @click="executeStake">{{ selectedMapOption }}</div>
          </div>
          <div v-else class="d-flex align-self-center mb-2">
            <div class="stake-button" @click="seekApproval">Approve</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import mixin from '@/helpers/mixins';

export default {
  mixins: [mixin],
  data() {
    return {
      myOptions: {
        layout: {
          color: 'white',
          backgroundColor: '#282828',
          selectedColor: 'white',
          selectedBackgroundColor: 'green',
          borderColor: 'white',
          fontFamily: 'Arial',
          fontWeight: 'normal',
          lineHeight: '1',
          fontWeightSelected: 'bold',
          squareCorners: false,
          noBorder: false
        },
        size: {
          fontSize: 1,
          height: 2.5,
          padding: 0.3,
          width: 15,
          borderRadius: 5
        },
        items: {
          delay: 0.4,
          preSelected: 'unknown',
          disabled: false,
          labels: [
            { name: 'Stake', color: 'black', backgroundColor: 'white' },
            { name: 'Unstake', color: 'black', backgroundColor: 'white' }
          ]
        }
      },
      selectedMapOption: 'Stake',
      quantity: '',
      stakeToggle: true
    };
  },
  computed: {
    ...mapState(['settings']),
    hasAllowance() {
      if (this.selectedMapOption === 'Stake') {
        return parseInt(this.$store.state.settings.stakeAllowance) > 0;
      } else {
        return parseInt(this.$store.state.settings.unstakeAllowance) > 0;
      }
    }
  },

  methods: {
    ...mapActions([
      'SendDai',
      'getStakeApproval',
      'stakeOHM',
      'unstakeOHM',
      'getunStakeApproval',
      'getStakingAPY'
    ]),

    timeUntilRebase() {
      const currentBlock = this.$store.state.settings.currentBlock;
      const rebaseBlock = this.getRebaseBlock(currentBlock);
      const seconds = this.secondsUntilBlock(currentBlock, rebaseBlock);
      return this.prettifySeconds(seconds);
    },

    async executeStake() {
      switch (this.selectedMapOption) {
        case 'Stake':
          if (isNaN(this.quantity) || this.quantity === 0 || this.quantity === '') {
            alert('Please enter a value!');
            return;
          } else {
            await this.stakeOHM(this.quantity.toString());
          }

          break;
        case 'Unstake':
          if (isNaN(this.quantity) || this.quantity === 0 || this.quantity === '') {
            alert('Please enter a value!');
            return;
          } else {
            await this.unstakeOHM(this.quantity.toString());
          }
      }
    },

    setMax() {
      let suppliedQuantity;
      if (this.selectedMapOption === 'Stake') {
        suppliedQuantity = this.$store.state.settings.ohmBalance;
      } else {
        suppliedQuantity = this.$store.state.settings.sohmBalance;
      }

      this.quantity = suppliedQuantity;
    },

    async seekApproval() {
      switch (this.selectedMapOption) {
        case 'Stake':
          if (isNaN(this.quantity)) {
            return;
          } else {
            await this.getStakeApproval(this.quantity.toString());
          }
          break;
        case 'Unstake':
          if (isNaN(this.quantity)) {
            return;
          } else {
            await this.getunStakeApproval(this.quantity.toString());
          }
      }
    }
  }
};
</script>
<style scoped>
.hasEffect {
  cursor: pointer;
}
</style>
