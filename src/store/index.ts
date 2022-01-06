import Vue from 'vue';
import Vuex from 'vuex';
import modules from './modules';
import { ethers } from 'ethers';
import addresses from '@/helpers/addresses';

Vue.use(Vuex);

// store: {state: {}, constants: {}, settings: {}}
const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules,
  state: {
    appLoading: false,
    toasts: [],
    isSidebarExpanded: false,
    address: null,
    network: { chainId: 1 },
    provider: null
  },

  mutations: {
    toggleSidebar(state, value) {
      state.isSidebarExpanded = value;
    },

    removeToast(state, toast) {
      state.toasts = state.toasts.filter(t => t['uuid'] !== toast.uuid);
    },

    // Allows us to commit state directly from actions.
    set(_state, payload) {
      Object.keys(payload).forEach(key => {
        Vue.set(_state, key, payload[key]);
      });
    }
  },

  actions: {
    init: async ({ commit, dispatch }) => {
      commit('set', { appLoading: true });

      let signer, address, network;
      const provider = await dispatch('getProvider');

      if (!provider) {
        console.error('This website require MetaMask');
      } else {
        signer = provider.getSigner();
        network = await provider.getNetwork();
        try {
          address = await signer.getAddress();
        } catch (error) {
          console.log(error);
        }

        commit('set', { address, network });

        if (addresses[network.chainId]) {
          dispatch('calcBondDetails', '');
          dispatch('calcDaiBondDetails', '');
          dispatch('calcStakeDetails');
        }

        if (address)
          dispatch('loadAccountDetails');
      }

      commit('set', { appLoading: false });
    },

    login: async () => {
      try {
        // @ts-ignore
        await window.ethereum.enable();
      } catch (error) {
        window.alert(error.message);
      }
    },

    disconnectWallet: ({ commit }) => {
      commit('set', { address: null });
    },

    getProvider: async ({ commit }) => {
      // @ts-ignore
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window['ethereum']);
        commit('set', { provider });
        return provider;
      }
    }
  }
});

const ethereum = window['ethereum'];
if (ethereum) {
  ethereum.on('accountsChanged', () => {
    store.dispatch('init');
  });

  ethereum.on('networkChanged', () => {
    store.dispatch('init');
  });
}

export default store;
