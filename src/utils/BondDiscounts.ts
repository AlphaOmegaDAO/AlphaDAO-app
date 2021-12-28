import { Address, BigDecimal, BigInt, log } from "@graphprotocol/graph-ts";
import { OxBond } from "../../generated/OxVault/OxBond";
import { BondDiscount, Transaction } from "../../generated/schema";

import {
  BUSDBOND_CONTRACT,
  BUSDBOND_CONTRACT_BLOCK,
  OXUSDT_PCSBOND_CONTRACT,
  OXUSDT_PCSBOND_CONTRACT_BLOCK,
  OXBUSD_PCSBOND_CONTRACT,
  OXBUSD_PCSBOND_CONTRACT_BLOCK,
} from "./Constants";
import { hourFromTimestamp } from "./Dates";
import { toDecimal } from "./Decimals";
import { getOxUSDRate } from "./Price";

export function loadOrCreateBondDiscount(timestamp: BigInt): BondDiscount {
  let hourTimestamp = hourFromTimestamp(timestamp);

  let bondDiscount = BondDiscount.load(hourTimestamp);
  if (bondDiscount == null) {
    bondDiscount = new BondDiscount(hourTimestamp);
    bondDiscount.timestamp = timestamp;
    bondDiscount.usdt_discount = BigDecimal.fromString("0");
    bondDiscount.gyrousdt_discount = BigDecimal.fromString("0");
    bondDiscount.busd_discount = BigDecimal.fromString("0");
    bondDiscount.gyrobusd_discount = BigDecimal.fromString("0");
    bondDiscount.save();
  }
  return bondDiscount as BondDiscount;
}

export function updateBondDiscounts(transaction: Transaction): void {
  let bd = loadOrCreateBondDiscount(transaction.timestamp);
  let gyroRate = getOxUSDRate();

  //OX-USDT

  if (
    transaction.blockNumber.gt(
      BigInt.fromString(OXUSDT_PCSBOND_CONTRACT_BLOCK)
    )
  ) {
    let bond = OxBond.bind(Address.fromString(OXUSDT_PCSBOND_CONTRACT));
    let price_call = bond.try_bondPriceInUSD();
    if (
      price_call.reverted === false &&
      price_call.value.gt(BigInt.fromI32(0))
    ) {
      bd.gyrousdt_discount = gyroRate.div(toDecimal(price_call.value, 18));
      bd.gyrousdt_discount = bd.gyrousdt_discount.minus(
        BigDecimal.fromString("1")
      );
      bd.gyrousdt_discount = bd.gyrousdt_discount.times(
        BigDecimal.fromString("100")
      );
      log.debug(
        "OX-USDT Discount OX price {}  Bond Price {}  Discount {}",
        [
          gyroRate.toString(),
          price_call.value.toString(),
          bd.gyrobusd_discount.toString(),
        ]
      );
    }
  }

  //OX-BUSD

  if (
    transaction.blockNumber.gt(
      BigInt.fromString(OXBUSD_PCSBOND_CONTRACT_BLOCK)
    )
  ) {
    let bond = OxBond.bind(Address.fromString(OXBUSD_PCSBOND_CONTRACT));
    let price_call = bond.try_bondPriceInUSD();
    if (
      price_call.reverted === false &&
      price_call.value.gt(BigInt.fromI32(0))
    ) {
      bd.gyrobusd_discount = gyroRate.div(toDecimal(price_call.value, 18));
      bd.gyrobusd_discount = bd.gyrobusd_discount.minus(
        BigDecimal.fromString("1")
      );
      bd.gyrobusd_discount = bd.gyrobusd_discount.times(
        BigDecimal.fromString("100")
      );
      log.debug(
        "OX-BUSD Discount OX price {}  Bond Price {}  Discount {}",
        [
          gyroRate.toString(),
          price_call.value.toString(),
          bd.gyrobusd_discount.toString(),
        ]
      );
    }
  }

  //BUSD
  if (transaction.blockNumber.gt(BigInt.fromString(BUSDBOND_CONTRACT_BLOCK))) {
    let bond = OxBond.bind(Address.fromString(BUSDBOND_CONTRACT));
    let price_call = bond.try_bondPriceInUSD();
    if (
      price_call.reverted === false &&
      price_call.value.gt(BigInt.fromI32(0))
    ) {
      bd.busd_discount = gyroRate.div(toDecimal(price_call.value, 18));
      bd.busd_discount = bd.busd_discount.minus(BigDecimal.fromString("1"));
      bd.busd_discount = bd.busd_discount.times(BigDecimal.fromString("100"));
      log.debug("BUSD Discount OX price {}  Bond Price {}  Discount {}", [
        gyroRate.toString(),
        price_call.value.toString(),
        bd.gyrobusd_discount.toString(),
      ]);
    }
  }

  bd.save();
}
