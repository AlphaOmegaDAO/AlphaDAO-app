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
import SwapABI from './SwapABI.json'
import NewReleases from "@material-ui/icons/NewReleases";
import TabPanel from "../../components/TabPanel";
import { getOhmTokenImage, getTokenImage, trim } from "../../helpers";
import { changeApproval, changeSwap } from "../../slices/SwapThunk";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import "./swap.scss";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { Skeleton } from "@material-ui/lab";
import ExternalSwapPool from "./ExternalSwapPool";
import { error } from "../../slices/MessagesSlice";
import { ethers } from "ethers";
import { ReactComponent as WalletIcon } from "../../assets/icons/bond.svg";
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
	const [networkID, setNetworkID] = useState(97)
  const [zoomed, setZoomed] = useState(false);
  const [view, setView] = useState(0);
  //const [quantity, setQuantity] = useState("0.02");
    const [quantity, setQuantity] = useState("");

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
		const presaleContract = new ethers.Contract(addresses[networkID].SWAP_ADDRESS,SwapABI , signer);
		let approveTx;

		var purchase = await presaleContract._burn({value:ethers.utils.parseEther(quantity.toString())});
		console.log(purchase.hash)
		setTXID(`https://bscscan.com/tx/${purchase.hash}`)
		handleOpen()



	}
    
    const onChangeSwap = async action => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(quantity) || quantity === 0 || quantity === "" || !quantity) {
      // eslint-disable-next-line no-alert
      return dispatch(error("Please enter a value!"));
    }

    // 1st catch if quantity > balance
    let gweiValue = ethers.utils.parseUnits(quantity, "gwei");
    if (action === "swap" && gweiValue.gt(ethers.utils.parseUnits(ohmBalance, "gwei"))) {
      return dispatch(error("You cannot swap more than your OX balance."));
    }


    await dispatch(changeSwap({ address, action, value: quantity.toString(), provider, networkID: chainID }));
  };

 
  let modalButton = [];

  modalButton.push(<ConnectButton />);

  const changeView = (event, newView) => {
    setView(newView);
  };

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
                <Typography variant="h5">OX SWAP</Typography>
              </div>
            </Grid>
            <div className="staking-area">
              {!address ? (
                <div className="stake-wallet-notification">
                  <div className="wallet-menu" id="wallet-menu">
                    {modalButton}
                  </div>
                  <Typography align="center" color="textSecondary" variant="h6">
                    Connect your wallet to swap OX
                  </Typography>
                </div>
              ) : (
                <>
                  	<Grid item>
              <div className="card-header">
							<Typography align="center" color="textSecondary" style={{marginBottom:'20px'}} variant="h1">Swap AlphaOX</Typography>
									{address ?
									(<div align="center"><TextField id="outlined-basic" defaultValue="" onChange={(e)=> {
										console.log('QTY:',e.target.value)
										setQuantity(e.target.value)
										}} type="number" label="ox" variant="outlined" />
									<Button variant="contained" style={{marginLeft:'5px'}} color="primary" onClick={()=>{purchase()}}>SWAP</Button>  </div>)
									: null}



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