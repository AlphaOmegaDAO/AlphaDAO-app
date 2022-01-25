import { ethers } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as OlympusStaking } from "../abi/OlympusStakingv2.json";
import { abi as StakingHelper } from "../abi/StakingHelper.json";
import { clearPendingTxn, fetchPendingTxns, getStakingTypeText } from "./PendingTxnsSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, getBalances } from "./AccountSlice";
import { error } from "../slices/MessagesSlice";
import { IActionValueAsyncThunk, IChangeApprovalAsyncThunk, IJsonRPCError } from "./interfaces";
import { segmentUA } from "../helpers/userAnalyticHelpers";

interface IUAData {
  address: string;
  value: string;
  approved: boolean;
  txHash: string | null;
  type: string | null;
}

export const changeApproval = createAsyncThunk(
  "swap/changeApproval",
  async ({ token, provider, address, networkID }: IChangeApprovalAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const ohmContract = new ethers.Contract(addresses[networkID].PID_ADDRESS as string, ierc20Abi, signer);
    const sohmContract = new ethers.Contract(addresses[networkID].SPID_ADDRESS as string, ierc20Abi, signer);
    let approveTx;
    try {
      if (token === "ohm") {
        approveTx = await ohmContract.approve(
          addresses[networkID].STAKING_HELPER_ADDRESS,
          ethers.utils.parseUnits("1000000000", "gwei").toString(),
        );
      } else if (token === "sohm") {
        approveTx = await sohmContract.approve(
          addresses[networkID].STAKING_ADDRESS,
          ethers.utils.parseUnits("1000000000", "gwei").toString(),
        );
      }
      const text = "Approve " + (token === "ohm" ? "Staking" : "Unstaking");
      const pendingTxnType = token === "ohm" ? "approve_staking" : "approve_unstaking";
      dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));

      await approveTx.wait();
    } catch (e: unknown) {
      dispatch(error((e as IJsonRPCError).message));
      return;
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }

    const swapAllowance = await ohmContract.allowance(address, addresses[networkID].STAKING_HELPER_ADDRESS);
    const unswapAllowance = await sohmContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
    return dispatch(
      fetchAccountSuccess({
        staking: {
          ohmSwap: +swapAllowance,
          ohmUnswap: +unswapAllowance,
        },
      }),
    );
  },
);

export const changeSwap = createAsyncThunk(
  "swap/changeSwap",
  async ({ action, value, provider, address, networkID }: IActionValueAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const staking = new ethers.Contract(addresses[networkID].STAKING_ADDRESS as string, OlympusStaking, signer);
    const stakingHelper = new ethers.Contract(
      addresses[networkID].STAKING_HELPER_ADDRESS as string,
      StakingHelper,
      signer,
    );

    let swapTx;
    let uaData: IUAData = {
      address: address,
      value: value,
      approved: true,
      txHash: null,
      type: null,
    };
    try {
      if (action === "swap") {
        uaData.type = "swap";
        swapTx = await stakingHelper.swap(ethers.utils.parseUnits(value, "gwei"));
      } else {
        uaData.type = "unswap";
        swapTx = await staking.unswap(ethers.utils.parseUnits(value, "gwei"), true);
      }
      const pendingTxnType = action === "swap" ? "staking" : "unstaking";
      uaData.txHash = swapTx.hash;
      dispatch(fetchPendingTxns({ txnHash: swapTx.hash, text: getStakingTypeText(action), type: pendingTxnType }));
      await swapTx.wait();
    } catch (e: unknown) {
      uaData.approved = false;
      const rpcError = e as IJsonRPCError;
      if (rpcError.code === -32603 && rpcError.message.indexOf("ds-math-sub-underflow") >= 0) {
        dispatch(
          error("You may be trying to swap more than your balance! Error code: 32603. Message: ds-math-sub-underflow"),
        );
      } else {
        dispatch(error(rpcError.message));
      }
      return;
    } finally {
      if (swapTx) {
        segmentUA(uaData);

        dispatch(clearPendingTxn(swapTx.hash));
      }
    }
    dispatch(getBalances({ address, networkID, provider }));
  },
);
