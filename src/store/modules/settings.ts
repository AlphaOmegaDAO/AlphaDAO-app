import Vue from 'vue';
import { ethers } from 'ethers';
import addresses from '@/helpers/addresses';
import { abi as ierc20Abi } from '@/helpers/abi/IERC20.json';
import { abi as OHMPreSale } from '@/helpers/abi/OHMPreSale.json';
import { abi as OlympusStaking } from '@/helpers/abi/OlympusStaking.json';
import { abi as MigrateToOHM } from '@/helpers/abi/MigrateToOHM.json';
import { abi as sOHM } from '@/helpers/abi/sOHM.json';
import { abi as LPStaking } from '@/helpers/abi/LPStaking.json';
import { abi as DistributorContract } from '@/helpers/abi/DistributorContract.json';
import { abi as BondContract } from '@/helpers/abi/BondContract.json';
import { abi as DaiBondContract } from '@/helpers/abi/DaiBondContract.json';
import mixin from '@/helpers/mixins';
import { whitelist } from '@/helpers/whitelist.json';
const parseEther = ethers.utils.parseEther;

let provider, network, address;

const state = {
  approval: 0,
  loading: false,
  name: '',
  whitelisted: false,
  balance: 0,
  ohmBalance: 0,
  claim: 0,
  minimumEth: 0,
  providedEth: 0,
  amount: '',
  remainingEth: 0,
  exchangeRates: {},
  allowance: 0,
  stakeAllowance: 0,
  unstakeAllowance: 0,
  balances: {},
  authorized: false,
  allowanceTx: 0,
  saleTx: 0,
  confirmations: 1,
  allotment: 0,
  maxPurchase: 0,
  maxSwap: 0,
  amountSwap: 0,
  daiBond: {}
};

// Defines convenience function set() that can be used to update key property
// with payload property.
// TODO: might be better to use mutation-types.js instead
// https://vuex.vuejs.org/guide/mutations.html#using-constants-for-mutation-types
const mutations = {
  set(_state, payload) {
    Object.keys(payload).forEach(key => {
      Vue.set(_state, key, payload[key]);
    });
  }
};


const actions = {
  loadAccountDetails: async ({ commit, dispatch, rootState }) => {
    console.log('Logging in...');
    commit('set', { userDataLoading: true });

    provider = rootState.provider;
    network = rootState.network;
    address = rootState.address;

    const toast = mixin.methods.buildToast({title: 'Unsupported network', color: 'bg-danger', body: 'We detected an unsupported network. Please change your network to Ethereum mainnet'})
    if (!addresses[network.chainId]) {
      commit('set', { toasts: [...rootState.toasts, toast] })
      return;
    }

    if (provider) {
      try {
        const aOHMContract = await new ethers.Contract(addresses[network.chainId].AOHM_ADDRESS, ierc20Abi, provider);
        const aOHMBalanceBeforeDecimals = await aOHMContract.balanceOf(address);
        const aOHMBalance = aOHMBalanceBeforeDecimals / Math.pow(10, 9);

        let ohmContract, ohmBalance = 0;
        let sohmBalance = 0, stakeAllowance = 0, unstakeAllowance = 0;
        let lpStakingContract, lpStaked = 0, pendingRewards = 0;
        let lpStakeAllowance, distributorContract, lpBondAllowance = 0, daiBondAllowance = 0;
        let migrateContract, aOHMAbleToClaim = 0;

        if (whitelist.includes(address)) commit('set', { whitelisted: true });

        const daiContract = new ethers.Contract(addresses[network.chainId].DAI_ADDRESS, ierc20Abi, provider);
        const balance     = await daiContract.balanceOf(address);
        const lpContract  = new ethers.Contract(addresses[network.chainId].LP_ADDRESS, ierc20Abi,provider);
        const allowance   = await daiContract.allowance(address,addresses[network.chainId].PRESALE_ADDRESS)!;
        const lpBalance   = await lpContract.balanceOf(address);

        if (addresses[network.chainId].BOND_ADDRESS) {
          lpBondAllowance = await lpContract.allowance(
            address,
            addresses[network.chainId].BOND_ADDRESS
          );
          await dispatch('calculateUserBondDetails');
        }

        if (addresses[network.chainId].DAI_BOND_ADDRESS) {
          daiBondAllowance = await daiContract.allowance(address, addresses[network.chainId].DAI_BOND_ADDRESS);

          await dispatch('calculateUserDaiBondDetails');
        }

        if (addresses[network.chainId].MIGRATE_ADDRESS) {
          migrateContract = new ethers.Contract(
            addresses[network.chainId].MIGRATE_ADDRESS,
            MigrateToOHM,
            provider
          );
          aOHMAbleToClaim = await migrateContract.senderInfo(address);
        }

        // Calculate user LP Staking
        if (addresses[network.chainId].LPSTAKING_ADDRESS) {
          lpStakingContract = new ethers.Contract(addresses[network.chainId].LPSTAKING_ADDRESS, LPStaking, provider);
          ohmContract       = new ethers.Contract(addresses[network.chainId].OHM_ADDRESS, ierc20Abi, provider);

          lpStaked         = await lpStakingContract.getUserBalance(address);
          pendingRewards   = await lpStakingContract.pendingRewards(address);
          lpStakeAllowance = await lpContract.allowance(address, addresses[network.chainId].LPSTAKING_ADDRESS);
        }

        if (addresses[network.chainId].OHM_ADDRESS) {
          ohmContract = new ethers.Contract(
            addresses[network.chainId].OHM_ADDRESS,
            ierc20Abi,
            provider
          );
          ohmBalance = await ohmContract.balanceOf(address);
          stakeAllowance = await ohmContract.allowance(
            address,
            addresses[network.chainId].STAKING_ADDRESS
          )!;
        }

        if (addresses[network.chainId].SOHM_ADDRESS) {
          const sohmContract = await new ethers.Contract(
            addresses[network.chainId].SOHM_ADDRESS,
            ierc20Abi,
            provider
          );
          sohmBalance = await sohmContract.balanceOf(address);
          unstakeAllowance = await sohmContract.allowance(
            address,
            addresses[network.chainId].STAKING_ADDRESS
          )!;
        }

        if (addresses[network.chainId].DISTRIBUTOR_ADDRESS) {
          distributorContract = new ethers.Contract(
            addresses[network.chainId].DISTRIBUTOR_ADDRESS,
            DistributorContract,
            provider
          );
        }

        commit('set', {
          balance: ethers.utils.formatEther(balance),
          aOHMBalance,
          userDataLoading: false,
          loading: false,
          ohmBalance: ethers.utils.formatUnits(ohmBalance, 'gwei'),
          sohmBalance: ethers.utils.formatUnits(sohmBalance, 'gwei'),
          lpBalance: ethers.utils.formatUnits(lpBalance, 'ether'),
          lpStaked: ethers.utils.formatUnits(lpStaked, 'ether'),
          pendingRewards: ethers.utils.formatUnits(pendingRewards, 'gwei'),
          aOHMAbleToClaim: ethers.utils.formatUnits(aOHMAbleToClaim, 'gwei'),
          allowance,
          stakeAllowance,
          unstakeAllowance,
          lpStakeAllowance,
          lpBondAllowance,
          daiBondAllowance
        });

        dispatch('getAllotmentPerBuyer');
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('This website require MetaMask');
    }
  },
  loading: ({ commit }, payload) => {
    commit('set', { loading: payload });
  },

  async getApproval({ commit, dispatch }, value) {
    if (!provider) {
      alert('Please connect your wallet!');
      return;
    }

    const signer = provider.getSigner();
    const daiContract = await new ethers.Contract(
      addresses[network.chainId].DAI_ADDRESS,
      ierc20Abi,
      signer
    );

    if (value <= 0) {
      alert('Please enter a value greater than 0');
      return;
    }

    const approveTx = await daiContract.approve(
      addresses[network.chainId].PRESALE_ADDRESS,
      ethers.utils.parseEther(value).toString()
    );
    commit('set', { allowanceTx: 1 });
    await approveTx.wait();
    await dispatch('getAllowances');
  },

  async getAllowances({ commit }) {
    if (address) {
      const diaContract = await new ethers.Contract(
        addresses[network.chainId].DAI_ADDRESS,
        ierc20Abi,
        provider
      );
      const allowance = await diaContract.allowance(
        address,
        addresses[network.chainId].PRESALE_ADDRESS
      );
      commit('set', { allowance });
    }
  },

  async getStakeApproval({ dispatch }, value) {
    if (!provider) {
      alert('Please connect your wallet!');
      return;
    }

    const signer = provider.getSigner();
    const ohmContract = await new ethers.Contract(
      addresses[network.chainId].OHM_ADDRESS,
      ierc20Abi,
      signer
    );
    if (value <= 0) {
      alert('Please enter a value greater than 0');
      return;
    }

    // Approve tx
    let approveTx;
    try {
      approveTx = await ohmContract.approve(
        addresses[network.chainId].STAKING_ADDRESS,
        ethers.utils.parseUnits('1000000000', 'gwei').toString()
      );
    } catch (error) {
      alert(error.message);
      return;
    }

    await approveTx.wait();
    await dispatch('getStakeAllowances');
  },

  async getLPStakeApproval({ dispatch }, value) {
    if (!provider) {
      alert('Please connect your wallet!');
      return;
    }

    const signer = provider.getSigner();
    const lpContract = await new ethers.Contract(
      addresses[network.chainId].LP_ADDRESS,
      ierc20Abi,
      signer
    );
    if (value <= 0) {
      alert('Please enter a value greater than 0');
      return;
    }

    const approveTx = await lpContract.approve(
      addresses[network.chainId].LPSTAKING_ADDRESS,
      ethers.utils.parseUnits('1000000000', 'ether').toString()
    );
    await approveTx.wait();
    await dispatch('getLPStakeAllowance');
  },

  async getLPBondApproval({ dispatch }, value) {
    if (!provider) {
      alert('Please connect your wallet!');
      return;
    }

    const signer = provider.getSigner();
    const lpContract = await new ethers.Contract(
      addresses[network.chainId].LP_ADDRESS,
      ierc20Abi,
      signer
    );
    if (value <= 0) {
      alert('Please enter a value greater than 0');
      return;
    }

    const approveTx = await lpContract.approve(
      addresses[network.chainId].BOND_ADDRESS,
      ethers.utils.parseUnits('1000000000', 'ether').toString()
    );
    await approveTx.wait();
    await dispatch('getLPBondAllowance');
  },

  async getStakeAllowances({ commit }) {
    if (address) {
      const ohmContract = await new ethers.Contract(
        addresses[network.chainId].OHM_ADDRESS,
        ierc20Abi,
        provider
      );
      const stakeAllowance = await ohmContract.allowance(
        address,
        addresses[network.chainId].STAKING_ADDRESS
      );
      commit('set', { stakeAllowance });
    }
  },

  async getLPStakeAllowance({ commit }) {
    if (address) {
      const lpContract = await new ethers.Contract(
        addresses[network.chainId].LP_ADDRESS,
        ierc20Abi,
        provider
      );
      const lpStakeAllowance = await lpContract.allowance(
        address,
        addresses[network.chainId].LPSTAKING_ADDRESS
      );
      commit('set', { lpStakeAllowance });
    }
  },

  async getLPBondAllowance({ commit }) {
    if (address) {
      const lpContract = await new ethers.Contract(
        addresses[network.chainId].LP_ADDRESS,
        ierc20Abi,
        provider
      );
      const lpBondAllowance = await lpContract.allowance(
        address,
        addresses[network.chainId].BOND_ADDRESS
      );
      commit('set', { lpBondAllowance });
    }
  },

  async getunStakeApproval({ dispatch }, value) {
    if (!provider) {
      alert('Please connect your wallet!');
      return;
    }

    const signer = provider.getSigner();
    const sohmContract = await new ethers.Contract(
      addresses[network.chainId].SOHM_ADDRESS,
      ierc20Abi,
      signer
    );
    if (value <= 0) {
      alert('Please enter a value greater than 0');
      return;
    }

    const approveTx = await sohmContract.approve(
      addresses[network.chainId].STAKING_ADDRESS,
      ethers.utils.parseUnits('1000000000', 'gwei').toString()
    );
    await approveTx.wait();
    await dispatch('getunStakeAllowances');
  },

  async getunStakeAllowances({ commit }) {
    if (address) {
      const sohmContract = await new ethers.Contract(
        addresses[network.chainId].SOHM_ADDRESS,
        ierc20Abi,
        provider
      );
      const unstakeAllowance = await sohmContract.allowance(
        address,
        addresses[network.chainId].STAKING_ADDRESS
      );
      commit('set', { unstakeAllowance });
    }
  },
  async calculateSaleQuote({ commit }, value) {
    const presale = await new ethers.Contract(
      addresses[network.chainId].PRESALE_ADDRESS,
      OHMPreSale,
      provider
    );
    const amount = await presale.calculateSaleQuote(ethers.utils.parseUnits(value, 'ether'));
    commit('set', { amount: ethers.utils.formatUnits(amount.toString(), 'gwei').toString() });
  },

  async getAllotmentPerBuyer({ commit }) {
    if (!provider) {
      alert('Please connect your wallet!');
      return;
    }

    const presale = await new ethers.Contract(
      addresses[network.chainId].PRESALE_ADDRESS,
      OHMPreSale,
      provider
    );
    const allotment = await presale.getAllotmentPerBuyer();
    commit('set', { allotment: ethers.utils.formatUnits(allotment, 'gwei') });
  },

  async getMaxPurchase({ commit }) {
    if (!provider) {
      alert('Please connect your wallet!');
      return;
    }

    const presale = await new ethers.Contract(
      addresses[network.chainId].PRESALE_ADDRESS,
      OHMPreSale,
      provider
    );
    const salePrice = await presale.salePrice();
    const total = state.allotment * salePrice;

    commit('set', { maxPurchase: ethers.utils.formatUnits(total.toString(), 'ether') });
  },

  async stakeOHM({ commit }, value) {
    if (!provider) {
      alert('Please connect your wallet!');
      return;
    }

    const signer = provider.getSigner();
    const staking = await new ethers.Contract(
      addresses[network.chainId].STAKING_ADDRESS,
      OlympusStaking,
      signer
    );

    let stakeTx;
    try {
      stakeTx = await staking.stakeOHM(ethers.utils.parseUnits(value, 'gwei'));
    } catch (error) {
      if (error.code === -32603 && error.message.indexOf('ds-math-sub-underflow') >= 0) {
        alert(
          'You may be trying to bond more than your balance! Error code: 32603. Message: ds-math-sub-underflow'
        );
      } else {
        alert(error.message);
      }
      return;
    }

    await stakeTx.wait();
    const ohmContract = new ethers.Contract(
      addresses[network.chainId].OHM_ADDRESS,
      ierc20Abi,
      provider
    );
    const ohmBalance = await ohmContract.balanceOf(address);
    const sohmContract = new ethers.Contract(
      addresses[network.chainId].SOHM_ADDRESS,
      ierc20Abi,
      provider
    );
    const sohmBalance = await sohmContract.balanceOf(address);
    commit('set', {
      ohmBalance: ethers.utils.formatUnits(ohmBalance, 'gwei'),
      sohmBalance: ethers.utils.formatUnits(sohmBalance, 'gwei')
    });
  },

  async unstakeOHM({ commit }, value) {
    if (!provider) {
      alert('Please connect your wallet!');
      return;
    }

    const signer = provider.getSigner();
    const staking = await new ethers.Contract(
      addresses[network.chainId].STAKING_ADDRESS,
      OlympusStaking,
      signer
    );
    const stakeTx = await staking.unstakeOHM(ethers.utils.parseUnits(value, 'gwei'));
    await stakeTx.wait();
    const ohmContract = new ethers.Contract(
      addresses[network.chainId].OHM_ADDRESS,
      ierc20Abi,
      provider
    );
    const ohmBalance = await ohmContract.balanceOf(address);
    const sohmContract = new ethers.Contract(
      addresses[network.chainId].SOHM_ADDRESS,
      ierc20Abi,
      provider
    );
    const sohmBalance = await sohmContract.balanceOf(address);
    commit('set', {
      ohmBalance: ethers.utils.formatUnits(ohmBalance, 'gwei'),
      sohmBalance: ethers.utils.formatUnits(sohmBalance, 'gwei')
    });
  },

  async stakeLP({ commit }, value) {
    if (!provider) {
      alert('Please connect your wallet!');
      return;
    }

    const signer = provider.getSigner();
    const staking = await new ethers.Contract(
      addresses[network.chainId].LPSTAKING_ADDRESS,
      LPStaking,
      signer
    );

    // Deposit the bond
    let stakeTx;
    try {
      stakeTx = await staking.stakeLP(ethers.utils.parseUnits(value, 'ether'));
    } catch (error) {
      if (error.code === -32603 && error.message.indexOf('ds-math-sub-underflow') >= 0) {
        alert(
          'You may be trying to bond more than your balance! Error code: 32603. Message: ds-math-sub-underflow'
        );
      } else {
        alert(error.message);
      }
      return;
    }
    await stakeTx.wait();

    const lpContract = new ethers.Contract(
      addresses[network.chainId].LP_ADDRESS,
      ierc20Abi,
      provider
    );
    const lpBalance = await lpContract.balanceOf(address);
    const lpStakingContract = new ethers.Contract(
      addresses[network.chainId].LPSTAKING_ADDRESS,
      LPStaking,
      provider
    );
    const lpStaked = await lpStakingContract.getUserBalance(address);
    commit('set', {
      lpBalance: ethers.utils.formatUnits(lpBalance, 'ether'),
      lpStaked: ethers.utils.formatUnits(lpStaked, 'ether')
    });
  },

  async unstakeLP({ commit }) {
    if (!provider) {
      alert('Please connect your wallet!');
      return;
    }

    const signer = provider.getSigner();
    const staking = await new ethers.Contract(
      addresses[network.chainId].LPSTAKING_ADDRESS,
      LPStaking,
      signer
    );

    try {
      const unstakeTx = await staking.unstakeLP();
      await unstakeTx.wait();
    } catch (error) {
      alert(error.message);
      return;
    }

    const lpContract = new ethers.Contract(
      addresses[network.chainId].LP_ADDRESS,
      ierc20Abi,
      provider
    );
    const lpBalance = await lpContract.balanceOf(address);
    const lpStakingContract = new ethers.Contract(
      addresses[network.chainId].LPSTAKING_ADDRESS,
      LPStaking,
      provider
    );
    const lpStaked = await lpStakingContract.getUserBalance(address);
    commit('set', {
      lpBalance: ethers.utils.formatUnits(lpBalance, 'ether'),
      lpStaked: ethers.utils.formatUnits(lpStaked, 'ether')
    });
  },

  async claimRewards() {
    if (!provider) {
      alert('Please connect your wallet!');
      return;
    }

    const signer = provider.getSigner();
    const staking = await new ethers.Contract(
      addresses[network.chainId].LPSTAKING_ADDRESS,
      LPStaking,
      signer
    );

    try {
      const claimTx = await staking.claimRewards();
      await claimTx.wait();
    } catch (error) {
      alert(error.message);
      return;
    }
  },

  async bondLP({ commit }, { value, slippage, recipientAddress }) {
    const depositorAddress = recipientAddress || address;
    const acceptedSlippage = slippage / 100 || 0.02; // 2%
    const valueInWei = ethers.utils.parseUnits(value.toString(), 'ether');

    console.log("depositorAddress = ", depositorAddress);
    console.log("acceptedSlippage = ", acceptedSlippage);

    const signer = provider.getSigner();
    const bonding = await new ethers.Contract(addresses[network.chainId].BOND_ADDRESS, BondContract, signer);

    // Calculate maxPremium based on premium and slippage.
    // const calculatePremium = await bonding.calculatePremium();
    const calculatePremium = await bonding.bondPrice();
    const maxPremium       = Math.round(calculatePremium * (1 + acceptedSlippage));

    // Deposit the bond
    try {
      const bondTx = await bonding.deposit(valueInWei, maxPremium, depositorAddress);
      await bondTx.wait();
      const lpContract = new ethers.Contract(addresses[network.chainId].LP_ADDRESS, ierc20Abi, provider);
      const lpBalance  = await lpContract.balanceOf(address);
      commit('set', { lpBalance: ethers.utils.formatUnits(lpBalance, 'ether') });

    } catch (error) {
      if (error.code === -32603 && error.message.indexOf('ds-math-sub-underflow') >= 0) {
        alert(
          'You may be trying to bond more than your balance! Error code: 32603. Message: ds-math-sub-underflow'
        );
      } else {
        alert(error.message);
      }
      return;
    }
  },

  async redeemBond() {
    if (!provider) {
      alert('Please connect your wallet!');
      return;
    }

    const signer = provider.getSigner();
    const bonding = await new ethers.Contract(
      addresses[network.chainId].BOND_ADDRESS,
      BondContract,
      signer
    );

    try {
      const redeemTx = await bonding.redeem();
      await redeemTx.wait();
    } catch (error) {
      alert(error.message);
    }
  },

  async forfeitBond() {
    if (!provider) {
      alert('Please connect your wallet!');
      return;
    }

    const signer = provider.getSigner();
    const bonding = await new ethers.Contract(
      addresses[network.chainId].BOND_ADDRESS,
      BondContract,
      signer
    );
    const forfeitTx = await bonding.withdrawPrincipleAndForfeitInterest();
    await forfeitTx.wait();
  },

  async getMaxSwap({ commit }) {
    if (!provider) {
      alert('Please connect your wallet!');
      return;
    }

    const aOHMContract = await new ethers.Contract(
      addresses[network.chainId].AOHM_ADDRESS,
      ierc20Abi,
      provider
    );
    const aOHMBalanceBeforeDecimals = await aOHMContract.balanceOf(address);
    const aOHMBalance = aOHMBalanceBeforeDecimals / 1000000000;

    commit('set', { maxSwap: aOHMBalance });
  },

  async migrateToOHM({ commit }, value) {
    if (!provider) {
      alert('Please connect your wallet!');
      return;
    }

    const signer = provider.getSigner();
    const migrateContact = await new ethers.Contract(
      addresses[network.chainId].MIGRATE_ADDRESS,
      MigrateToOHM,
      signer
    );

    const aOHMContract = await new ethers.Contract(
      addresses[network.chainId].AOHM_ADDRESS,
      ierc20Abi,
      provider
    );
    const aOHMContractWithSigner = aOHMContract.connect(signer);

    const allowance = await aOHMContract.allowance(
      address,
      addresses[network.chainId].MIGRATE_ADDRESS
    );

    if (allowance < value * 1000000000) {
      const approveTx = await aOHMContractWithSigner.approve(
        addresses[network.chainId].MIGRATE_ADDRESS,
        parseEther((1e9).toString())
      );
      commit('set', { allowanceTx: 1 });
      await approveTx.wait(state.confirmations);
    }

    const migrateTx = await migrateContact.migrate(value * 1000000000);
    await migrateTx.wait();
  },

  async reclaimAOHM() {
    if (!provider) {
      alert('Please connect your wallet!');
      return;
    }

    const signer = provider.getSigner();
    const migrateContact = await new ethers.Contract(
      addresses[network.chainId].MIGRATE_ADDRESS,
      MigrateToOHM,
      signer
    );

    const reclaimTx = await migrateContact.reclaim();
    await reclaimTx.wait();
  },

  // Dai Bonds
  async getDaiBondApproval({ dispatch }) {
    if (!provider) {
      alert('Please connect your wallet!');
      return;
    }

    const signer = provider.getSigner();
    const contract = await new ethers.Contract(
      addresses[network.chainId].DAI_ADDRESS,
      ierc20Abi,
      signer
    );
    const approveTx = await contract.approve(
      addresses[network.chainId].DAI_BOND_ADDRESS,
      ethers.utils.parseUnits('1000000000', 'ether').toString()
    );
    await approveTx.wait();
    await dispatch('getDaiBondAllowance');
  },

  async getDaiBondAllowance({ commit }) {
    if (address) {
      const contract = await new ethers.Contract(
        addresses[network.chainId].DAI_ADDRESS,
        ierc20Abi,
        provider
      );
      const daiBondAllowance = await contract.allowance(
        address,
        addresses[network.chainId].DAI_BOND_ADDRESS
      );
      commit('set', { daiBondAllowance });
    }
  },

  async redeemDaiBond() {
    if (!provider) {
      alert('Please connect your wallet!');
      return;
    }

    const signer = provider.getSigner();
    const bonding = await new ethers.Contract(
      addresses[network.chainId].DAI_BOND_ADDRESS,
      DaiBondContract,
      signer
    );

    try {
      const redeemTx = await bonding.redeem();
      await redeemTx.wait();
    } catch (error) {
      alert(error.message);
    }
  },

  async bondDAI({ commit }, { value, slippage, recipientAddress }) {
    const depositorAddress = recipientAddress || address;
    const acceptedSlippage = slippage / 100 || 0.02; // 2%
    const valueInWei = ethers.utils.parseUnits(value.toString(), 'ether');

    console.log('depositorAddress = ', depositorAddress);
    console.log('acceptedSlippage = ', acceptedSlippage);

    // Get the bonding contract
    const signer = provider.getSigner();
    const daiBondContract = await new ethers.Contract(
      addresses[network.chainId].DAI_BOND_ADDRESS,
      DaiBondContract,
      signer
    );

    // Calculate maxPremium based on premium and slippage.
    const calculatePremium = await daiBondContract.calculatePremium();
    const maxPremium = Math.round(calculatePremium * (1 + acceptedSlippage));

    // Deposit the bond
    let bondTx;
    try {
      bondTx = await daiBondContract.deposit(valueInWei, maxPremium, depositorAddress);
      await bondTx.wait();
    } catch (error) {
      if (error.code === -32603 && error.message.indexOf('ds-math-sub-underflow') >= 0) {
        alert(
          'You may be trying to bond more than your balance! Error code: 32603. Message: ds-math-sub-underflow'
        );
      } else {
        alert(error.message);
      }
      return;
    }

    // Update the balance
    const contract = new ethers.Contract(
      addresses[network.chainId].DAI_ADDRESS,
      ierc20Abi,
      provider
    );
    const daiBalance = await contract.balanceOf(address);
    commit('set', {
      balance: ethers.utils.formatUnits(daiBalance, 'ether')
    });
  }
};

export default {
  state,
  mutations,
  actions
};
