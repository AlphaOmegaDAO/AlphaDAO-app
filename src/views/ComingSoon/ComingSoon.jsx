import './stake.scss';
import { useState } from 'react';
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
  TextField
} from '@material-ui/core';
import { ReactComponent as LinkIcon } from '../../assets/icons/link.svg';

export default function ComingSoon() {
  const [ zoomed, setZoomed ] = useState(false);

  return (
    <div id="stake-view" className="stake-metrics">
      <Zoom in={true} onEntered={() => setZoomed(true)}>
        <Paper style={{ padding: '20px' }}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <Box direction="column" className="bond-price-data-column">
                <Typography style={{ marginBottom: '20px', textAlign: 'center' }} variant="h1" color="textPrimary">
                  OX Token Staking and Bonds
                </Typography>
                <Typography style={{ marginBottom: '20px', textAlign: 'center' }} variant="h5" color="textSecondary">
                  The best strategy would be bond + stake
                </Typography>
              </Box>

              <Typography align="center" style={{ marginBottom: '20px' }} variant="h5" color="textPrimary">
                STAKING / BONDS
              </Typography>
              <Box textAlign="center" style={{ marginBottom: '20px' }}>
                <Button
                  variant="contained"
                  color="primary"
                  align="center"
                  id="bond-coming-soon-btn"
                  className="nft-coming-soon-button nft-coming-soon-button-text "
                  disabled={true}
                  onClick={() => {}}
                >
                  COMING SOON
                </Button>
              </Box>
              <Typography align="center" style={{ marginBottom: '20px', padding: '10px' }} color="textSecondary">
                Stakers receive auto-compounded rebase rewards from each of the Alpha and Omega Protocols. Stakers are
                aiming for long term, passive rebase returns. The rebase rewards come from proceeds of the bond sales.
              </Typography>
              <Box textAlign="center" style={{ marginBottom: '20px' }}>
                <Button
                  href="https://docs.alphadao.financial/alpha-omega-dao/staking"
                  target="_blank"
                  variant="contained"
                  color="primary"
                  align="center"
                  id="bond-approve-btn"
                  className="transaction-button nft-coming-soon-button"
                  disabled={false}
                  endIcon={<SvgIcon component={LinkIcon} className="nft-learn-more-button" />}
                >
                  Learn More
                </Button>
              </Box>
            </Grid>
            {/* <div className="staking-area">
              <Grid item>
                <div className="card-header">
                  <Typography align="center" color="textSecondary" style={{ marginBottom: '20px' }} variant="h1">
                    Purchase iOX
                  </Typography>
                  <Typography align="center" color="textSecondary" style={{ marginBottom: '20px' }} variant="h6">
                    0.02 BNB for 1 iOX - MAX 200 BNB
                  </Typography>

                  <div align="center" />
                  <div align="center">
                    <Typography color="textSecondary" variant="">
                      WARNING: Make sure, your wallet is connected to the BINANCE SMART CHAIN - Block Explorer URL:
                      https://bscscan.com. WE CANNOT convert your ERC20 tokens to the mainnet BNB coin. Please only send
                      BNB coins from BSC MainNet. If you do not send BSC BNB the tokens you send will be lost.
                    </Typography>
                  </div>
                </div>
              </Grid>
            </div> */}
          </Grid>
        </Paper>
      </Zoom>

      {/*<ExternalStakePool />*/}
    </div>
  );

  return (
    <div id="not-found">
      <div className="not-found-header" />
    </div>
  );
}
