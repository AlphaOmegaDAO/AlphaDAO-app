<template>
  <div class="dapp-nav">
    <router-link :to="{ name: 'dashboard' }" class="button button-dapp-menu">
      Dashboard
    </router-link>

    <router-link :to="{ name: 'stake' }" class="button button-dapp-menu">
      Stake
    </router-link>

    <router-link :to="{ name: 'choose_bond' }" class="button button-dapp-menu">
      Bond
    </router-link>

    <router-link :to="{ name: 'lpstake' }" class="button button-dapp-menu">
      LP Staking
    </router-link>

    <router-link :to="{ name: 'migrate' }" class="button button-dapp-menu">
      Reclaim AlphaOHM
    </router-link>
  </div>
</template>

<script>
export default {};
</script>
