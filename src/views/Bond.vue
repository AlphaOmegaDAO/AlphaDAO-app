<template>
  <div class="d-flex align-items-center justify-content-center min-vh-100">
    <div class="dapp-center-modal flex-column">
      <div class="d-flex flex-row align-items-center my-2 px-2 my-md-4 px-md-4">
        <router-link
          :to="{ name: 'choose_bond' }"
          class="align-items-center"
          style="position:absolute"
        >
          <i class="fa fa-chevron-left"></i>
          Back
        </router-link>

        <div class="d-flex flex-row col justify-content-center">
          <div class="ohm-pairs d-sm-flex mr-2 d-none">
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

          <div class="text-light align-self-center">
            <h3>
              OHM-DAI SLP Bond
            </h3>
          </div>
        </div>

        <div style="position:relative;">
          <a role="button" @click="toggleAdvancedMenu" v-if="!isRedeem">
            <i class="fa fa-cog fa-2x" />
          </a>

          <AdvancedSettings
            v-bind:slippage="slippage"
            v-bind:recipientAddress="recipientAddress"
            v-bind:showAdvancedMenu="showAdvancedMenu"
            @onSlippageChange="onSlippageChange"
            @onRecipientChange="onRecipientChange"
          />
        </div>

      </div>

      <div class="dapp-modal-wrapper py-2 px-2 py-md-4 px-md-2 m-auto">
        <div class="swap-input-column">
          <div class="stake-toggle-row">
            <toggle-switch
              :options="myOptions"
              v-model="selectedMapOption"
              :value="selectedMapOption"
            />
          </div>

          <div v-if="isRedeem == false" class="input-group ohm-input-group mb-3 flex-nowrap d-flex">
            <input
              v-on:keyup="onInputChange"
              v-on:change="onInputChange"
              id="bond-input-id"
              type="number"
              class="form-control"
              placeholder="Type an amount"
            />
            <button class="btn" type="button" @click="setMax">Max</button>
          </div>

          <div v-if="isRedeem == false" class="stake-price-data-column">
            <div class="stake-price-data-row">
              <p class="price-label">Balance</p>
              <p class="price-data">{{ trim($store.state.settings.lpBalance, 4) }} SLP</p>
            </div>
            <div class="stake-price-data-row">
              <p class="price-label">Bond Price</p>
              <p id="bond-price-id" class="price-data">
                {{ trim($store.state.settings.bondPrice, 2) }} DAI
              </p>
            </div>
            <div class="stake-price-data-row">
              <p class="price-label">Market Price</p>
              <p id="bond-market-price-id" class="price-data">
                {{ trim($store.state.settings.marketPrice, 2) }} DAI
              </p>
            </div>

            <div
              v-bind:class="['stake-price-data-row', hasEnteredAmount ? '' : 'd-none']"
            >
              <p class="price-label">You Will Get</p>
              <p id="bond-value-id" class="price-data">
                {{ trim($store.state.settings.bondQuote, 4) }} OHM
              </p>
            </div>

            <div
              v-bind:class="['stake-price-data-row', hasEnteredAmount ? 'd-none' : '']"
            >
              <p class="price-label">Max You Can Buy</p>
              <p id="bond-value-id" class="price-data">
                {{ trim($store.state.settings.maxBondPrice, 4) }} OHM
              </p>
            </div>
          </div>

          <div v-else class="stake-price-data-column">
            <div class="stake-price-data-row">
              <p class="price-label">Balance</p>
              <p class="price-data">{{ trim($store.state.settings.lpBalance, 4) }} SLP</p>
            </div>
            <div class="stake-price-data-row">
              <p class="price-label">Pending Rewards</p>
              <p id="bond-market-price-id" class="price-data">
                {{ trim($store.state.settings.interestDue, 4) }} OHM
              </p>
            </div>
            <div class="stake-price-data-row">
              <p class="price-label">Claimable Rewards</p>
              <p id="bond-market-price-id" class="price-data">
                {{ trim($store.state.settings.pendingPayout, 4) }} OHM
              </p>
            </div>
            <div class="stake-price-data-row">
              <p class="price-label">Time until fully vested</p>
              <p id="bond-market-price-id" class="price-data">
                {{ vestingTime() }}
              </p>
            </div>
          </div>

          <div v-if="isRedeem == true" class="d-flex align-self-center mb-4">
            <div class="redeem-button" @click="redeem">Claim Rewards</div>
          </div>

          <div
            v-else-if="hasAllowance == true && isRedeem == false"
            class="d-flex align-self-center mb-4"
          >
            <div id="bond-button-id" class="redeem-button" @click="bond">Bond</div>
          </div>

          <div v-else class="d-flex align-self-center mb-4">
            <div id="bond-button-id" class="redeem-button" @click="seekApproval">Approve</div>
          </div>

          <div v-if="!isRedeem" class="stake-price-data-column">
            <div class="stake-price-data-row">
              <p class="price-label">Slippage Tolerance</p>
              <p id="bond-value-id" class="price-data">{{ slippage }}%</p>
            </div>

            <div class="stake-price-data-row" v-if="recipientAddress !== $store.state.address">
              <p class="price-label">Recipient</p>
              <p class="price-data">{{ shortenAddress(recipientAddress) }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bond-data">
        <div class="row bond-data-row p-4">
          <div class="col-4 text-center">
            <p>Debt Ratio</p>
            <p>{{ trim($store.state.settings.debtRatio / 10000000, 2) }}%</p>
          </div>
          <div class="col-4 text-center">
            <p>Vesting Term</p>
            <p>{{ vestingPeriod() }}</p>
          </div>
          <div class="col-4 text-center">
            <p>ROI</p>
            <p>{{ trim($store.state.settings.bondDiscount * 100, 2) }}%</p>
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

  async mounted() {
    const amount = document.getElementById('bond-input-id').value;
    await this.calcBondDetails(amount);
    await this.calculateUserBondDetails();
  },

  data() {
    return {
      showAdvancedMenu: false,
      slippage: 2,
      recipientAddress: this.$store.state.address,

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
            { name: 'Bond', color: 'black', backgroundColor: 'white' },
            { name: 'Redeem', color: 'black', backgroundColor: 'white' }
          ]
        }
      },
      selectedMapOption: 'Bond',
      bondToggle: true
    };
  },
  computed: {
    ...mapState(['settings']),

    hasEnteredAmount() {
      return this.$store.state.settings.amount;
    },
    isRedeem() {
      return this.selectedMapOption === 'Redeem';
    },
    hasAllowance() {
      return this.$store.state.settings.lpBondAllowance > 0;
    }
  },

  methods: {
    ...mapActions([
      'redeemBond',
      'bondLP',
      'getLPBondApproval',
      'getLPBondAllowance',
      'calcBondDetails',
      'calculateUserBondDetails'
    ]),

    vestingPeriod() {
      const currentBlock = this.$store.state.settings.currentBlock;
      const vestingBlock = parseInt(currentBlock) + parseInt(this.$store.state.settings.vestingTerm);
      const seconds      = this.secondsUntilBlock(currentBlock, vestingBlock);
      return this.prettifySeconds(seconds, 'day');
    },

    vestingTime() {
      const currentBlock = this.$store.state.settings.currentBlock;
      const vestingBlock = this.$store.state.settings.bondMaturationBlock;
      return this.prettyVestingPeriod(currentBlock, vestingBlock);
    },

    toggleAdvancedMenu() {
      this.showAdvancedMenu = !this.showAdvancedMenu;
    },

    onSlippageChange(value) {
      this.slippage = value;
    },

    onRecipientChange(value) {
      if (value !== this.$store.state.address) {
        const confirm = window.confirm(
          "You're changing the recipient address of this bond. Make sure you understand what you're doing!"
        );
        if (!confirm) {
          this.recipientAddress = this.$store.state.address;
        } else {
          this.recipientAddress = value;
        }
      }
    },

    async setMax() {
      // Calculate suppliedQuantity and round it to down to avoid conflicts with uint.
      const suppliedQuantity = this.$store.state.settings.lpBalance;

      if (this.selectedMapOption === 'Bond') {
        this.quantity = suppliedQuantity;
        document.getElementById('bond-input-id').value = suppliedQuantity;
        await this.calcBondDetails(suppliedQuantity);
        await this.calculateUserBondDetails();
      }
    },

    async onInputChange() {
      const amount = document.getElementById('bond-input-id').value;
      await this.calcBondDetails(amount);
      await this.calculateUserBondDetails();
    },

    async seekApproval() {
      if (this.selectedMapOption === 'Bond') {
        if (isNaN(this.$store.state.settings.amount)) {
          alert('The value entered is not a number. Please try again!');
          return;
        } else {
          await this.getLPBondApproval(this.$store.state.settings.amount);
        }
      }
    },

    async bond() {
      const value = this.$store.state.settings.amount;
      const bondInterest = this.$store.state.settings.interestDue;
      const bondRewardDue = this.$store.state.settings.pendingPayout;

      if (this.selectedMapOption === 'Bond') {
        if (value === '') {
          alert('Please enter a value!');
        } else if (isNaN(value)) {
          alert('Please enter a valid value!');
        } else if (bondInterest > 0 || bondRewardDue > 0) {
          const shouldProceed = confirm(
            'You have an existing bond. Bonding will reset your vesting period and forfeit rewards. We recommend claiming rewards first or using a fresh wallet. Do you still want to proceed?'
          );
          if (shouldProceed) {
            await this.bondLP({
              value,
              slippage: this.slippage,
              recipientAddress: this.recipientAddress
            });
          }
        } else {
          await this.bondLP({
            value,
            slippage: this.slippage,
            recipientAddress: this.recipientAddress
          });
        }
      }
    },

    async redeem() {
      await this.redeemBond();
    }
  }
};
</script>
<style scoped>
.hasEffect {
  cursor: pointer;
}
</style>
