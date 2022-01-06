import Vue from 'vue';
import { COINGECKO_URL } from '@/helpers/constants';
import { ethers } from 'ethers';
import addresses from '@/helpers/addresses';
import { abi as ierc20Abi } from '@/helpers/abi/IERC20.json';
import { abi as PairContract } from '@/helpers/abi/PairContract.json';
import { abi as BondContract } from '@/helpers/abi/BondContract.json';
import { abi as BondCalcContract } from '@/helpers/abi/BondCalcContract.json';
import { abi as LpBondCalcContract } from '@/helpers/abi/LpBondCalcContract.json';
import { abi as DaiBondContract } from '@/helpers/abi/DaiBondContract.json';
import { abi as CirculatingSupplyContract } from '@/helpers/abi/CirculatingSupplyContract.json';
import { abi as LPStaking } from '@/helpers/abi/LPStaking.json';
import { abi as OlympusStaking } from '@/helpers/abi/OlympusStaking.json';
import { abi as sOHM } from '@/helpers/abi/sOHM.json';
import mixin from '@/helpers/mixins';

const state = {
  ohmCircSupply: null,
  marketPrice: null,
  ohmTotalSupply: null,
  daiBond: {}
};

const actions = {
  // Uses PairContract
  async getMarketPrice({ commit, rootState }) {
    const pairContract = new ethers.Contract(
      addresses[rootState.network.chainId].LP_ADDRESS,
      PairContract,
      rootState.provider
    );
    const reserves = await pairContract.getReserves();
    const marketPrice = reserves[1] / reserves[0];

    commit('set', { marketPrice: marketPrice / Math.pow(10, 9) });
    return marketPrice;
  },

  async getTokenSupply({ commit, rootState }) {
    const ohmContract = new ethers.Contract(
      addresses[rootState.network.chainId].OHM_ADDRESS,
      ierc20Abi,
      rootState.provider
    );

    const circulatingSupplyContract = new ethers.Contract(
      addresses[rootState.network.chainId].CIRCULATING_SUPPLY_ADDRESS,
      CirculatingSupplyContract,
      rootState.provider
    );

    const ohmCircSupply  = await circulatingSupplyContract.OHMCirculatingSupply();
    const ohmTotalSupply = await ohmContract.totalSupply();
    commit('set', { ohmCircSupply, ohmTotalSupply });

    return {
      circulating: ohmCircSupply,
      total: ohmTotalSupply,
    }
  },

  async calculateUserBondDetails({ commit, rootState }) {
    if (!rootState.address) return;

    // Calculate bond details.
    const bondingContract = new ethers.Contract(
      addresses[rootState.network.chainId].BOND_ADDRESS,
      BondContract,
      rootState.provider
    );
    const bondDetails = await bondingContract.bondInfo(rootState.address);
    const interestDue = bondDetails[1];
    const bondMaturationBlock = +bondDetails[3] + +bondDetails[2];
    const pendingPayout = await bondingContract.pendingPayoutFor(rootState.address);

    commit('set', {
      interestDue: ethers.utils.formatUnits(interestDue, 'gwei'),
      bondMaturationBlock,
      pendingPayout: ethers.utils.formatUnits(pendingPayout, 'gwei')
    });
  },

  async calcStakeDetails({ commit, dispatch, rootState }) {
    const lpContract        = new ethers.Contract(addresses[rootState.network.chainId].LP_ADDRESS, ierc20Abi, rootState.provider);
    const lpStakingContract = new ethers.Contract(addresses[rootState.network.chainId].LPSTAKING_ADDRESS, LPStaking, rootState.provider);
    const ohmContract       = new ethers.Contract(addresses[rootState.network.chainId].OHM_ADDRESS, ierc20Abi, rootState.provider);
    const stakingContract   = new ethers.Contract(addresses[rootState.network.chainId].STAKING_ADDRESS, OlympusStaking, rootState.provider);
    const sohmContract      = new ethers.Contract(addresses[rootState.network.chainId].SOHM_ADDRESS, ierc20Abi, rootState.provider);
    const sohmMainContract  = new ethers.Contract(addresses[rootState.network.chainId].SOHM_ADDRESS, sOHM, rootState.provider);


    // Calculate LP stake
    const totalLPStaked = await lpStakingContract.totalStaked();
    const totalLP       = await lpContract.totalSupply();
    const OHMInLP       = await ohmContract.balanceOf(addresses[rootState.network.chainId].LP_ADDRESS);

    const rewardPerBlock = await lpStakingContract.rewardPerBlock();
    const lpStakingAPY   = (rewardPerBlock * 6650 * 366 * 100) / (((totalLPStaked * OHMInLP) / totalLP) * 2);

    // Calculating staking
    const stakingReward = await stakingContract.ohmToDistributeNextEpoch();
    const circSupply    = await sohmMainContract.circulatingSupply();


    const stakingRebase = stakingReward / circSupply;
    const fiveDayRate   = Math.pow(1 + stakingRebase, 5 * 3) - 1;
    const stakingAPY    = Math.pow(1 + stakingRebase, 365 * 3);

    // Calculate index
    const currentIndex = await sohmContract.balanceOf('0xA62Bee23497C920B94305FF68FA7b1Cd1e9FAdb2');

    // NOTE: This will modify provider which is part of Vuex store. You'll
    // see Error: [vuex] do not mutate vuex store state outside mutation handlers.
    const currentBlock = await rootState.provider.getBlockNumber();

    commit('set', {
      totalLPStaked: ethers.utils.formatUnits(totalLPStaked, 'ether'),
      stakingReward: ethers.utils.formatUnits(stakingReward, 'gwei'),
      currentIndex: ethers.utils.formatUnits(currentIndex, 'gwei'),
      lpStakingAPY,
      fiveDayRate,
      stakingAPY,
      stakingRebase,
      currentBlock,
    });

  },

  async calcBondDetails({ commit, dispatch, rootState }, amount) {
    let amountInWei;
    if (!amount || amount === '') {
      amountInWei = ethers.utils.parseEther('0.0001'); // Use a realistic SLP ownership
    } else {
      amountInWei = ethers.utils.parseEther(amount);
    }
    const pairContract = new ethers.Contract(
      addresses[rootState.network.chainId].LP_ADDRESS,
      PairContract,
      rootState.provider
    );
    // If the user hasn't entered anything, let's calculate a fraction of SLP
    const bondingContract = new ethers.Contract(
      addresses[rootState.network.chainId].BOND_ADDRESS,
      BondContract,
      rootState.provider
    );
    const lpContract = new ethers.Contract(
      addresses[rootState.network.chainId].LP_ADDRESS,
      ierc20Abi,
      rootState.provider
    );
    const bondCalcContract = new ethers.Contract(
      addresses[rootState.network.chainId].LP_BONDINGCALC_ADDRESS,
      LpBondCalcContract,
      rootState.provider
    );

    const totalLP = await lpContract.totalSupply();
    const ohmSupply = await dispatch('getTokenSupply', null, { root: true });
    const vestingTerm = await bondingContract.vestingTerm();

    const totalDebtDo = await bondingContract.totalDebt();
    const debtRatio   = await bondingContract.debtRatio();
    const marketPrice = await dispatch('getMarketPrice');

    const maxBondPrice = await bondingContract.maxPayout();
    const bondPrice    = await bondingContract.bondPriceInDAI();
    const bondDiscount = (marketPrice * Math.pow(10, 9) - bondPrice) / bondPrice; // 1 - bondPrice / (marketPrice * Math.pow(10, 9));


    // Bond quote comes from valuing LP contract.
    let valuation = await bondCalcContract.valuation(addresses[rootState.network.chainId].LP_ADDRESS, amountInWei);
    let bondQuote = await bondingContract.payoutFor(valuation);
    valuation = valuation / Math.pow(10, 18);
    bondQuote = bondQuote / Math.pow(10, 9);

    // Display error if user tries to exceed maximum.
    if (!!amount && parseFloat(bondQuote) > (maxBondPrice / Math.pow(10,9)) ) {
      const toast = mixin.methods.buildToast({title: 'Bond quote exceeds maximum payout', color: 'bg-warning', body: "You're trying to bond more than the maximum payout availabe! The maximum bond payout is " + (maxBondPrice / Math.pow(10,9)).toFixed(2).toString() + " OHM."});
      commit('set', { toasts: [...rootState.toasts, toast] })
    }

    commit('set', {
      amount,
      bondDiscount,
      debtRatio,
      bondQuote,
      vestingTerm,
      maxBondPrice: maxBondPrice / Math.pow(10,9),
      bondPrice: bondPrice / Math.pow(10, 18),
      marketPrice: marketPrice / Math.pow(10, 9)
    });
  },

  async calculateUserDaiBondDetails({ commit, rootState }) {
    if (!rootState.address) return;

    const daiBondContract = new ethers.Contract(
      addresses[rootState.network.chainId].DAI_BOND_ADDRESS,
      DaiBondContract,
      rootState.provider
    );
    const daiContract = new ethers.Contract(
      addresses[rootState.network.chainId].DAI_ADDRESS,
      ierc20Abi,
      rootState.provider
    );

    const bondDetails = await daiBondContract.depositorInfo(rootState.address);
    const interestDue = bondDetails[1];
    const bondMaturationBlock = +bondDetails[3] + +bondDetails[2];
    const pendingPayout = await daiBondContract.calculatePendingPayout(rootState.address);
    const bondData = state.daiBond || {};

    commit('set', {
      daiBond: {
        ...bondData,
        interestDue: ethers.utils.formatUnits(interestDue, 'gwei'),
        bondMaturationBlock: bondMaturationBlock,
        pendingPayout: ethers.utils.formatUnits(pendingPayout, 'gwei')
      }
    });
  },

  async calcDaiBondDetails({ dispatch, commit, rootState }, amount) {
    let amountInWei;
    if (!amount || amount === '') {
      amountInWei = ethers.utils.parseEther('1000'); // Assume average person puts in 1K DAI
    } else {
      amountInWei = ethers.utils.parseEther(amount.toString());
    }

    const daiBondContract = new ethers.Contract(
      addresses[rootState.network.chainId].DAI_BOND_ADDRESS,
      DaiBondContract,
      rootState.provider
    );
    const daiContract = new ethers.Contract(
      addresses[rootState.network.chainId].DAI_ADDRESS,
      ierc20Abi,
      rootState.provider
    );
    const bondingCalcContract = new ethers.Contract(
      addresses[rootState.network.chainId].BONDINGCALC_ADDRESS,
      BondCalcContract,
      rootState.provider
    );

    const marketPrice = await dispatch('getMarketPrice');
    const bondQuote = await daiBondContract.calculateBondInterest(amountInWei.toString());
    const maxBondPrice = await daiBondContract.getMaxPayoutAmount();
    const bondPrice = amountInWei / bondQuote;
    const discount = ( (marketPrice / 1000000000) - bondPrice ) / bondPrice; //1 - bondPrice / (marketPrice / 1000000000);

    const vestingPeriodInBlocks = await daiBondContract.vestingPeriodInBlocks();
    const ohmSupply = await dispatch('getTokenSupply', null, { root: true });
    const totalDebtDo = await daiBondContract.totalDebt();
    const debtRatio = await bondingCalcContract.calcDebtRatio(totalDebtDo, ohmSupply.circulating);

    // Display error if user tries to exceed maximum.
    if (!!amount && (bondQuote / Math.pow(10, 18)) > (maxBondPrice / Math.pow(10,9)) ) {
      const toast = mixin.methods.buildToast({title: 'Bond quote exceeds maximum payout', color: 'bg-warning', body: "You're trying to bond more than the maximum payout availabe! The maximum bond payout is " + (maxBondPrice / Math.pow(10,9)).toFixed(2).toString() + " OHM."});
      commit('set', { toasts: [...rootState.toasts, toast] })
    }

    commit('set', {
      daiBond: {
        bondQuote: bondQuote / Math.pow(10, 18),
        price: bondPrice,
        discount,
        maxBondPrice: maxBondPrice / Math.pow(10,9),
        marketPrice: marketPrice / Math.pow(10, 9),
        debtRatio,
        vestingPeriodInBlocks
      }
    });
  }
};

export default {
  state,
  actions,
  mutations: {
    // Allows us to commit state directly from actions.
    set(_state, payload) {
      Object.keys(payload).forEach(key => {
        Vue.set(_state, key, payload[key]);
      });
    }
  }
};
