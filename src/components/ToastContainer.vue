<template>
  <div class="position-fixed top-0 end-0 p-3" style="z-index: 20;">
    <div class="toast-container">
      <Toast v-for="toast in toasts" v-bind:key="toast.uuid" :toast="toast" :onRemoveToast="removeToast" />
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    computed: {
      ...mapState(['toasts']),
    },

    methods: {
      removeToast(toast) {
        this.$store.commit('removeToast', toast);
      }
    }
  };


</script>
