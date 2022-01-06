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
          <div class="ohm-pairs d-flex mr-2 d-none d-sm-flex">
            <div class="ohm-pair" style="z-index: 1;">
              <img
                src="https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png"
              />
            </div>
          </div>

          <div class="text-light align-self-center">
            <h3>
              DAI Bond
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

          <div v-if="!isRedeem" class="input-group ohm-input-group mb-3 flex-nowrap d-flex">
            <input
              v-model="quantity"
              v-on:keyup="onInputChange"
              v-on:change="onInputChange"
              id="dai-bond-input-id"
              type="number"
              class="form-control"
              placeholder="Type an amount"
            />
            <button class="btn" type="button" @click="setMax">Max</button>
          </div>

          <div v-if="!isRedeem" class="stake-price-data-column">
            <div class="stake-price-data-row">
              <p class="price-label">Balance</p>
              <p class="price-data">{{ trimNumber($store.state.settings.balance, 2) }} DAI</p>
            </div>
            <div class="stake-price-data-row">
              <p class="price-label">Bond Price</p>
              <p id="bond-price-id" class="price-data">
                {{ trimNumber($store.state.settings.daiBond.price, 2) }} DAI
              </p>
            </div>
            <div class="stake-price-data-row">
              <p class="price-label">Market Price</p>
              <p id="bond-market-price-id" class="price-data">
                {{ trimNumber($store.state.settings.marketPrice, 2) }} DAI
              </p>
            </div>

            <div
              v-bind:class="['stake-price-data-row', hasEnteredAmount ? '' : 'd-none']"
            >
              <p class="price-label">You Will Get</p>
              <p id="bond-value-id" class="price-data">
                {{ trimNumber($store.state.settings.daiBond.bondQuote, 4) }} OHM
              </p>
            </div>


            <div
              v-bind:class="['stake-price-data-row', hasEnteredAmount ? 'd-none' : '']"
            >
              <p class="price-label">Max You Can Buy</p>
              <p id="bond-value-id" class="price-data">
                {{ trim($store.state.settings.daiBond.maxBondPrice, 4) }} OHM
              </p>
            </div>

          </div>

          <div v-else class="stake-price-data-column">
            <div class="stake-price-data-row">
              <p class="price-label">Balance</p>
              <p class="price-data">{{ trimNumber($store.state.settings.balance, 2) }} DAI</p>
            </div>
            <div class="stake-price-data-row">
              <p class="price-label">Pending Rewards</p>
              <p id="bond-market-price-id" class="price-data">
                {{ trimNumber($store.state.settings.daiBond.interestDue, 4) }} OHM
              </p>
            </div>
            <div class="stake-price-data-row">
              <p class="price-label">Claimable Rewards</p>
              <p id="bond-market-price-id" class="price-data">
                {{ trimNumber($store.state.settings.daiBond.pendingPayout, 4) }} OHM
              </p>
            </div>
            <div class="stake-price-data-row">
              <p class="price-label">Time until fully vested</p>
              <p id="bond-market-price-id" class="price-data">
                {{ vestingTime() }}
              </p>
            </div>
          </div>

          <div v-if="isRedeem" class="d-flex align-self-center mb-4">
            <div class="redeem-button" @click="redeem">Claim Rewards</div>
          </div>

          <div v-else-if="hasAllowance == true && !isRedeem" class="d-flex align-self-center">
            <div id="bond-button-id" class="redeem-button" @click="bond">Bond DAI</div>
          </div>

          <div v-else class="d-flex align-self-center">
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
            <p>{{ trimNumber($store.state.settings.daiBond.debtRatio / 10000000, 2) }}%</p>
          </div>
          <div class="col-4 text-center">
            <p>Vesting Term</p>
            <p>{{ vestingPeriod() }}</p>
          </div>
          <div class="col-4 text-center">
            <p>ROI</p>
            <p>{{ trim($store.state.settings.daiBond.discount * 100, 2) }}%</p>
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
    await this.calcDaiBondDetails('');
    await this.calculateUserDaiBondDetails();
  },

  data() {
    return {
      quantity: null,
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
      return !!this.quantity && this.quantity !== '';
    },

    isRedeem() {
      return this.selectedMapOption === 'Redeem';
    },

    hasAllowance() {
      return this.$store.state.settings.daiBondAllowance > 0;
    }
  },

  methods: {
    ...mapActions([
      'redeemDaiBond',
      'bondDAI',
      'getDaiBondApproval',
      'calcDaiBondDetails',
      'calculateUserDaiBondDetails'
    ]),

    vestingPeriod() {
      const currentBlock = this.$store.state.settings.currentBlock;
      const vestingBlock = parseInt(currentBlock) + parseInt(this.$store.state.settings.daiBond.vestingPeriodInBlocks);
      const seconds      = this.secondsUntilBlock(currentBlock, vestingBlock);
      return this.prettifySeconds(seconds, 'day');
    },

    vestingTime() {
      const currentBlock = this.$store.state.settings.currentBlock;
      const vestingBlock = this.$store.state.settings.daiBond.bondMaturationBlock;
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
      const suppliedQuantity = this.$store.state.settings.balance;

      if (this.selectedMapOption === 'Bond') {
        this.quantity = suppliedQuantity;
        await this.calcDaiBondDetails(suppliedQuantity);
        await this.calculateUserDaiBondDetails();
      }
    },

    async onInputChange() {
      await this.calcDaiBondDetails(this.quantity);
      await this.calculateUserDaiBondDetails();
    },

    async seekApproval() {
      if (isNaN(this.quantity) || this.quantity === '') {
        alert('Please enter a value!');
        return;
      } else {
        await this.getDaiBondApproval();
      }
    },

    async bond() {
      const bondInterest = this.$store.state.settings.daiBond.interestDue;
      const bondRewardDue = this.$store.state.settings.daiBond.pendingPayout;

      if (!this.quantity || this.quantity === '' || isNaN(this.quantity)) {
        alert('Please enter a value!');
        return;
      } else if (bondInterest > 0 || bondRewardDue > 0) {
        const shouldProceed = confirm(
          'You have an existing DAI bond. Bonding will reset your vesting period and forfeit rewards. We recommend claiming rewards first or using a fresh wallet. Do you still want to proceed?'
        );
        if (shouldProceed) {
          await this.bondDAI({
            value: this.quantity,
            slippage: this.slippage,
            recipientAddress: this.recipientAddress
          });
        }
      } else {
        await this.bondDAI({
          value: this.quantity,
          slippage: this.slippage,
          recipientAddress: this.recipientAddress
        });
      }
    },

    async redeem() {
      await this.redeemDaiBond();
    }
  }
};
</script>
<style scoped>
.hasEffect {
  cursor: pointer;
}
</style>
