<template>
  <nav class="navbar navbar-dark bg-dark sticky-top py-2" style="width:100%;">
    <div class="container-fluid" style="max-width: 80%;">
      <router-link :to="{ name: 'home' }" class="navbar-brand d-flex align-items-center">
        <img src="~/@/assets/logo.svg" class="logo" />
        <h4 class="ticker-name">Olympus</h4>
        <h1 class="py-4"></h1>
      </router-link>

      <ul class="navbar-nav me-auto mb-2 mb-lg-0 d-flex flex-row">
        <li class="nav-item drop-menu-item">
          <h4>Developers</h4>
          <div class="drop-menu-hidden">
            <a href="https://docs.olympusdao.finance"><p>Documentation</p></a>
            <a href="https://github.com/olympusDAO"><p>Github</p></a>
          </div>
        </li>

        <li class="nav-item drop-menu-item">
          <h4>Learn</h4>
          <div class="drop-menu-hidden">
            <a href="#what">
              <p>What is Olympus?</p>
            </a>
            <a href="#how">
              <p>How it works</p>
            </a>
            <a href="https://olympusdao.medium.com/">
              <p>Blog</p>
            </a>
          </div>
        </li>

        <li class="nav-item drop-menu-item">
          <h4>Governance</h4>
          <div class="drop-menu-hidden">
            <a href="http://vote.olympusdao.finance/">
              <p>Vote</p>
            </a>
            <a href="https://forum.olympusdao.finance">
              <p>Forum</p>
            </a>
          </div>
        </li>

      </ul>

      <router-link :to="{ name: 'stake' }" class="button button-primary d-none d-sm-block mx-4" style="color: black !important;">
        Enter App
      </router-link>

      <a role="button" @click="clickedGetOHM" class="btn btn-dark btn-overwrite-primer d-none d-sm-block" href="https://app.sushi.com/swap?inputCurrency=0x6b175474e89094c44da98b954eedeac495271d0f&outputCurrency=0x383518188c0c6d7730d91b2c03a03c837814a899" target="_blank">
        Get OHM
      </a>
    </div>






    <ModalLogin :open="modalLoginOpen" @close="modalLoginOpen = false" />
  </nav>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      modalLoginOpen: false
    };
  },

  computed: mapState({
    name: state => state.settings.name,
    address: state => state.settings.address
  }),
  methods: {
    clickedGetOHM(evt) {
      window.analytics.track("Clicked Button", {button: 'Get OHM'})
    }

  }
};
</script>
