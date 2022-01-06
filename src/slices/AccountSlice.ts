import { BigNumber, BigNumberish, ethers } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as sOXv2 } from "../abi/sOxv2.json";
import { abi as fuseProxy } from "../abi/FuseProxy.json";
import { abi as wsOX } from "../abi/wsOX.json";

import { setAll } from "../helpers";

import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { IBaseAddressAsyncThunk, ICalcUserBondDetailsAsyncThunk } from "./interfaces";
import { FuseProxy, IERC20, SOxv2, WsOX } from "src/typechain";

export const getBalances = createAsyncThunk(
  "account/getBalances",
  async ({ address, networkID, provider }: IBaseAddressAsyncThunk) => {
    let ohmBalance = BigNumber.from(0);
    let soxBalance = BigNumber.from(0);
    let wsoxBalance = BigNumber.from(0);
    let wsoxAsSohm = BigNumber.from(0);
    let poolBalance = BigNumber.from(0);
    let aalphaBalance = BigNumber.from(0);
    if (addresses[networkID].OX_ADDRESS) {
      const oxContract = new ethers.Contract(addresses[networkID].OX_ADDRESS as string, ierc20Abi, provider) as IERC20;
      ohmBalance = await oxContract.balanceOf(address);
    }

    if (addresses[networkID].SOX_ADDRESS) {
      const soxContract = new ethers.Contract(
        addresses[networkID].SOX_ADDRESS as string,
        ierc20Abi,
        provider,
      ) as IERC20;
      soxBalance = await soxContract.balanceOf(address);
    }

    if (addresses[networkID].WSOX_ADDRESS) {
      const wsoxContract = new ethers.Contract(addresses[networkID].WSOX_ADDRESS as string, wsOX, provider) as WsOX;
      wsoxBalance = await wsoxContract.balanceOf(address);
      // NOTE (appleseed): wsoxAsSohm is wsOX given as a quantity of sOX
      wsoxAsSohm = await wsoxContract.wOXTosOX(wsoxBalance);
    }

    if (addresses[networkID].PT_TOKEN_ADDRESS) {
      const poolTokenContract = new ethers.Contract(
        addresses[networkID].PT_TOKEN_ADDRESS as string,
        ierc20Abi,
        provider,
      ) as IERC20;
      poolBalance = await poolTokenContract.balanceOf(address);
    }

    if (addresses[networkID].AOX_ADDRESS) {
      const aalphaContract = new ethers.Contract(addresses[networkID].AOX_ADDRESS as string, sOXv2, provider) as SOxv2;
      aalphaBalance = await aalphaContract.balanceOf(address);
    }

    return {
      balances: {
        ox: ethers.utils.formatUnits(ohmBalance, "gwei"),
        sox: ethers.utils.formatUnits(soxBalance, "gwei"),
        wsox: ethers.utils.formatEther(wsoxBalance),
        wsoxAsSohm: ethers.utils.formatUnits(wsoxAsSohm, "gwei"),
        pool: ethers.utils.formatUnits(poolBalance, "gwei"),
        aalpha: ethers.utils.formatUnits(aalphaBalance, "gwei"),
      },
    };
  },
);

interface IUserAccountDetails {
  balances: {
    busd: string;
    ox: string;
    sox: string;
    wsox: string;
    wsoxAsSohm: string;
  };
  staking: {
    ohmStake: number;
    ohmUnstake: number;
  };
  wrapping: {
    soxWrap: number;
    wsoxUnwrap: number;
  };
  bonding: {
    daiAllowance: number;
  };
}

export const loadAccountDetails = createAsyncThunk(
  "account/loadAccountDetails",
  async ({ networkID, provider, address }: IBaseAddressAsyncThunk) => {
    let ohmBalance = BigNumber.from(0);
    let soxBalance = BigNumber.from(0);
    let fsoxBalance = BigNumber.from(0);
    let fsoxString = "0.0";
    let wsoxBalance = BigNumber.from(0);
    let wsoxAsSohm = BigNumber.from(0);
    let wrapAllowance = BigNumber.from(0);
    let unwrapAllowance = BigNumber.from(0);
    let stakeAllowance = BigNumber.from(0);
    let unstakeAllowance = BigNumber.from(0);
    let aalphaAllowance = BigNumber.from(0);
    let aalphaBalance = BigNumber.from(0);
    let lpStaked = 0;
    let pendingRewards = 0;
    let lpBondAllowance = 0;
    let daiBondAllowance = 0;
    let aOXAbleToClaim = 0;
    let poolBalance = BigNumber.from(0);
    let poolAllowance = BigNumber.from(0);

    const daiContract = new ethers.Contract(addresses[networkID].DAI_ADDRESS as string, ierc20Abi, provider) as IERC20;
    const daiBalance = await daiContract.balanceOf(address);

    if (addresses[networkID].OX_ADDRESS) {
      const oxContract = new ethers.Contract(addresses[networkID].OX_ADDRESS as string, ierc20Abi, provider) as IERC20;
      ohmBalance = await oxContract.balanceOf(address);
      stakeAllowance = await oxContract.allowance(address, addresses[networkID].STAKING_HELPER_ADDRESS);
    }

    if (addresses[networkID].SOX_ADDRESS) {
      const soxContract = new ethers.Contract(addresses[networkID].SOX_ADDRESS as string, sOXv2, provider) as SOxv2;
      soxBalance = await soxContract.balanceOf(address);
      unstakeAllowance = await soxContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
      // poolAllowance = await soxContract.allowance(address, addresses[networkID].PT_PRIZE_POOL_ADDRESS);
      // wrapAllowance = await soxContract.allowance(address, addresses[networkID].WSOX_ADDRESS);
    }

    if (addresses[networkID].AOX_ADDRESS) {
      const aalphaContract = new ethers.Contract(addresses[networkID].AOX_ADDRESS as string, sOXv2, provider) as SOxv2;
      aalphaBalance = await aalphaContract.balanceOf(address);
      aalphaAllowance = await aalphaContract.allowance(address, addresses[networkID].CLAIM_ADDRESS);
    }

    // if (addresses[networkID].PT_TOKEN_ADDRESS) {
    //   const poolTokenContract = new ethers.Contract(
    //     addresses[networkID].PT_TOKEN_ADDRESS,
    //     ierc20Abi,
    //     provider,
    //   ) as IERC20;
    //   poolBalance = await poolTokenContract.balanceOf(address);
    // }

    // for (const fuseAddressKey of ["FUSE_6_SOX", "FUSE_18_SOX"]) {
    //   if (addresses[networkID][fuseAddressKey]) {
    //     const fsoxContract = new ethers.Contract(
    //       addresses[networkID][fuseAddressKey] as string,
    //       fuseProxy,
    //       provider.getSigner(),
    //     ) as FuseProxy;
    //     // fsoxContract.signer;
    //     const balanceOfUnderlying = await fsoxContract.callStatic.balanceOfUnderlying(address);
    //     fsoxBalance = balanceOfUnderlying.add(fsoxBalance);
    //   }
    // }

    // if (addresses[networkID].WSOX_ADDRESS) {
    //   const wsoxContract = new ethers.Contract(
    //     addresses[networkID].WSOX_ADDRESS as string,
    //     wsOX,
    //     provider,
    //   ) as WsOX;
    //   wsoxBalance = await wsoxContract.balanceOf(address);
    //   // NOTE (appleseed): wsoxAsSohm is used to calc your next reward amount
    //   wsoxAsSohm = await wsoxContract.wOXTosOX(wsoxBalance);
    //   unwrapAllowance = await wsoxContract.allowance(address, addresses[networkID].WSOX_ADDRESS);
    // }

    return {
      balances: {
        busd: ethers.utils.formatEther(daiBalance),
        ox: ethers.utils.formatUnits(ohmBalance, "gwei"),
        sox: ethers.utils.formatUnits(soxBalance, "gwei"),
        fsox: ethers.utils.formatUnits(fsoxBalance, "gwei"),
        wsox: ethers.utils.formatEther(wsoxBalance),
        wsoxAsSohm: ethers.utils.formatUnits(wsoxAsSohm, "gwei"),
        pool: ethers.utils.formatUnits(poolBalance, "gwei"),
        aalpha: ethers.utils.formatUnits(aalphaBalance, "gwei"),
      },
      staking: {
        ohmStake: +stakeAllowance,
        ohmUnstake: +unstakeAllowance,
      },
      claim: {
        aalphaAllowance: aalphaAllowance,
      },
      wrapping: {
        ohmWrap: +wrapAllowance,
        ohmUnwrap: +unwrapAllowance,
      },
      bonding: {
        daiAllowance: daiBondAllowance,
      },
      pooling: {
        soxPool: +poolAllowance,
      },
    };
  },
);

export interface IUserBondDetails {
  allowance: number;
  interestDue: number;
  bondMaturationBlock: number;
  pendingPayout: string; //Payout formatted in gwei.
}
export const calculateUserBondDetails = createAsyncThunk(
  "account/calculateUserBondDetails",
  async ({ address, bond, networkID, provider }: ICalcUserBondDetailsAsyncThunk) => {
    if (!address) {
      return {
        bond: "",
        displayName: "",
        bondIconSvg: "",
        isLP: false,
        allowance: 0,
        balance: "0",
        interestDue: 0,
        bondMaturationBlock: 0,
        pendingPayout: "",
      };
    }
    // dispatch(fetchBondInProgress());

    // Calculate bond details.
    const bondContract = bond.getContractForBond(networkID, provider);
    const reserveContract = bond.getContractForReserve(networkID, provider);

    let pendingPayout, bondMaturationBlock;

    const bondDetails = await bondContract.bondInfo(address);
    let interestDue: BigNumberish = Number(bondDetails.payout.toString()) / Math.pow(10, 9);
    bondMaturationBlock = +bondDetails.vesting + +bondDetails.lastBlock;
    pendingPayout = await bondContract.pendingPayoutFor(address);

    let allowance,
      balance = BigNumber.from(0);
    allowance = await reserveContract.allowance(address, bond.getAddressForBond(networkID));
    balance = await reserveContract.balanceOf(address);
    // formatEthers takes BigNumber => String
    const balanceVal = ethers.utils.formatEther(balance);
    // balanceVal should NOT be converted to a number. it loses decimal precision
    return {
      bond: bond.name,
      displayName: bond.displayName,
      bondIconSvg: bond.bondIconSvg,
      isLP: bond.isLP,
      allowance: Number(allowance.toString()),
      balance: balanceVal,
      interestDue,
      bondMaturationBlock,
      pendingPayout: ethers.utils.formatUnits(pendingPayout, "gwei"),
    };
  },
);

interface IAccountSlice {
  bonds: { [key: string]: IUserBondDetails };
  balances: {
    ox: string;
    sox: string;
    busd: string;
    oldsox: string;
  };
  loading: boolean;
}
const initialState: IAccountSlice = {
  loading: false,
  bonds: {},
  balances: { ox: "", sox: "", busd: "", oldsox: "" },
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    fetchAccountSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAccountDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAccountDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAccountDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(getBalances.pending, state => {
        state.loading = true;
      })
      .addCase(getBalances.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getBalances.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(calculateUserBondDetails.pending, state => {
        state.loading = true;
      })
      .addCase(calculateUserBondDetails.fulfilled, (state, action) => {
        if (!action.payload) return;
        const bond = action.payload.bond;
        state.bonds[bond] = action.payload;
        state.loading = false;
      })
      .addCase(calculateUserBondDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      });
  },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
