import { Address, BigDecimal, BigInt, log } from "@graphprotocol/graph-ts";
import { User, Transaction } from "../../generated/schema";
import { OxERC20 } from "../../generated/OxVault/OxERC20";
import { xOxERC20 } from "../../generated/OxVault/xOxERC20";
import { OxBond } from "../../generated/OxVault/OxBond";

import {
  BUSDBOND_CONTRACT,
  BUSDBOND_CONTRACT_BLOCK,
  OXUSDT_PCSBOND_CONTRACT,
  OXUSDT_PCSBOND_CONTRACT_BLOCK,
  OXBUSD_PCSBOND_CONTRACT,
  OXBUSD_PCSBOND_CONTRACT_BLOCK,
  OX_ERC20_CONTRACT,
  SOX_ERC20_CONTRACT,
} from "./Constants";
import { loadOrCreateUserBalance } from "./UserBalance";
import { toDecimal } from "./Decimals";
import { getOxUSDRate } from "./Price";
import { loadOrCreateContractInfo } from "./ContractInfo";
import { getHolderAux } from "./Aux";

export function loadOrCreateUser(addres: Address): User {
  let user = User.load(addres.toHex());
  if (user == null) {
    let holders = getHolderAux();
    holders.value = holders.value.plus(BigInt.fromI32(1));
    holders.save();

    user = new User(addres.toHex());
    user.active = true;
    user.save();
  }
  return user as User;
}

export function updateUserBalance(user: User, transaction: Transaction): void {
  let balance = loadOrCreateUserBalance(user, transaction.timestamp);

  let ox_contract = OxERC20.bind(Address.fromString(OX_ERC20_CONTRACT));
  let sox_contract = xOxERC20.bind(
    Address.fromString(SOX_ERC20_CONTRACT)
  );
  balance.oxBalance = toDecimal(
    ox_contract.balanceOf(Address.fromString(user.id)),
    9
  );
  let soxBalance = toDecimal(
    sox_contract.balanceOf(Address.fromString(user.id)),
    9
  );
  balance.oxBalance = soxBalance;

  let stakes = balance.stakes;

  let cinfoSoxBalance = loadOrCreateContractInfo(
    user.id + transaction.timestamp.toString() + "xOxERC20"
  );
  cinfoSoxBalance.name = "sOX";
  cinfoSoxBalance.contract = SOX_ERC20_CONTRACT;
  cinfoSoxBalance.amount = soxBalance;
  cinfoSoxBalance.save();
  stakes.push(cinfoSoxBalance.id);

  balance.stakes = stakes;

  if (
    user.active &&
    balance.oxBalance.lt(BigDecimal.fromString("0.01")) &&
    balance.oxBalance.lt(BigDecimal.fromString("0.01"))
  ) {
    let holders = getHolderAux();
    holders.value = holders.value.minus(BigInt.fromI32(1));
    holders.save();
    user.active = false;
  } else if (
    user.active == false &&
    (balance.oxBalance.gt(BigDecimal.fromString("0.01")) ||
      balance.oxBalance.gt(BigDecimal.fromString("0.01")))
  ) {
    let holders = getHolderAux();
    holders.value = holders.value.plus(BigInt.fromI32(1));
    holders.save();
    user.active = true;
  }

  //OX-USDT
  let bonds = balance.bonds;

  if (
    transaction.blockNumber.gt(
      BigInt.fromString(OXUSDT_PCSBOND_CONTRACT_BLOCK)
    )
  ) {
    let oxUsdtBond_contract = OxBond.bind(
      Address.fromString(OXUSDT_PCSBOND_CONTRACT)
    );
    let pending = oxUsdtBond_contract.bondInfo(Address.fromString(user.id));
    if (pending.value1.gt(BigInt.fromString("0"))) {
      let pending_bond = toDecimal(pending.value1, 9);
      balance.bondBalance = balance.bondBalance.plus(pending_bond);

      let binfo = loadOrCreateContractInfo(
        user.id + transaction.timestamp.toString() + "OxBond"
      );
      binfo.name = "OX-USDT";
      binfo.contract = OXUSDT_PCSBOND_CONTRACT;
      binfo.amount = pending_bond;
      binfo.save();
      bonds.push(binfo.id);

      log.debug("User {} pending OX-USDT {} on tx {}", [
        user.id,
        toDecimal(pending.value1, 9).toString(),
        transaction.id,
      ]);
    }
  }

  //USDT

  //   if (transaction.blockNumber.gt(BigInt.fromString(DAIBOND_CONTRACTS3_BLOCK))) {
  //     let bondDai_contract = DAIBondV3.bind(
  //       Address.fromString(DAIBOND_CONTRACTS3)
  //     );
  //     let pending = bondDai_contract.bondInfo(Address.fromString(user.id));
  //     if (pending.value1.gt(BigInt.fromString("0"))) {
  //       let pending_bond = toDecimal(pending.value1, 9);
  //       balance.bondBalance = balance.bondBalance.plus(pending_bond);

  //       let binfo = loadOrCreateContractInfo(
  //         user.id + transaction.timestamp.toString() + "DAIBondV3"
  //       );
  //       binfo.name = "USDT";
  //       binfo.contract = DAIBOND_CONTRACTS3;
  //       binfo.amount = pending_bond;
  //       binfo.save();
  //       bonds.push(binfo.id);

  //       log.debug("User {} pending USDT {} on tx {}", [
  //         user.id,
  //         toDecimal(pending.value1, 9).toString(),
  //         transaction.id,
  //       ]);
  //     }
  //   }

  // OX-BUSD

  if (
    transaction.blockNumber.gt(
      BigInt.fromString(OXBUSD_PCSBOND_CONTRACT_BLOCK)
    )
  ) {
    let oxBusdBond_contract = OxBond.bind(
      Address.fromString(OXBUSD_PCSBOND_CONTRACT)
    );
    let pending = oxBusdBond_contract.bondInfo(Address.fromString(user.id));
    if (pending.value1.gt(BigInt.fromString("0"))) {
      let pending_bond = toDecimal(pending.value1, 9);
      balance.bondBalance = balance.bondBalance.plus(pending_bond);

      let binfo = loadOrCreateContractInfo(
        user.id + transaction.timestamp.toString() + "OxBond"
      );
      binfo.name = "OX-BUSD";
      binfo.contract = OXBUSD_PCSBOND_CONTRACT;
      binfo.amount = pending_bond;
      binfo.save();
      bonds.push(binfo.id);

      log.debug("User {} pending OX-BUSD {} on tx {}", [
        user.id,
        toDecimal(pending.value1, 9).toString(),
        transaction.id,
      ]);
    }
  }

  // BUSD
  if (transaction.blockNumber.gt(BigInt.fromString(BUSDBOND_CONTRACT_BLOCK))) {
    let busdBond_contract = OxBond.bind(
      Address.fromString(BUSDBOND_CONTRACT)
    );
    let pending = busdBond_contract.bondInfo(Address.fromString(user.id));
    if (pending.value1.gt(BigInt.fromString("0"))) {
      let pending_bond = toDecimal(pending.value1, 9);
      balance.bondBalance = balance.bondBalance.plus(pending_bond);

      let binfo = loadOrCreateContractInfo(
        user.id + transaction.timestamp.toString() + "OxBond"
      );
      binfo.name = "BUSD";
      binfo.contract = BUSDBOND_CONTRACT;
      binfo.amount = pending_bond;
      binfo.save();
      bonds.push(binfo.id);

      log.debug("User {} pending BUSD {} on tx {}", [
        user.id,
        toDecimal(pending.value1, 9).toString(),
        transaction.id,
      ]);
    }
  }

  balance.bonds = bonds;

  //Price
  let usdRate = getOxUSDRate();
  balance.dollarBalance = balance.oxBalance
    .times(usdRate)
    .plus(balance.oxBalance.times(usdRate))
    .plus(balance.bondBalance.times(usdRate));
  balance.save();

  user.lastBalance = balance.id;
  user.save();
}
