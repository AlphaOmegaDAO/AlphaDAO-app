import { useState, useEffect } from "react";
import { addresses, TOKEN_DECIMALS } from "../../constants";
import { getTokenImage } from "../../helpers";
import { useSelector } from "react-redux";
import { Link, SvgIcon, Popper, Button, Paper, Typography, Divider, Box, Fade, Slide } from "@material-ui/core";
import { ReactComponent as InfoIcon } from "../../assets/icons/info-fill.svg";
import { ReactComponent as ArrowUpIcon } from "../../assets/icons/arrow-up.svg";
import { ReactComponent as sOxTokenImg } from "../../assets/tokens/token_sOX.svg";
import { ReactComponent as ohmTokenImg } from "../../assets/tokens/token_OX.svg";
import { ReactComponent as t33TokenImg } from "../../assets/tokens/token_33T.svg";

import "./ohmmenu.scss";
import { busd } from "src/helpers/AllBonds";
import { useWeb3Context } from "../../hooks/web3Context";

import OxImg from "src/assets/tokens/token_OX.svg";
import SOxImg from "src/assets/tokens/token_sOX.svg";
import token33tImg from "src/assets/tokens/token_33T.svg";

const addTokenToWallet = (tokenSymbol, tokenAddress) => async () => {
  if (window.ethereum) {
    const host = window.location.origin;
    // NOTE (appleseed): 33T token defaults to sOX logo since we don't have a 33T logo yet
    let tokenPath;
    // if (tokenSymbol === "OX") {

    // } ? OxImg : SOxImg;
    switch (tokenSymbol) {
      case "OX":
        tokenPath = OxImg;
        break;
      case "33T":
        tokenPath = token33tImg;
        break;
      default:
        tokenPath = SOxImg;
    }
    const imageURL = `${host}/${tokenPath}`;

    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: TOKEN_DECIMALS,
            image: imageURL,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
};

function OxMenu() {
  // const [anchorEl, setAnchorEl] = useState(null);
  // const isEthereumAPIAvailable = window.ethereum;
  const { chainID } = useWeb3Context();

  const networkID = chainID;

  // const SOX_ADDRESS = addresses[networkID].SOX_ADDRESS;
  // const OX_ADDRESS = addresses[networkID].OX_ADDRESS;
  // const PT_TOKEN_ADDRESS = addresses[networkID].PT_TOKEN_ADDRESS;

  const OX_ADDRESS = addresses[networkID]?.OX_ADDRESS;

  // const handleClick = event => {
  //   setAnchorEl(anchorEl ? null : event.currentTarget);
  // };

  // const open = Boolean(anchorEl);
  // const id = "ox-popper";
  const daiAddress = busd.getAddressForReserve(networkID);
  // const fraxAddress = frax.getAddressForReserve(networkID);
  return (
    // <Box
    //   component="div"
    //   onMouseEnter={e => handleClick(e)}
    //   onMouseLeave={e => handleClick(e)}
    //   id="alpha-menu-button-hover"
    // >
    //   <Button id="alpha-menu-button" size="large" variant="contained" color="secondary" title="OX" aria-describedby={id}>
    //     <SvgIcon component={InfoIcon} color="primary" />
    //     <Typography>BUY OX</Typography>
    //   </Button>
    //
    //   <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-start" transition>
    //     {({ TransitionProps }) => {
    //       return (
    //         <Fade {...TransitionProps} timeout={100}>
    //           <Paper className="ox-menu" elevation={1}>
    //             <Box component="div" className="buy-tokens">
    //               <Link
    //                 href={`https://app.sushi.com/swap?inputCurrency=${daiAddress}&outputCurrency=${OX_ADDRESS}`}
    //                 target="_blank"
    //                 rel="noreferrer"
    //               >
    //                 <Button size="large" variant="contained" color="secondary" fullWidth>
    //                   <Typography align="left">
    //                     Buy on Sushiswap <SvgIcon component={ArrowUpIcon} htmlColor="#A3A3A3" />
    //                   </Typography>
    //                 </Button>
    //               </Link>
    //
    <Link
      href={`https://app.sushi.com/swap?inputCurrency=${daiAddress}&outputCurrency=${OX_ADDRESS}`}
      target="_blank"
      rel="noreferrer"
    >
      <Button id="alpha-menu-button" size="large" variant="contained" color="secondary">
        <Typography align="left">BUY OX</Typography>
      </Button>
    </Link>
    //
    //               <Link href={`https://abracadabra.money/pool/10`} target="_blank" rel="noreferrer">
    //                 <Button size="large" variant="contained" color="secondary" fullWidth>
    //                   <Typography align="left">
    //                     Wrap sOX on Abracadabra <SvgIcon component={ArrowUpIcon} htmlColor="#A3A3A3" />
    //                   </Typography>
    //                 </Button>
    //               </Link>
    //             </Box>
    //
    //             <Box component="div" className="data-links">
    //               <Divider color="secondary" className="less-margin" />
    //               <Link href={`https://dune.xyz/shadow/Olympus-(OX)`} target="_blank" rel="noreferrer">
    //                 <Button size="large" variant="contained" color="secondary" fullWidth>
    //                   <Typography align="left">
    //                     Shadow's Dune Dashboard <SvgIcon component={ArrowUpIcon} htmlColor="#A3A3A3" />
    //                   </Typography>
    //                 </Button>
    //               </Link>
    //             </Box>
    //
    //             {isEthereumAPIAvailable ? (
    //               <Box className="add-tokens">
    //                 <Divider color="secondary" />
    //                 <p>ADD TOKEN TO WALLET</p>
    //                 <Box display="flex" flexDirection="row" justifyContent="space-between">
    //                   <Button variant="contained" color="secondary" onClick={addTokenToWallet("OX", OX_ADDRESS)}>
    //                     <SvgIcon
    //                       component={ohmTokenImg}
    //                       viewBox="0 0 32 32"
    //                       style={{ height: "25px", width: "25px" }}
    //                     />
    //                     <Typography variant="body1">OX</Typography>
    //                   </Button>
    //                   <Button variant="contained" color="secondary" onClick={addTokenToWallet("sOX", SOX_ADDRESS)}>
    //                     <SvgIcon
    //                       component={sOxTokenImg}
    //                       viewBox="0 0 100 100"
    //                       style={{ height: "25px", width: "25px" }}
    //                     />
    //                     <Typography variant="body1">sOX</Typography>
    //                   </Button>
    //                   <Button variant="contained" color="secondary" onClick={addTokenToWallet("33T", PT_TOKEN_ADDRESS)}>
    //                     <SvgIcon
    //                       component={t33TokenImg}
    //                       viewBox="0 0 1000 1000"
    //                       style={{ height: "25px", width: "25px" }}
    //                     />
    //                     <Typography variant="body1">33T</Typography>
    //                   </Button>
    //                 </Box>
    //               </Box>
    //             ) : null}
    //
    //             <Divider color="secondary" />
    //             <Link
    //               href="https://docs.olympusdao.finance/using-the-website/unstaking_lp"
    //               target="_blank"
    //               rel="noreferrer"
    //             >
    //               <Button size="large" variant="contained" color="secondary" fullWidth>
    //                 <Typography align="left">Unstake Legacy LP Token</Typography>
    //               </Button>
    //             </Link>
    //           </Paper>
    //         </Fade>
    //       );
    //     }}
    //   </Popper>
    // </Box>
  );
}

export default OxMenu;
