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
      bondAddress: "0x48c7A72198eA09e64CAEf65D808d762721C0bABA",
      reserveAddress: addresses[NetworkID.Mainnet].BUSD_ADDRESS,
    },
    [NetworkID.Testnet]: {
      bondAddress: "0x63a3f3DC740c9255b9d994661e692529AC77cA86",
      reserveAddress: "0xE5f34eD0833529972883f91f18fBa4c22A1990a7",
    },
  },
});

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
      bondAddress: "0x63a3f3DC740c9255b9d994661e692529AC77cA86",
      reserveAddress: "0xdf7899f13eaf2404ef8838235b98c417e0a38b72",
    },
  },
  lpUrl:
   `https://pancakeswap.finance/add/${addresses[NetworkID.Mainnet].DAI_ADDRESS}/${addresses[NetworkID.Mainnet].PID_ADDRESS}`,
});

export const lusd = new StableBond({
  name: "USDT",
  displayName: "USDT",
  bondToken: "USDT",
  bondIconSvg: LusdImg,
  bondContractABI: DaiBondContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x428F8d3118df077954BA6419c4d8afbE3a5031Ad",
      reserveAddress: addresses[NetworkID.Mainnet].USDT_ADDRESS,
    },
    [NetworkID.Testnet]: {
      bondAddress: "0xD229B7891c8630Fa321E50810161039eE81102EA",
      reserveAddress: "0x428F8d3118df077954BA6419c4d8afbE3a5031Ad",
    },
  },
});

// HOW TO ADD A NEW BOND:
// Is it a stableCoin bond? use `new StableBond`
// Is it an LP Bond? use `new LPBond`
// Add new bonds to this array!!
// export const allBonds = [dai, frax, eth, ohm_dai, ohm_frax, lusd, pid_lusd];

export const allBonds = [dai,ohm_dai,lusd]
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
