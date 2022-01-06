<template>
  <Modal :open="open" @close="$emit('close')">
    <div class="modal-body px-4">
      <div class="wallet-button" @click="handleLogin" :disabled="!service || isLoading">
        <div class="wallet-column py-4">
          <img src="~/@/assets/metamask.svg" height="53" class="mt-2 pt-1" />
          <div class="flex-auto py-2" style="color:black;">MetaMask</div>
          <div class="flex-auto" style="color:#c5c5c5">Connect to MetaMask</div>
        </div>
        <VueLoadingIndicator v-if="isLoading" class="big" />
      </div>
    </div>
  </Modal>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: ['open'],
  data() {
    return {
      isLoading: false,
      service: 'metamask'
    };
  },
  methods: {
    ...mapActions(['login']),
    async handleLogin() {
      this.isLoading = true;
      await this.login();
      this.$emit('close');
    }
  }
};
</script>
