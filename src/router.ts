import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '@/views/Home.vue';
import Dapp from './views/Dapp.vue';
import Dashboard from './views/Dashboard.vue';
import Stake from './views/Stake.vue';
import Bond from './views/Bond.vue';
import ChooseBond from './views/ChooseBond.vue';
import DaiBond from './views/DaiBond.vue';
import Migrate from './views/Swap.vue';
import LPStaking from './views/LPStaking.vue';
import store from './store/index';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  { path: '/', name: 'home', component: Home },
  { path: '/dashboard', name: 'dashboard', component: Dashboard },
  { path: '/stake', name: 'stake', component: Stake },
  { path: '/bond', name: 'bond', component: Bond },
  { path: '/bondai', name: 'bondai', component: DaiBond },
  { path: '/choose_bond', name: 'choose_bond', component: ChooseBond },
  { path: '/lpstake', name: 'lpstake', component: LPStaking },
  { path: '/migrate', name: 'migrate', component: Migrate },
  { path: '/app', name: 'dapp', component: Dapp }
];

const router = new VueRouter({
  routes
});

router.afterEach((to, from) => {
  store.commit('toggleSidebar', false);

  (window as any).analytics.page({
    path: to.fullPath,
    referrer: from.fullPath
  })
});

export default router;
