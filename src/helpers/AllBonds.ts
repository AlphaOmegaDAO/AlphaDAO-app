import { StableBond, LPBond, NetworkID, CustomBond, BondType } from "src/lib/Bond";
import { addresses } from "src/constants";

import { ReactComponent as DaiImg } from "src/assets/tokens/DAI.svg";
import { ReactComponent as AlphaDaiImg } from "src/assets/tokens/OX-DAI.svg";
import { ReactComponent as FraxImg } from "src/assets/tokens/FRAX.svg";
import { ReactComponent as AlphaFraxImg } from "src/assets/tokens/OX-FRAX.svg";
import { ReactComponent as AlphaLusdImg } from "src/assets/tokens/OX-LUSD.svg";
import { ReactComponent as AlphaEthImg } from "src/assets/tokens/OX-WETH.svg";
import { ReactComponent as wETHImg } from "src/assets/tokens/wETH.svg";
import { ReactComponent as LusdImg } from "src/assets/tokens/LUSD.svg";

import { abi as FraxOxBondContract } from "src/abi/bonds/OxFraxContract.json";
import { abi as BondOxDaiContract } from "src/abi/bonds/OxDaiContract.json";
import { abi as BondOxLusdContract } from "src/abi/bonds/OxLusdContract.json";
import { abi as BondOxEthContract } from "src/abi/bonds/OxEthContract.json";

import { abi as DaiBondContract } from "src/abi/bonds/DaiContract.json";
import { abi as ReserveOxLusdContract } from "src/abi/reserves/OxLusd.json";
import { abi as ReserveOxDaiContract } from "src/abi/reserves/OxDai.json";
import { abi as ReserveOxFraxContract } from "src/abi/reserves/OxFrax.json";
import { abi as ReserveOxEthContract } from "src/abi/reserves/OxEth.json";

import { abi as FraxBondContract } from "src/abi/bonds/FraxContract.json";
import { abi as LusdBondContract } from "src/abi/bonds/LusdContract.json";
import { abi as EthBondContract } from "src/abi/bonds/EthContract.json";

import { abi as ierc20Abi } from "src/abi/IERC20.json";
import { getBondCalculator } from "src/helpers/BondCalculator";
import { BigNumberish } from "ethers";

// TODO(zx): Further modularize by splitting up reserveAssets into vendor token definitions
//   and include that in the definition of a bond
export const busd = new StableBond({
  name: "busd",
  displayName: "DAI",
  bondToken: "DAI",
  isAvailable: {[NetworkID.BSCTestnet]: true, [NetworkID.Mumbai]: true, [NetworkID.Polygon]: true },
  bondIconSvg: DaiImg,
  bondContractABI: DaiBondContract,
  networkAddrs: {
    [NetworkID.Mumbai]: {
      bondAddress: "0x3c2b484057e7ba8832c2abc7774b30fba691c789",
      reserveAddress: "0x8301f2213c0eed49a7e28ae4c3e91722919b8b47",
    },
    [NetworkID.Polygon]: {
      bondAddress: "0xFDAACD04f8ad605e928F4A44864FF825dCd4796d",
      reserveAddress: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    },
    [NetworkID.BSCTestnet]: {
      bondAddress: "0x9c0E2603FEF3Acc82Ad291CF8F07ef17f4E12939",
      reserveAddress: "0x8301f2213c0eed49a7e28ae4c3e91722919b8b47",
    },
  },
});


export const alpha_dai = new LPBond({
  name: "alpha_dai_lp",
  displayName: "OX-DAI LP",
  bondToken: "DAI",
  isAvailable: {[NetworkID.BSCTestnet]: true, [NetworkID.Mumbai]: true, [NetworkID.Polygon]: true },
  bondIconSvg: AlphaDaiImg,
  bondContractABI: BondOxDaiContract,
  reserveContract: ReserveOxDaiContract,
  networkAddrs: {
    [NetworkID.Mumbai]: {
      bondAddress: "0x695e445610c2dad7fb166acae7636a3b29936364",
      reserveAddress: "0xf86868748f973322e38152f75275777a34d8e3fd",
    },
    [NetworkID.Polygon]: {
      bondAddress: "0xbbA07bd5B20B63249398b831082ace6415afB7E0",
      reserveAddress: "0x7c9B16d845FE163F464d265193cC2B4eE3faC326",
    },
    [NetworkID.BSCTestnet]: {
      bondAddress: "0x9c0E2603FEF3Acc82Ad291CF8F07ef17f4E12939",
      reserveAddress: "0x8301f2213c0eed49a7e28ae4c3e91722919b8b47",
    },
  },
  lpUrl:
    "",
});

// HOW TO ADD A NEW BOND:
// Is it a stableCoin bond? use `new StableBond`
// Is it an LP Bond? use `new LPBond`
// Add new bonds to this array!!

export const allBonds = [busd, alpha_dai];
export const allBondsMap = allBonds.reduce((prevVal, bond) => {
  return { ...prevVal, [bond.name]: bond };
}, {});

// Debug Log
// console.log(allBondsMap);
export default allBonds;
