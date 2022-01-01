import { BigDecimal, BigInt, Address } from "@graphprotocol/graph-ts";
import { User, UserBalance } from "../../generated/schema";
import { dayFromTimestamp } from "./Dates";

export function loadOrCreateUserBalance(
  user: User,
  timestamp: BigInt
): UserBalance {
  let id = timestamp.toString() + user.id;

  let userBalance = UserBalance.load(id);
  if (userBalance == null) {
    userBalance = new UserBalance(id);
    userBalance.user = user.id;
    userBalance.timestamp = timestamp;
    userBalance.sOxBalance = BigDecimal.fromString("0");
    userBalance.oxBalance = BigDecimal.fromString("0");
    userBalance.bondBalance = BigDecimal.fromString("0");
    userBalance.dollarBalance = BigDecimal.fromString("0");
    userBalance.stakes = [];
    userBalance.bonds = [];
    userBalance.save();
  }
  return userBalance as UserBalance;
}
