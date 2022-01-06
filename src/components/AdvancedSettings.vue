<template>
  <div v-if="showAdvancedMenu" class="card ohm-popover-card">
    <div class="card-body">
      <h2 class="card-title mb-4">Hades</h2>
      <form>
        <div class="mb-3">
          <label for="slippage" class="form-label">Slippage</label>

          <div class="input-group ohm-input-group flex-nowrap d-flex">
            <input
              :value="slippage"
              @input="onSlippageChange"
              type="number"
              max="100"
              min="100"
              class="form-control ohm-form-control"
              id="slippage"
            />
            <span class="input-group-text" id="basic-addon2">%</span>
          </div>
          <div id="emailHelp" class="form-text">
            Transaction may revert if price changes by more than slippage %
          </div>
        </div>

        <div class="mb-3">
          <label for="slippage" class="form-label">Recipient Address</label>

          <div class="ohm-input-group">
            <input
              :value="recipientAddress"
              @blur="onRecipientChange"
              type="text"
              class="form-control ohm-form-control"
            />
          </div>
          <div class="form-text">
            Choose recipient address. By default, this is your currently connected address
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { shorten } from '@/helpers/utils.ts';
import { mapActions } from 'vuex';

export default {
  data() {
    return {};
  },

  props: ['slippage', 'recipientAddress', 'showAdvancedMenu'],
  computed: {},
  methods: {
    onSlippageChange(event) {
      this.$emit('onSlippageChange', event.target.value);
    },

    onRecipientChange(event) {
      this.$emit('onRecipientChange', event.target.value);
    }
  }
};
</script>
