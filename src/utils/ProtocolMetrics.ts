import { Address, BigDecimal, BigInt, log } from "@graphprotocol/graph-ts";
import { ERC20 } from "../../generated/OxVault/ERC20";
import { UniswapV2Pair } from "../../generated/OxVault/UniswapV2Pair";
import { OxERC20 } from "../../generated/OxVault/OxERC20";
import { sOxERC20 } from "../../generated/OxVault/sOxERC20";
import { OxVault } from "../../generated/OxVault/OxVault";
import { ProtocolMetric, Transaction } from "../../generated/schema";

import {
  ERC20USDT_CONTRACT,
  ERC20BUSD_CONTRACT,
  PCS_OXUSDT_PAIR,
  PCS_OXBUSD_PAIR,
  PCS_OXBUSD_PAIR_BLOCK,
  OX_ERC20_CONTRACT,
  SOX_ERC20_CONTRACT,
  OX_VAULT_CONTRACT,
  TREASURY_ADDRESS,
} from "./Constants";
import { dayFromTimestamp } from "./Dates";
import { toDecimal } from "./Decimals";
import { getOxUSDRate, getDiscountedPairUSD, getPairUSD } from "./Price";
import { getHolderAux } from "./Aux";
import { updateBondDiscounts } from "./BondDiscounts";

function getMV_RFV(transaction: Transaction): BigDecimal[] {
  let usdtERC20 = ERC20.bind(Address.fromString(ERC20USDT_CONTRACT));
  let busdERC20 = ERC20.bind(Address.fromString(ERC20BUSD_CONTRACT));

  let oxUsdtPair = UniswapV2Pair.bind(Address.fromString(PCS_OXUSDT_PAIR));
  let oxBusdPair = UniswapV2Pair.bind(Address.fromString(PCS_OXBUSD_PAIR));

  let treasury_address = TREASURY_ADDRESS;

  let usdtBalance = usdtERC20.balanceOf(Address.fromString(treasury_address));
  let busdBalance = busdERC20.balanceOf(Address.fromString(treasury_address));

  //OX_USDT
  let oxUsdtBalance = oxUsdtPair.balanceOf(
    Address.fromString(treasury_address)
  );

  let oxUsdtTotalLP = toDecimal(oxUsdtPair.totalSupply(), 18);
  let oxUsdtPOL = toDecimal(oxUsdtBalance, 18)
    .div(oxUsdtTotalLP)
    .times(BigDecimal.fromString("100"));
  let oxUsdt_value = getPairUSD(oxUsdtBalance, PCS_OXUSDT_PAIR);
  let oxUsdt_rfv = getDiscountedPairUSD(oxUsdtBalance, PCS_OXUSDT_PAIR);

  //OX_BUSD
  let oxBusdBalance = BigInt.fromI32(0);
  let oxBusd_value = BigDecimal.fromString("0");
  let oxBusd_rfv = BigDecimal.fromString("0");
  let oxBusdTotalLP = BigDecimal.fromString("0");
  let oxBusdPOL = BigDecimal.fromString("0");
  if (transaction.blockNumber.gt(BigInt.fromString(PCS_OXBUSD_PAIR_BLOCK))) {
    oxBusdBalance = oxBusdPair.balanceOf(
      Address.fromString(treasury_address)
    );
    oxBusd_value = getPairUSD(oxBusdBalance, PCS_OXBUSD_PAIR);
    oxBusd_rfv = getDiscountedPairUSD(oxBusdBalance, PCS_OXBUSD_PAIR);
    oxBusdTotalLP = toDecimal(oxBusdPair.totalSupply(), 18);
    if (
      oxBusdTotalLP.gt(BigDecimal.fromString("0")) &&
      oxBusdBalance.gt(BigInt.fromI32(0))
    ) {
      oxBusdPOL = toDecimal(oxBusdBalance, 18)
        .div(oxBusdTotalLP)
        .times(BigDecimal.fromString("100"));
    }
  }

  let stableValue = usdtBalance.plus(busdBalance);
  let stableValueDecimal = toDecimal(stableValue, 18);

  let lpValue = oxUsdt_value.plus(oxBusd_value);
  let rfvLpValue = oxUsdt_rfv.plus(oxBusd_rfv);

  let mv = stableValueDecimal.plus(lpValue);
  let rfv = stableValueDecimal.plus(rfvLpValue);

  log.debug("Treasury Market Value {}", [mv.toString()]);
  log.debug("Treasury RFV {}", [rfv.toString()]);
  log.debug("Treasury USDT value {}", [toDecimal(usdtBalance, 18).toString()]);
  log.debug("Treasury OX-USDT RFV {}", [oxUsdt_rfv.toString()]);
  log.debug("Treasury BUSDT value {}", [toDecimal(busdBalance, 18).toString()]);
  log.debug("Treasury OX-BUSD RFV {}", [oxBusd_rfv.toString()]);

  return [
    mv,
    rfv,
    // treasuryUsdtRiskFreeValue = USDT RFV * USDT
    oxUsdt_rfv.plus(toDecimal(usdtBalance, 18)),
    // treasuryBusdRiskFreeValue = BUSD RFV * BUSD
    oxBusd_rfv.plus(toDecimal(busdBalance, 18)),
    // treasuryUsdtMarketValue = USDT LP * USDT
    oxUsdt_value.plus(toDecimal(usdtBalance, 18)),
    // treasuryBusdMarketValue = BUSD LP * BUSD
    oxBusd_value.plus(toDecimal(busdBalance, 18)),
    // POL
    oxUsdtPOL,
    oxBusdPOL,
  ];
}

export function loadOrCreateProtocolMetric(timestamp: BigInt): ProtocolMetric {
  let dayTimestamp = dayFromTimestamp(timestamp);

  let protocolMetric = ProtocolMetric.load(dayTimestamp);
  if (protocolMetric == null) {
    protocolMetric = new ProtocolMetric(dayTimestamp);
    protocolMetric.timestamp = timestamp;
    protocolMetric.oxCirculatingSupply = BigDecimal.fromString("0");
    protocolMetric.sOxCirculatingSupply = BigDecimal.fromString("0");
    protocolMetric.totalSupply = BigDecimal.fromString("0");
    protocolMetric.oxPrice = BigDecimal.fromString("0");
    protocolMetric.marketCap = BigDecimal.fromString("0");
    protocolMetric.totalValueLocked = BigDecimal.fromString("0");
    protocolMetric.treasuryRiskFreeValue = BigDecimal.fromString("0");
    protocolMetric.treasuryMarketValue = BigDecimal.fromString("0");
    protocolMetric.nextEpochRebase = BigDecimal.fromString("0");
    protocolMetric.nextRebaseRewards = BigDecimal.fromString("0");
    protocolMetric.currentAPY = BigDecimal.fromString("0");
    protocolMetric.treasuryUsdtRiskFreeValue = BigDecimal.fromString("0");
    protocolMetric.treasuryBusdRiskFreeValue = BigDecimal.fromString("0");
    protocolMetric.treasuryUsdtMarketValue = BigDecimal.fromString("0");
    protocolMetric.treasuryBusdMarketValue = BigDecimal.fromString("0");
    protocolMetric.treasuryOxUsdtPOL = BigDecimal.fromString("0");
    protocolMetric.treasuryOxBusdPOL = BigDecimal.fromString("0");
    protocolMetric.holders = BigInt.fromI32(0);

    protocolMetric.save();
  }
  return protocolMetric as ProtocolMetric;
}

function getTotalSupply(): BigDecimal {
  let ox_contract = OxERC20.bind(Address.fromString(OX_ERC20_CONTRACT));
  let total_supply = toDecimal(ox_contract.totalSupply(), 9);
  log.debug("Total Supply {}", [total_supply.toString()]);
  return total_supply;
}

function getCriculatingSupply(): BigDecimal {
  let ox_contract = OxERC20.bind(Address.fromString(OX_ERC20_CONTRACT));
  let circ_supply = toDecimal(ox_contract.circulatingSupply(), 9);
  log.debug("Circulating Supply {}", [circ_supply.toString()]);
  return circ_supply;
}

function getSOxSupply(): BigDecimal {
  let sOx_supply = BigDecimal.fromString("0");

  let sOx_contract = sOxERC20.bind(
    Address.fromString(SOX_ERC20_CONTRACT)
  );
  sOx_supply = toDecimal(sOx_contract.circulatingSupply(), 9);

  log.debug("sOx Supply {}", [sOx_supply.toString()]);
  return sOx_supply;
}

function getNextRebase(): BigDecimal {
  let next_rebase = BigDecimal.fromString("0");

  let ox_vault = OxVault.bind(Address.fromString(OX_VAULT_CONTRACT));

  next_rebase = toDecimal(ox_vault.epoch().value3, 9);
  log.debug("next_rebase {}", [next_rebase.toString()]);

  return next_rebase;
}

function getAPY_Rebase(
  sOx: BigDecimal,
  rebaseRewards: BigDecimal
): BigDecimal[] {
  let nextEpochRebase = rebaseRewards
    .div(sOx)
    .times(BigDecimal.fromString("100"));

  let nextEpochRebase_number = Number.parseFloat(nextEpochRebase.toString());
  let currentAPY =
    Math.pow(nextEpochRebase_number / 100 + 1, 365 * 3 - 1) * 100;

  let currentAPYdecimal = BigDecimal.fromString(currentAPY.toString());

  log.debug("next_rebase {}", [nextEpochRebase.toString()]);
  log.debug("current_apy total {}", [currentAPYdecimal.toString()]);

  return [currentAPYdecimal, nextEpochRebase];
}

function getRunway(
  sOx: BigDecimal,
  rfv: BigDecimal,
  rebase: BigDecimal
): BigDecimal[] {
  let runway2dot5k = BigDecimal.fromString("0");
  let runway5k = BigDecimal.fromString("0");
  let runway7dot5k = BigDecimal.fromString("0");
  let runway10k = BigDecimal.fromString("0");
  let runway20k = BigDecimal.fromString("0");
  let runway50k = BigDecimal.fromString("0");
  let runway70k = BigDecimal.fromString("0");
  let runway100k = BigDecimal.fromString("0");
  let runwayCurrent = BigDecimal.fromString("0");

  if (
    sOx.gt(BigDecimal.fromString("0")) &&
    rfv.gt(BigDecimal.fromString("0")) &&
    rebase.gt(BigDecimal.fromString("0"))
  ) {
    let treasury_runway = Number.parseFloat(rfv.div(sOx).toString());

    let runway2dot5k_num =
      Math.log(treasury_runway) / Math.log(1 + 0.0029438) / 3;
    let runway5k_num = Math.log(treasury_runway) / Math.log(1 + 0.003579) / 3;
    let runway7dot5k_num =
      Math.log(treasury_runway) / Math.log(1 + 0.0039507) / 3;
    let runway10k_num =
      Math.log(treasury_runway) / Math.log(1 + 0.00421449) / 3;
    let runway20k_num =
      Math.log(treasury_runway) / Math.log(1 + 0.00485037) / 3;
    let runway50k_num =
      Math.log(treasury_runway) / Math.log(1 + 0.00569158) / 3;
    let runway70k_num =
      Math.log(treasury_runway) / Math.log(1 + 0.00600065) / 3;
    let runway100k_num =
      Math.log(treasury_runway) / Math.log(1 + 0.00632839) / 3;
    let nextEpochRebase_number = Number.parseFloat(rebase.toString()) / 100;
    let runwayCurrent_num =
      Math.log(treasury_runway) / Math.log(1 + nextEpochRebase_number) / 3;

    runway2dot5k = BigDecimal.fromString(runway2dot5k_num.toString());
    runway5k = BigDecimal.fromString(runway5k_num.toString());
    runway7dot5k = BigDecimal.fromString(runway7dot5k_num.toString());
    runway10k = BigDecimal.fromString(runway10k_num.toString());
    runway20k = BigDecimal.fromString(runway20k_num.toString());
    runway50k = BigDecimal.fromString(runway50k_num.toString());
    runway70k = BigDecimal.fromString(runway70k_num.toString());
    runway100k = BigDecimal.fromString(runway100k_num.toString());
    runwayCurrent = BigDecimal.fromString(runwayCurrent_num.toString());
  }

  return [
    runway2dot5k,
    runway5k,
    runway7dot5k,
    runway10k,
    runway20k,
    runway50k,
    runway70k,
    runway100k,
    runwayCurrent,
  ];
}

export function updateProtocolMetrics(transaction: Transaction): void {
  let pm = loadOrCreateProtocolMetric(transaction.timestamp);

  //Total Supply
  pm.totalSupply = getTotalSupply();

  //Circ Supply
  pm.oxCirculatingSupply = getCriculatingSupply();

  //sOx Supply
  pm.sOxCirculatingSupply = getSOxSupply();

  //Ox Price
  pm.oxPrice = getOxUSDRate();

  //Ox Market Cap
  pm.marketCap = pm.oxCirculatingSupply.times(pm.oxPrice);

  //Total Value Locked
  pm.totalValueLocked = pm.sOxCirculatingSupply.times(pm.oxPrice);

  //Treasury RFV and MV
  let mv_rfv = getMV_RFV(transaction);
  pm.treasuryMarketValue = mv_rfv[0];
  pm.treasuryRiskFreeValue = mv_rfv[1];
  pm.treasuryUsdtRiskFreeValue = mv_rfv[2];
  pm.treasuryBusdRiskFreeValue = mv_rfv[3];
  pm.treasuryUsdtMarketValue = mv_rfv[4];
  pm.treasuryBusdMarketValue = mv_rfv[5];
  pm.treasuryOxUsdtPOL = mv_rfv[6];
  pm.treasuryOxBusdPOL = mv_rfv[7];

  // Rebase rewards, APY, rebase
  pm.nextRebaseRewards = getNextRebase();
  let apy_rebase = getAPY_Rebase(
    pm.sOxCirculatingSupply,
    pm.nextRebaseRewards
  );
  pm.currentAPY = apy_rebase[0];
  pm.nextEpochRebase = apy_rebase[1];

  //Runway
  let runways = getRunway(
    pm.sOxCirculatingSupply,
    pm.treasuryRiskFreeValue,
    pm.nextEpochRebase
  );
  pm.runway2dot5k = runways[0];
  pm.runway5k = runways[1];
  pm.runway7dot5k = runways[2];
  pm.runway10k = runways[3];
  pm.runway20k = runways[4];
  pm.runway50k = runways[5];
  pm.runway70k = runways[6];
  pm.runway100k = runways[7];
  pm.runwayCurrent = runways[8];

  //Holders
  pm.holders = getHolderAux().value;

  pm.save();

  updateBondDiscounts(transaction);
}
