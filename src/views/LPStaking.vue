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

          <div
            v-if="isUnstake == false"
            class="input-group ohm-input-group mb-3 flex-nowrap d-flex"
          >
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
              <p class="price-data">{{ trim($store.state.settings.lpBalance, 4) }} OHM / DAI SLP</p>
            </div>
            <div class="stake-price-data-row">
              <p class="price-label">Staked</p>
              <p class="price-data">{{ trim($store.state.settings.lpStaked, 4) }} OHM / DAI SLP</p>
            </div>
            <div class="stake-price-data-row">
              <p class="price-label">Pending Rewards</p>
              <p class="price-data">{{ trim($store.state.settings.pendingRewards, 4) }} OHM</p>
            </div>
            <div class="stake-price-data-row">
              <p class="price-label">APR</p>
              <p class="price-data">{{ trim($store.state.settings.lpStakingAPY, 4) }}%</p>
              <!-- 1+rebase^1095-1 -->
            </div>
            <div class="stake-price-data-row">
              <p class="price-label">Total Staked</p>
              <p class="price-data">
                {{ trim($store.state.settings.totalLPStaked, 4) }} OHM / DAI SLP
              </p>
            </div>
          </div>

          <div v-if="hasAllowance" class="d-flex align-self-center mb-4">
            <div class="stake-button" @click="executeStake">{{ selectedMapOption }}</div>

            <div v-if="isUnstake == true" class="stake-button" @click="claimLPRewards">
              Claim Rewards
            </div>
          </div>

          <div v-else class="d-flex align-self-center mb-4">
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
      return parseInt(this.$store.state.settings.lpStakeAllowance) > 0;
    },
    isUnstake() {
      return this.selectedMapOption === 'Unstake';
    }
  },

  methods: {
    ...mapActions(['getLPStakeApproval', 'stakeLP', 'unstakeLP', 'claimRewards']),
    async executeStake() {
      if (this.selectedMapOption === 'Stake') {
        if (isNaN(this.quantity) || this.quantity === 0 || this.quantity === '') {
          alert('Please enter a value!');
          return;
        }

        await this.stakeLP(this.quantity.toString());
      } else {
        await this.unstakeLP();
      }
    },

    async claimLPRewards() {
      await this.claimRewards();
    },

    setMax() {
      this.quantity = this.$store.state.settings.lpBalance;
    },

    async seekApproval() {
      switch (this.selectedMapOption) {
        case 'Stake':
          if (isNaN(this.quantity) || this.quantity === 0 || this.quantity === '') {
            alert('Please enter a value!');
            return;
          } else {
            await this.getLPStakeApproval(this.quantity.toString());
          }

          break;
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
