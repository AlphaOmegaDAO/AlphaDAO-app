import { ethers } from "ethers";
import { addresses } from "../constants";
import { abi as OlympusStaking } from "../abi/OlympusStaking.json";
import { abi as OlympusStakingv2 } from "../abi/OlympusStakingv2.json";
import { abi as sOHM } from "../abi/sOHM.json";
import { abi as sOHMv2 } from "../abi/sOhmv2.json";
import { setAll, getTokenPrice, getMarketPrice, getDisplayBalance } from "../helpers";
import { NodeHelper } from "../helpers/NodeHelper";
import apollo from "../lib/apolloClient.js";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { IBaseAsyncThunk } from "./interfaces";
import { allBonds, treasuryBalanceAll } from "src/helpers/AllBonds";
import ERC20 from '../lib/ERC20'
import  { abi as DistributorContractAbi } from '../abi/DistributorContract.json'

const initialState = {
  loading: false,
  loadingMarketPrice: false,
};

export const loadAppDetails = createAsyncThunk(
  "app/loadAppDetails",
  async ({ networkID, provider }: IBaseAsyncThunk, { dispatch }) => {
    const protocolMetricsQuery = `
  query {
    _meta {
      block {
        number
      }
    }
    protocolMetrics(first: 1, orderBy: timestamp, orderDirection: desc) {
      timestamp
      ohmCirculatingSupply
      sOhmCirculatingSupply
      totalSupply
      ohmPrice
      marketCap
      totalValueLocked
      treasuryMarketValue
      nextEpochRebase
      nextDistributedOhm
    }
  }
`;

    let marketPrice;
    try {
      const originalPromiseResult = await dispatch(
        loadMarketPrice({ networkID: networkID, provider: provider }),
      ).unwrap();
      marketPrice = originalPromiseResult?.marketPrice;
    } catch (rejectedValueOrSerializedError) {
      // handle error here
      console.error("Returned a null response from dispatch(loadMarketPrice)");
      return;
    }

    if (!provider) {
      console.error("failed to connect to provider, please connect your wallet");
      return {
        stakingTVL: 0,
        marketPrice,
        marketCap: 0,
        circSupply: 0,
        totalSupply: 0,
        treasuryMarketValue: 0,
      };
    }
    const currentBlock = await provider.getBlockNumber();

    const stakingContract = new ethers.Contract(
      addresses[networkID].STAKING_ADDRESS as string,
      OlympusStakingv2,
      provider,
    );

    const sohmMainContract = new ethers.Contract(addresses[networkID].SPID_ADDRESS as string, sOHMv2, provider);
    const ohmMainContract = new ethers.Contract(addresses[networkID].PID_ADDRESS as string, sOHMv2, provider);
    const DistributorContract = new ethers.Contract(addresses[networkID].DISTRIBUTOR_ADDRESS as string, DistributorContractAbi, provider);
    const endBlock = (await DistributorContract.nextEpochBlock()).toNumber()
    const totalSupply = Number(getDisplayBalance(await ohmMainContract.totalSupply(), 9));

    // Calculating staking
    const epoch = await stakingContract.epoch();
    const stakingReward = epoch.distribute;
    const circ = await sohmMainContract.circulatingSupply();
    const stakingRebase = stakingReward / circ;
    
    const fiveDayRate = Math.pow(1 + stakingRebase, 5 * 3) - 1;
    const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3) - 1;

    // Current index
    const currentIndex = await stakingContract.index();

    const bondBalance = (await Promise.all(allBonds.map(async (bonds) => {
      const address = await bonds.getAddressForBond(networkID);
      const balance = await ohmMainContract.balanceOf(address);
      // console.error(address)
      // console.error(balance.toNumber())
      return balance / 1e9
    }))).reduce((total, num) => total + num)

    const circSupply = totalSupply - bondBalance

    const marketCap = circSupply * marketPrice

    const Staked = circ / 1e9 / circSupply * 100
    const treasuryMarketValue = await treasuryBalanceAll(networkID, provider)
    // console.error(Staked)
    // console.error(treasuryMarketValue)
    const stakingTVL = marketCap * (Staked/100) 
    // console.error('--------totalValueLocked-------------')

    return {
      currentIndex: ethers.utils.formatUnits(currentIndex, "gwei"),
      currentBlock,
      endBlock,
      fiveDayRate,
      stakingAPY,
      stakingTVL,
      Staked,
      stakingRebase,
      marketCap,
      marketPrice,
      circVal:circ,
      circSupply,
      totalSupply,
      treasuryMarketValue
    } as IAppData;
  },
);

/**
 * checks if app.slice has marketPrice already
 * if yes then simply load that state
 * if no then fetches via `loadMarketPrice`
 *
 * `usage`:
 * ```
 * const originalPromiseResult = await dispatch(
 *    findOrLoadMarketPrice({ networkID: networkID, provider: provider }),
 *  ).unwrap();
 * originalPromiseResult?.whateverValue;
 * ```
 */
export const findOrLoadMarketPrice = createAsyncThunk(
  "app/findOrLoadMarketPrice",
  async ({ networkID, provider }: IBaseAsyncThunk, { dispatch, getState }) => {
    const state: any = getState();
    let marketPrice;
    // check if we already have loaded market price
    if (state.app.loadingMarketPrice === false && state.app.marketPrice) {
      // go get marketPrice from app.state
      marketPrice = state.app.marketPrice;
    } else {
      // we don't have marketPrice in app.state, so go get it
      try {
        const originalPromiseResult = await dispatch(
          loadMarketPrice({ networkID: networkID, provider: provider }),
        ).unwrap();
        marketPrice = originalPromiseResult?.marketPrice;
      } catch (rejectedValueOrSerializedError) {
        // handle error here
        console.error("Returned a null response from dispatch(loadMarketPrice)");
        return;
      }
    }
    return { marketPrice };
  },
);

/**
 * - fetches the OX price from CoinGecko (via getTokenPrice)
 * - falls back to fetch marketPrice from ox-BUSD contract
 * - updates the App.slice when it runs
 */
const loadMarketPrice = createAsyncThunk("app/loadMarketPrice", async ({ networkID, provider }: IBaseAsyncThunk) => {
  let marketPrice: number;
  try {
    marketPrice = await getMarketPrice({ networkID, provider });
    marketPrice = marketPrice;
  } catch (e) {
    marketPrice = 0;
  }
  return { marketPrice };
});

interface IAppData {
  readonly circSupply: number;
  readonly currentIndex?: string;
  readonly currentBlock?: number;
  readonly endBlock?:number;
  readonly fiveDayRate?: number;
  readonly marketCap: number;
  readonly circVal?:number;
  readonly marketPrice: number;
  readonly stakingAPY?: number;
  readonly stakingRebase?: number;
  readonly stakingTVL: number;
  readonly totalSupply: number;
  readonly treasuryMarketValue?: number;
  readonly Staked?: number;
}

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    fetchAppSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAppDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAppDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAppDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.error(error.name, error.message, error.stack);
      })
      .addCase(loadMarketPrice.pending, (state, action) => {
        state.loadingMarketPrice = true;
      })
      .addCase(loadMarketPrice.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loadingMarketPrice = false;
      })
      .addCase(loadMarketPrice.rejected, (state, { error }) => {
        state.loadingMarketPrice = false;
        console.error(error.name, error.message, error.stack);
      });
  },
});

const baseInfo = (state: RootState) => state.app;

export default appSlice.reducer;

export const { fetchAppSuccess } = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
