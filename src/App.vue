<template>
  <div>
    <div id="app" v-if="$store.state.appLoading">
      <VueLoadingIndicator class="overlay big" />
    </div>

    <template v-else-if="isHome">
      <Nav />
      <div div id="app" class="overflow-hidden">
        <transition name="fade" mode="out-in">
          <router-view :key="$route.path" />
        </transition>
      </div>
    </template>

    <div id="app" v-else>
      <transition name="fade" mode="out-in">
        <div id="dapp" class="dapp min-vh-100">
          <div class="container-fluid">
            <ToastContainer />

            <div class="row">
              <nav class="navbar navbar-expand-lg navbar-light justify-content-end d-md-none">
                <button
                  class="navbar-toggler"
                  type="button"
                  @click="toggleNavbar"
                  aria-controls="navbarSupportedContent"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span class="navbar-toggler-icon"></span>
                </button>
              </nav>

              <Sidebar v-bind:isExpanded="$store.state.isSidebarExpanded" />

              <div
                v-bind:class="[
                  $store.state.isSidebarExpanded ? 'ohm-backdrop-show' : 'ohm-backdrop-close',
                  'ohm-backdrop'
                ]"
                @click="toggleNavbar"
              ></div>

              <div v-if="isConnected || isPublic" class="col-lg-10 col-12 mt-4 mt-md-0">
                <router-view :key="$route.path" />
              </div>

              <div v-else class="col-lg-10 col-12 mt-4 mt-md-0">
                <div class="d-flex align-items-center justify-content-center min-vh-100">
                  <div class="dapp-center-modal flex-column">
                    <div class="d-flex flex-row align-items-center my-2 px-2 my-md-4 px-md-4">
                      <div class="wallet-button col w-100 text-center" @click="handleLogin">
                        <div class="wallet-column py-4 w-100">
                          <img src="~/@/assets/metamask.svg" height="53" class="mt-2 pt-1" />
                          <div class="flex-auto py-2" style="color:black;">MetaMask</div>
                          <div class="flex-auto" style="color:#c5c5c5">Connect to MetaMask</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition-duration: 100ms;
    transition-property: opacity;
    transition-timing-function: ease;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0;
  }
</style>

<script>
  import { mapState, mapActions } from 'vuex';

  export default {
    async created() {
      this.init();
    },

    data() {
      return {
        isLoading: false
      };
    },
    computed: {
      ...mapState(['settings', 'constants']),
      isConnected() {
        return !!this.$store.state.address;
      },
      isPublic() {
        return (
          ['dashboard', 'choose_bond', 'bond', 'bondai'].indexOf(this.$route.name) >= 0 || this.isHome
        );
      },
      isHome() {
        return this.$route.name === 'home';
      }
    },
    methods: {
      ...mapActions(['init', 'login']),
      toggleNavbar() {
        this.$store.commit('toggleSidebar', !this.$store.state.isSidebarExpanded);
      },

      async handleLogin() {
        this.isLoading = true;
        this.login();
      }
    }
  };

  /*eslint-disable */
  // prettier-ignore
  !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e};analytics._writeKey="QaMVWT6EDkHigpT5Vobpy8NgfCK3JR9s";analytics.SNIPPET_VERSION="4.13.2";
  analytics.load(process.env.VUE_APP_SEGMENT_API);
  analytics.page();
  }}();
  /*eslint-disable */

</script>
