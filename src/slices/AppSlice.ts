import { ethers } from "ethers";
import { addresses } from "../constants";
import { abi as OlympusStakingv2ABI } from "../abi/OlympusStakingv2.json";
import { abi as sOXv2 } from "../abi/sOxv2.json";
import { abi as AlphaABI } from "../abi/Alpha.json";
import { setAll, getTokenPrice, getMarketPrice } from "../helpers";
import allBonds from "../helpers/AllBonds";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { IBaseAsyncThunk } from "./interfaces";
import { OlympusStakingv2, SOxv2 } from "../typechain";

const initialState = {
  loading: false,
  loadingMarketPrice: false,
};

export const loadAppDetails = createAsyncThunk(
  "app/loadAppDetails",
  async ({ networkID, provider }: IBaseAsyncThunk, { dispatch }) => {
    // NOTE (appleseed): marketPrice from Graph was delayed, so get CoinGecko price
    // const marketPrice = parseFloat(graphData.data.protocolMetrics[0].ohmPrice);
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

    const currentBlock = await provider.getBlockNumber();

    const stakingContract = new ethers.Contract(
      addresses[networkID].STAKING_ADDRESS as string,
      OlympusStakingv2ABI,
      provider,
    ) as OlympusStakingv2;

    const soxMainContract = new ethers.Contract(
      addresses[networkID].SOX_ADDRESS as string,
      sOXv2,
      provider,
    ) as SOxv2;

    const alphaMainContract = new ethers.Contract(addresses[networkID].OX_ADDRESS as string, AlphaABI, provider);

    // Calculating staking
    const epoch = await stakingContract.epoch();
    console.log(`epoch`, epoch);
    const stakingReward = epoch.distribute;
    const ts = await soxMainContract.totalSupply();
    console.log(`ts`, ts);
    const totalSupply = (await alphaMainContract.totalSupply()) / Math.pow(10, 9);
    const marketCap = totalSupply * marketPrice;
    const circ = await soxMainContract.circulatingSupply();
    const circAny = circ as any;
    const circSupply = circAny / Math.pow(10, 9);
    const stakingTVL = circSupply * marketPrice;
    console.log(`circ`, circ);
    const stakingRebase = Number(stakingReward.toString()) / Number(circ.toString());
    console.log("stakingRebase", stakingRebase);
    const fiveDayRate = Math.pow(1 + stakingRebase, 5 * 3) - 1;
    const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3) - 1;
    console.log(`stakingAPY ${stakingAPY}`);

    const tokenAmountsPromises = allBonds.map(bond => bond.getTreasuryBalance(networkID, provider));
    const tokenAmounts = await Promise.all(tokenAmountsPromises);
    console.log("tokenAmounts", tokenAmounts);
    const treasuryMarketValue = tokenAmounts.reduce((curr, prev) => {
      return curr + prev;
    }, 0);

    // Current index
    const currentIndex = await stakingContract.index();
console.log(currentIndex, stakingAPY, "**** Line79test *****" )
    return {
      currentIndex: ethers.utils.formatUnits(currentIndex, "gwei"),
      currentBlock,
      fiveDayRate,
      stakingAPY,
      stakingTVL,
      stakingRebase,
      marketCap,
      marketPrice,
      circSupply,
      totalSupply,
      treasuryMarketValue,
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
 * - falls back to fetch marketPrice from ox-busd contract
 * - updates the App.slice when it runs
 */
const loadMarketPrice = createAsyncThunk("app/loadMarketPrice", async ({ networkID, provider }: IBaseAsyncThunk) => {
  let marketPrice: number;
  try {
  
    console.log("******144*****");
    marketPrice = await getMarketPrice({ networkID, provider });
    console.log("******146*****");
    marketPrice = marketPrice / Math.pow(10, 9);
    console.log(marketPrice , "******148*****");
  } catch (e) {
    console.log(`e`);
    console.log("******151*****");
    console.log(e);
    marketPrice = await getTokenPrice("alpha");
    console.log(marketPrice,"******154*****");
  }
  return { marketPrice };
});

interface IAppData {
  readonly circSupply: number;
  readonly currentIndex?: string;
  readonly currentBlock?: number;
  readonly fiveDayRate?: number;
  readonly marketCap: number;
  readonly marketPrice: number;
  readonly stakingAPY?: number;
  readonly stakingRebase?: number;
  readonly stakingTVL: number;
  readonly totalSupply: number;
  readonly treasuryBalance?: number;
  readonly treasuryMarketValue?: number;
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
