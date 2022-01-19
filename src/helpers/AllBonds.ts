import { StableBond, LPBond, NetworkID, CustomBond } from "src/lib/Bond";
import { addresses } from "src/constants";

import { ReactComponent as DaiImg } from "src/assets/tokens/DAI.svg";
//import { ReactComponent as OhmDaiImg } from "src/assets/tokens/OHM-DAI.svg";
import { ReactComponent as OhmDaiImg } from "src/assets/ohm/logo.svg";
import { ReactComponent as FraxImg } from "src/assets/tokens/FRAX.svg";
import { ReactComponent as OhmFraxImg } from "src/assets/tokens/OHM-FRAX.svg";
import { ReactComponent as OhmLusdImg } from "src/assets/tokens/OHM-LUSD.svg";
import { ReactComponent as wETHImg } from "src/assets/tokens/wETH.svg";
import { ReactComponent as LusdImg } from "src/assets/tokens/LUSD.svg";

import { abi as FraxOhmBondContract } from "src/abi/bonds/OhmFraxContract.json";
import { abi as BondOhmDaiContract } from "src/abi/bonds/OhmDaiContract.json";
import { abi as BondOhmLusdContract } from "src/abi/bonds/OhmLusdContract.json";
import { abi as DaiBondContract } from "src/abi/bonds/DaiContract.json";
import { abi as ReserveOhmLusdContract } from "src/abi/reserves/OhmLusd.json";
import { abi as ReserveOhmDaiContract } from "src/abi/reserves/OhmDai.json";
import { abi as ReserveOhmFraxContract } from "src/abi/reserves/OhmFrax.json";
import { abi as FraxBondContract } from "src/abi/bonds/FraxContract.json";
import { abi as LusdBondContract } from "src/abi/bonds/LusdContract.json";
import { abi as EthBondContract } from "src/abi/bonds/EthContract.json";
import ERC20 from "src/lib/ERC20";
import { StaticJsonRpcProvider } from "@ethersproject/providers";

// TODO(zx): Further modularize by splitting up reserveAssets into vendor token definitions
//   and include that in the definition of a bond

export const dai = new StableBond({
  name: "BUSD",
  displayName: "BUSD",
  bondToken: "BUSD",
  bondIconSvg: DaiImg,
  bondContractABI: DaiBondContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x8FcdB03855082798be12bEB435ec9aAAeFC77AF1",
      reserveAddress: addresses[NetworkID.Mainnet].DAI_ADDRESS,
    },
    [NetworkID.Testnet]: {
      bondAddress: "0x032982c2BE4b389d90d653a5AD0b8Eb45DA6CCF3",
      reserveAddress: "0x5edC7520b04Ec84FEeAcA55490d7b9e32116Df08",
    },
  },
});

//export const eth = new CustomBond({
//  name: "bnb",
//  displayName: "WBNB",
//  bondToken: "WBNB",
//  bondIconSvg: wETHImg,
//  bondContractABI: EthBondContract,
//  networkAddrs: {
//    [NetworkID.Mainnet]: {
//      bondAddress: "0x9A2E559bBe717497dD2cE9d83A463dcF7ea11790",
//      reserveAddress: addresses[NetworkID.Mainnet].BNB_ADDRESS,
//    },
//    [NetworkID.Testnet]: {
//      bondAddress: "0xca7b90f8158A4FAA606952c023596EE6d322bcf0",
//      reserveAddress: "0x1B408886aBBDfdBDC0CC5FFF2D0E982E593F4672",
//    },
//  },
//  customTreasuryBalanceFunc: async function (this: CustomBond, networkID, provider) {
//    const ethBondContract = this.getContractForBond(networkID, provider);
//    let ethPrice = await ethBondContract.assetPrice();
//    ethPrice = ethPrice / Math.pow(10, 8);
//    const token = this.getContractForReserve(networkID, provider);
//    let ethAmount = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);
//    ethAmount = ethAmount / Math.pow(10, 18);
//    return ethAmount * ethPrice;
//  },
//});

export const ohm_dai = new LPBond({
  name: "OX-BUSD",
  displayName: "OX-BUSD LP",
  bondToken: "OX-BUSD",
  bondIconSvg: OhmDaiImg,
  bondContractABI: BondOhmDaiContract,
  reserveContract: ReserveOhmDaiContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x8FcdB03855082798be12bEB435ec9aAAeFC77AF1",
      reserveAddress: "0x5556f86FA961960287991772cC71d5Db9093dB45",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0xcF449dA417cC36009a1C6FbA78918c31594B9377",
      reserveAddress: "0x1B408886aBBDfdBDC0CC5FFF2D0E982E593F4672",
    },
  },
  lpUrl:
   `https://pancakeswap.finance/add/${addresses[NetworkID.Mainnet].DAI_ADDRESS}/${addresses[NetworkID.Mainnet].PID_ADDRESS}`,
});
//export const ohm_eth = new LPBond({
// name: "OX-BNB",
//  displayName: "OX-BNB LP",
//  bondToken: "OX-BNB",
//  bondIconSvg: OhmDaiImg,
//  bondContractABI: BondOhmDaiContract,
//  reserveContract: ReserveOhmDaiContract,
//  networkAddrs: {
//    [NetworkID.Mainnet]: {
//      bondAddress: "0x7F1b0Dab5C7c8d7a63758946f853049bC53f4306",
//      reserveAddress: "0x96b6d5482313eECC031aFEb2Fb32da2BA7439BA2",
//    },
//    [NetworkID.Testnet]: {
//      bondAddress: "0xcF449dA417cC36009a1C6FbA78918c31594B9377",
//      reserveAddress: "0x1B408886aBBDfdBDC0CC5FFF2D0E982E593F4672",
//    },
//  },
//  lpUrl:
//   `https://pancakeswap.finance/add/${addresses[NetworkID.Mainnet].BNB_ADDRESS}/${addresses[NetworkID.Mainnet].PID_ADDRESS}`,
//});

//export const frax = new StableBond({
//  name: "frax",
//  displayName: "FRAX",
//  bondToken: "FRAX",
//  bondIconSvg: FraxImg,
//  bondContractABI: FraxBondContract,
//  networkAddrs: {
//    [NetworkID.Mainnet]: {
//      bondAddress: "0x8510c8c2B6891E04864fa196693D44E6B6ec2514",
//      reserveAddress: "0x853d955acef822db058eb8505911ed77f175b99e",
//    },
//    [NetworkID.Testnet]: {
//      bondAddress: "0xF651283543fB9D61A91f318b78385d187D300738",
//      reserveAddress: "0x1B408886aBBDfdBDC0CC5FFF2D0E982E593F4672",
//    },
//  },
//});

//export const lusd = new StableBond({
//  name: "USDT",
//  displayName: "USDT",
//  bondToken: "USDT",
//  bondIconSvg: LusdImg,
//  bondContractABI: DaiBondContract,
//  networkAddrs: {
//    [NetworkID.Mainnet]: {
//      bondAddress: "0x1972f90FeD66a94708970c9Fee89438A53ef763F",
//      reserveAddress: "0x55d398326f99059ff775485246999027b3197955",
//    },
//    [NetworkID.Testnet]: {
//      bondAddress: "0x0190f73D9ab041cDf0d48fabAD924F8a4A22B7cf",
//      reserveAddress: "0x1B408886aBBDfdBDC0CC5FFF2D0E982E593F4672",
//    },
//  },
//});

//export const pid_lusd = new LPBond({
//  name: "pid_lusd_lp",
//  displayName: "OHM-LUSD LP",
//  bondToken: "LUSD",
//  bondIconSvg: OhmLusdImg,
//  bondContractABI: BondOhmLusdContract,
//  reserveContract: ReserveOhmLusdContract,
//  networkAddrs: {
//    [NetworkID.Mainnet]: {
//      bondAddress: "0xFB1776299E7804DD8016303Df9c07a65c80F67b6",
//      reserveAddress: "0xfDf12D1F85b5082877A6E070524f50F6c84FAa6b",
//    },
//    [NetworkID.Testnet]: {
//      // NOTE (appleseed-lusd): using ohm-dai rinkeby contracts
//      bondAddress: "0xcF449dA417cC36009a1C6FbA78918c31594B9377",
//      reserveAddress: "0x8D5a22Fb6A1840da602E56D1a260E56770e0bCE2",
//    },
//  },
//  lpUrl:
//    "https://pancakeswap.finance/add/0x383518188C0C6d7730D91b2c03a03C837814a899/0x5f98805A4E8be255a32880FDeC7F6728C6568bA0",
//});

// HOW TO ADD A NEW BOND:
// Is it a stableCoin bond? use `new StableBond`
// Is it an LP Bond? use `new LPBond`
// Add new bonds to this array!!
// export const allBonds = [dai, frax, eth, ohm_dai, ohm_frax, lusd, pid_lusd];

export const allBonds = [dai,ohm_dai]
// export const allBonds:LPBond[]=[]
export const treasuryBalanceAll = async ( networkID: NetworkID, provider: StaticJsonRpcProvider) => {
  return (await Promise.all(allBonds.map(async (item) => {
    // console.error(await item.getTreasuryBalance(networkID,provider))
    // console.error(item.name)
    return await item.getTreasuryBalance(networkID,provider)
  }))).reduce((total,num)=>total + num)
}

export const allBondsMap = allBonds.reduce((prevVal, bond) => {
  return { ...prevVal, [bond.name]: bond };
}, {});

// Debug Log
// console.log({allBonds});
export default allBonds;
