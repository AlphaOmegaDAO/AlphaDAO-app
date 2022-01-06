<template>

  <div class="position-fixed top-0 end-0 p-3">
    <div :class="['toast', 'show', toast.color]" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header">
        <strong class="me-auto">{{toast.title}}</strong>
        <button type="button" class="btn-close" aria-label="Close" @click="onRemoveToast(toast)"></button>
      </div>
      <div class="toast-body">
        {{toast.body}}
      </div>
    </div>
  </div>

</template>

<script>
  export default {
    mounted() {
      setTimeout(() => this.onRemoveToast(this.toast), 3500);
    },

    props: ['toast', 'onRemoveToast'],
  };

</script>
<style>
  .toast {
    transition: transform 0.4s ease-in-out;
    animation: toast-in-right 0.5s;
  }

  @keyframes toast-in-right {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }
</style>
