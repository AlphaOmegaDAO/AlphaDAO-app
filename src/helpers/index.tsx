import { EPOCH_INTERVAL, BLOCK_RATE_SECONDS, addresses } from "../constants";
import { BigNumber, ethers } from "ethers";
import axios from "axios";
import { abi as PairContract } from "../abi/PairContract.json";
import { abi as RedeemHelperAbi } from "../abi/RedeemHelper.json";

import { SvgIcon } from "@material-ui/core";
import { ReactComponent as OhmImg } from "../assets/tokens/token_OHM.svg";
import { ReactComponent as SOhmImg } from "../assets/tokens/token_sOHM.svg";
import LogoImg from '../assets/ohm/logo.png'

import { ohm_dai } from "./AllBonds";
import { JsonRpcSigner, StaticJsonRpcProvider } from "@ethersproject/providers";
import { IBaseAsyncThunk } from "src/slices/interfaces";

// NOTE (appleseed): this looks like an outdated method... we now have this data in the graph (used elsewhere in the app)
export async function getMarketPrice({ networkID, provider }: IBaseAsyncThunk) {
  const ohm_dai_address = ohm_dai.getAddressForReserve(networkID);
  const pairContract = new ethers.Contract(ohm_dai_address, PairContract, provider);
  const reserves = await pairContract.getReserves();

  
  console.error(reserves[0].toString())
  const reserves0 = getDisplayBalance(reserves[1],18)
  const reserves1 = getDisplayBalance(reserves[0],9,2)

  const marketPrice = (Number(reserves0))/Number(reserves1);

  // console.error('测试参数')
  // console.error(marketPrice)
  // commit('set', { marketPrice: marketPrice / Math.pow(10, 9) });
  return marketPrice;
}

export async function getTokenPrice(tokenId = "olympus") {
  const resp = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`);
  let tokenPrice: number = resp.data[tokenId].usd;
  return tokenPrice;
}

export function shorten(str: string) {
  if (str.length < 10) return str;
  return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
}

export function formatCurrency(c: number, precision = 0) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: precision,
    minimumFractionDigits: precision,
  }).format(c);
}

export function trim(number = 0, precision = 0) {
  // why would number ever be undefined??? what are we trimming?
  const array = number.toString().split(".");
  if (array.length === 1) return number.toString();
  if (precision === 0) return array[0].toString();

  const poppedNumber = array.pop() || "0";
  array.push(poppedNumber.substring(0, precision));
  const trimmedNumber = array.join(".");
  return trimmedNumber;
}

export function getRebaseBlock(currentBlock: number) {
  return currentBlock + EPOCH_INTERVAL - (currentBlock % EPOCH_INTERVAL);
}

export function secondsUntilBlock(startBlock: number, endBlock: number) {
  const blocksAway = endBlock - startBlock;
  console.error({
    endBlock,
    startBlock
  })
  const secondsAway = blocksAway * BLOCK_RATE_SECONDS;

  return secondsAway;
}

export function prettyVestingPeriod(currentBlock: number, vestingBlock: number) {
  if (vestingBlock === 0) {
    return "";
  }

  const seconds = secondsUntilBlock(currentBlock, vestingBlock);
  if (seconds < 0) {
    return "Fully Vested";
  }
  return prettifySeconds(seconds);
}

export function prettifySeconds(seconds: number, resolution?: string) {
  if (seconds !== 0 && !seconds) {
    return "";
  }

  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  if (resolution === "day") {
    return d + (d == 1 ? " day" : " days");
  }

  const dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
  const hDisplay = h > 0 ? h + (h == 1 ? " hr, " : " hrs, ") : "";
  const mDisplay = m > 0 ? m + (m == 1 ? " min" : " mins") : "";

  let result = dDisplay + hDisplay + mDisplay;
  if (mDisplay === "") {
    result = result.slice(0, result.length - 2);
  }

  return result;
}

function getSohmTokenImage() {
  return <img src={LogoImg} style={{ height: "1rem", width: "1rem",borderRadius:"50%"}}/>
  // <SvgIcon component={SOhmImg} viewBox="0 0 100 100" style={{ height: "1rem", width: "1rem" }} />;
}

export function getOhmTokenImage(w?: number, h?: number) {
  const height = h == null ? "32px" : `${h}px`;
  const width = w == null ? "32px" : `${w}px`;
  return <img src={LogoImg} style={{ height, width }} />
  
  // <SvgIcon component={OhmImg} viewBox="0 0 32 32" style={{ height, width }} />;
}

export function getTokenImage(name: string) {
  if (name === "ohm") return getOhmTokenImage();
  if (name === "sohm") return getSohmTokenImage();
}

// TS-REFACTOR-NOTE - Used for:
// AccountSlice.ts, AppSlice.ts, LusdSlice.ts
export function setAll(state: any, properties: any) {
  const props = Object.keys(properties);
  props.forEach(key => {
    state[key] = properties[key];
  });
}

export function contractForRedeemHelper({
  networkID,
  provider,
}: {
  networkID: number;
  provider: StaticJsonRpcProvider | JsonRpcSigner;
}) {
  return new ethers.Contract(addresses[networkID].REDEEM_HELPER_ADDRESS as string, RedeemHelperAbi, provider);
}

/**
 * returns unix timestamp for x minutes ago
 * @param x minutes as a number
 */
export const minutesAgo = (x: number) => {
  const now = new Date().getTime();
  return new Date(now - x * 60000).getTime();
};

/**
 * subtracts two dates for use in 33-together timer
 * param (Date) dateA is the ending date object
 * param (Date) dateB is the current date object
 * returns days, hours, minutes, seconds
 * NOTE: this func previously used parseInt() to convert to whole numbers, however, typescript doesn't like
 * ... using parseInt on number params. It only allows parseInt on string params. So we converted usage to
 * ... Math.trunc which accomplishes the same result as parseInt.
 */
//export const subtractDates = (dateA: Date, dateB: Date) => {
//  let msA: number = dateA.getTime();
// let msB: number = dateB.getTime();

//  let diff: number = msA - msB;

//  let days: number = 0;
//  if (diff >= 86400000) {
//    days = Math.trunc(diff / 86400000);
//    diff -= days * 86400000;
//  }

//  let hours: number = 0;
//  if (days || diff >= 3600000) {
//    hours = Math.trunc(diff / 3600000);
//    diff -= hours * 3600000;
//  }

//  let minutes: number = 0;
//  if (hours || diff >= 60000) {
//    minutes = Math.trunc(diff / 60000);
//    diff -= minutes * 60000;
//  }

//  let seconds: number = 0;
//  if (minutes || diff >= 1000) {
//    seconds = Math.trunc(diff / 1000);
//  }
//  return {
//    days,
//    hours,
//    minutes,
//    seconds,
//  };
//};


export const getDisplayBalance = (balance: BigNumber, decimals = 18, fractionDigits = 4) => {
  try{
    if(balance){
      // fractionDigits = decimals<=10 ?  2 : fractionDigits 
      const number = getBalance(balance, decimals - fractionDigits)
      return String(parseFloat((number / 10 ** fractionDigits).toFixed(fractionDigits)))
    }
  }catch(e){
    // console.error(e,'----------------balance-------------',balance)
  }
}

export const getFullDisplayBalance = (balance: BigNumber, decimals = 18) => {
  return getDisplayBalance(balance, decimals)
};

export function getBalance(balance: BigNumber, decimals = 18) : number {
  return balance.div(BigNumber.from(10).pow(decimals)).toNumber()
}