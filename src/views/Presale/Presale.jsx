import { useCallback, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Paper,
  SvgIcon,
  Tab,
  Tabs,
  Typography,
  Zoom,
	TextField,
	Modal
} from "@material-ui/core";
import { addresses } from "../../constants";
import presaleABI from './presaleAbi.json'
import NewReleases from "@material-ui/icons/NewReleases";
import TabPanel from "../../components/TabPanel";
import { getOhmTokenImage, getTokenImage, trim } from "../../helpers";
import { changeApproval, changeStake } from "../../slices/StakeThunk";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import "./stake.scss";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { Skeleton } from "@material-ui/lab";
import ExternalStakePool from "./ExternalStakePool";
import { error } from "../../slices/MessagesSlice";
import { ethers } from "ethers";
import { ReactComponent as WalletIcon } from "../../assets/icons/wallet.svg";
import ConnectButton from "../../components/ConnectButton";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const sOhmImg = getTokenImage("sohm");
const ohmImg = getOhmTokenImage(16, 16);

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'gray',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function Presale() {
  const dispatch = useDispatch();
  const { provider, address, connected, connect, chainID } = useWeb3Context();
	const [networkID, setNetworkID] = useState(56)
  const [zoomed, setZoomed] = useState(false);
  const [view, setView] = useState(0);
  const [quantity, setQuantity] = useState("0.02");
	const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
	const [txID, setTXID] = useState()
  const isAppLoading = useSelector(state => state.app.loading);
  const currentIndex = useSelector(state => {
    return state.app.currentIndex;
  });
	useEffect(()=>{
		console.log(`QUANTITY:${quantity}`)
	},[quantity])

	const purchase = async () =>{
		const signer = provider.getSigner();
		const presaleContract = new ethers.Contract(addresses[networkID].PRESALE_ADDRESS,presaleABI , signer);
		let approveTx;
		// const tx = {
		// 	from: address,
		// 	to: addresses[networkID].PRESALE_ADDRESS,
		// 	value: ethers.utils.parseEther('0.01'),
		// 	// nonce: window.ethersProvider.getTransactionCount(send_account, "latest"),
		// 	// gasLimit: ethers.utils.hexlify(gas_limit), // 100000
		// 	// gasPrice: gas_price,
		// }
		// let purchaseToken = await signer.sendTransaction(tx);
		// var contract = new ethers.Contract(address,abi,wallet);
		var purchase = await presaleContract.buy({value:ethers.utils.parseEther(quantity.toString())});
		console.log(purchase.hash)
		setTXID(`https://bscscan.com/tx/${purchase.hash}`)
		handleOpen()



	}
  // const fiveDayRate = useSelector(state => {
  //   return state.app.fiveDayRate;
  // });
  // const ohmBalance = useSelector(state => {
  //   return state.account.balances && state.account.balances.ohm;
  // });
  // // const oldSohmBalance = useSelector(state => {
  // //   return state.account.balances && state.account.balances.oldsohm;
  // // });
  // const sohmBalance = useSelector(state => {
  //   return state.account.balances && state.account.balances.sohm;
  // });
  // const fsohmBalance = useSelector(state => {
  //   return state.account.balances && state.account.balances.fsohm;
  // });
  // const wsohmBalance = useSelector(state => {
  //   return state.account.balances && state.account.balances.wsohm;
  // });
  // const stakeAllowance = useSelector(state => {
  //   return state.account.staking && state.account.staking.ohmStake;
  // });
  // const unstakeAllowance = useSelector(state => {
  //   return state.account.staking && state.account.staking.ohmUnstake;
  // });
  // const stakingRebase = useSelector(state => {
  //   return state.app.stakingRebase;
  // });
  // const stakingAPY = useSelector(state => {
  //   return state.app.stakingAPY;
  // });
  // const stakingTVL = useSelector(state => {
  //   return state.app.stakingTVL;
  // });

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  // const setMax = () => {
  //   if (view === 0) {
  //     setQuantity(ohmBalance);
  //   } else {
  //     setQuantity(sohmBalance);
  //   }
  // };

  // const onSeekApproval = async token => {
  //   await dispatch(changeApproval({ address, token, provider, networkID: chainID }));
  // };

//   const onChangeStake = async action => {
//     // eslint-disable-next-line no-restricted-globals
//     if (isNaN(quantity) || quantity === 0 || quantity === "") {
//       // eslint-disable-next-line no-alert
//       return dispatch(error("Please enter a value!"));
//     }
//
//     // 1st catch if quantity > balance
//     let gweiValue = ethers.utils.parseUnits(quantity, "gwei");
//     if (action === "stake" && gweiValue.gt(ethers.utils.parseUnits(ohmBalance, "gwei"))) {
//       return dispatch(error("You cannot stake more than your OX balance."));
//     }
//
//     if (action === "unstake" && gweiValue.gt(ethers.utils.parseUnits(sohmBalance, "gwei"))) {
//       return dispatch(error("You cannot unstake more than your sOX balance."));
//     }
//
//     await dispatch(changeStake({ address, action, value: quantity.toString(), provider, networkID: chainID }));
//   };

  // const hasAllowance = useCallback(
  //   token => {
  //     if (token === "ohm") return stakeAllowance > 0;
  //     if (token === "sohm") return unstakeAllowance > 0;
  //     return 0;
  //   },
  //   [stakeAllowance, unstakeAllowance],
  // );

  // const isAllowanceDataLoading = (stakeAllowance == null && view === 0) || (unstakeAllowance == null && view === 1);

  let modalButton = [];

  modalButton.push(<ConnectButton />);

  const changeView = (event, newView) => {
    setView(newView);
  };

  // const trimmedBalance = Number(
  //   [sohmBalance, fsohmBalance, wsohmBalance]
  //     .filter(Boolean)
  //     .map(balance => Number(balance))
  //     .reduce((a, b) => a + b, 0)
  //     .toFixed(4),
  // );
  // const trimmedStakingAPY = trim(stakingAPY * 100, 1);
  // const stakingRebasePercentage = trim(stakingRebase * 100, 4);
  // const nextRewardValue = trim((stakingRebasePercentage / 100) * trimmedBalance, 4);

  return (
    <div id="stake-view" className="stake-metrics">
			<Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography align="center" id="modal-modal-title" variant="h6" component="h2">
            Thank you for your purchase.
          </Typography>
          <Typography align="center" id="modal-modal-description" sx={{ mt: 2 }}>
            <a target="_blank" href={txID}>View Transaction</a>
          </Typography>
        </Box>
      </Modal>
      <Zoom in={true} onEntered={() => setZoomed(true)}>
        <Paper className={`ohm-card`}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <div className="card-header">
                <Typography variant="h5">iOX Presale</Typography>

                {/*{address && oldSohmBalance > 0.01 && (*/}
                {/*  <Link*/}
                {/*    className="migrate-sohm-button"*/}
                {/*    style={{ textDecoration: "none" }}*/}
                {/*    href="https://docs.olympusdao.finance/using-the-website/migrate"*/}
                {/*    aria-label="migrate-sohm"*/}
                {/*    target="_blank"*/}
                {/*  >*/}
                {/*    <NewReleases viewBox="0 0 24 24" />*/}
                {/*    <Typography>Migrate sOHM!</Typography>*/}
                {/*  </Link>*/}
                {/*)}*/}
              </div>
            </Grid>
            <div className="staking-area">
              {!address ? (
                <div className="stake-wallet-notification">
                  <div className="wallet-menu" id="wallet-menu">
                    {modalButton}
                  </div>
                  <Typography align="center" color="textSecondary" variant="h6">
                    Connect your wallet to purchase iOX
                  </Typography>
                </div>
              ) : (
                <>
                  	<Grid item>
              <div className="card-header">
							<Typography align="center" color="textSecondary" style={{marginBottom:'20px'}} variant="h1">Purchase iOX</Typography>
							<Typography align="center" color="textSecondary" style={{marginBottom:'20px'}} variant="h6">0.02 BNB for 1 iOX - MAX 200 BNB</Typography>
									{address ?
									(<div align="center"><TextField id="outlined-basic" defaultValue="" onChange={(e)=> {
										console.log('QTY:',e.target.value)
										setQuantity(e.target.value)
										}} type="number" label="BNB" variant="outlined" />
									<Button variant="contained" style={{marginLeft:'5px'}} color="primary" onClick={()=>{purchase()}}>Buy</Button>  </div>)
									: null}

                  <Typography align="center" style={{marginTop:'20px'}} color="textSecondary" variant="body1">
                    WARNING: Make sure, your wallet is connected to the BINANCE SMART CHAIN - Block Explorer URL: https://bscscan.com. WE CANNOT convert your ERC20 tokens to the mainnet BNB coin. Please only send BNB coins from BSC MainNet. If you do not send BSC BNB the tokens you send will be lost.
                  </Typography>

              </div>
            </Grid>


                </>
              )}
            </div>
          </Grid>
        </Paper>
      </Zoom>

      {/*<ExternalStakePool />*/}
    </div>
  );
}

export default Presale;
