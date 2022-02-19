import { useEffect, useState } from 'react';
import { Paper, Grid, Typography, Box, Zoom, Container, useMediaQuery } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { useSelector } from 'react-redux';
import Chart from '../../components/Chart/Chart.jsx';
import { trim, formatCurrency } from '../../helpers';
import {
  treasuryDataQuery,
  rebasesDataQuery,
  bulletpoints,
  tooltipItems,
  tooltipInfoMessages,
  itemType
} from './treasuryData.js';
import { useTheme } from '@material-ui/core/styles';
import './treasury-dashboard.scss';
import apollo from '../../lib/apolloClient';
import InfoTooltip from 'src/components/InfoTooltip/InfoTooltip.jsx';

function TreasuryDashboard() {
  const [ data, setData ] = useState(null);
  const [ apy, setApy ] = useState(null);
  const [ runway, setRunway ] = useState(null);
  // const [staked, setStaked] = useState(null);
  const theme = useTheme();
  const smallerScreen = useMediaQuery('(max-width: 650px)');
  const verySmallScreen = useMediaQuery('(max-width: 379px)');

  const staked = useSelector((state) => {
    return state.app.Staked;
  });
  const treasuryMarketValue = useSelector((state) => {
    return state.app.treasuryMarketValue;
  });
  const marketPrice = useSelector((state) => {
    return state.app.marketPrice;
  });
  const circSupply = useSelector((state) => {
    return state.app.circSupply;
  });
  const totalSupply = useSelector((state) => {
    return state.app.totalSupply;
  });
  const marketCap = useSelector((state) => {
    return state.app.marketCap;
  });

  const currentIndex = useSelector((state) => {
    return state.app.currentIndex;
  });

  const backingPerOhm = useSelector((state) => {
    return state.app.treasuryMarketValue / state.app.circSupply;
  });
  const stakingAPY = useSelector((state) => {
    return state.app.stakingAPY;
  });
  const wsOhmPrice = useSelector((state) => {
    return state.app.marketPrice * state.app.currentIndex;
  });

  useEffect(() => {
    // apollo(treasuryDataQuery).then(r => {
    //   let metrics = r.data.protocolMetrics.map(entry =>
    //     Object.entries(entry).reduce((obj, [key, value]) => ((obj[key] = parseFloat(value)), obj), {}),
    //   );
    //   metrics = metrics.filter(pm => pm.treasuryMarketValue > 0);
    //   setData(metrics);
    //   let staked = r.data.protocolMetrics.map(entry => ({
    //     staked: (parseFloat(entry.sOhmCirculatingSupply) / parseFloat(entry.WHISKEYCirculatingSupply)) * 100,
    //     timestamp: entry.timestamp,
    //   }));
    //   staked = staked.filter(pm => pm.staked < 100);
    //   setStaked(staked);
    //   let runway = metrics.filter(pm => pm.runway10k > 5);
    //   setRunway(runway);
    // });
    // apollo(rebasesDataQuery).then(r => {
    //   let apy = r.data.rebases.map(entry => ({
    //     apy: Math.pow(parseFloat(entry.percentage) + 1, 365 * 3) * 100,
    //     timestamp: entry.timestamp,
    //   }));
    //   apy = apy.filter(pm => pm.apy < 300000);
    //   setApy(apy);
    // });
  }, []);

  return (
    <div id="treasury-dashboard-view" className={`${smallerScreen && 'smaller'} ${verySmallScreen && 'very-small'}`}>
      <Container style={{ paddingLeft: '3.3rem', paddingRight: '3.3rem' }}>
        <Zoom in={true}>
          <Grid container spacing={2} className="data-grid">
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card">
                <Typography variant="h6" color="textSecondary">
                  OX Price
                </Typography>
                <Typography variant="h5">
                  {/* appleseed-fix */}
                  {marketPrice ? formatCurrency(marketPrice, 2) : <Skeleton type="text" />}
                </Typography>
              </Paper>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card">
                <Typography variant="h6" color="textSecondary">
                  Current Index
                  <InfoTooltip
                    message={
                      'The current index tracks the amount of xOX accumulated since the beginning of staking. Basically, how much xOX one would have if they staked and held a single OX from day 1.'
                    }
                  />
                </Typography>
                <Typography variant="h5">
                  {currentIndex ? trim(currentIndex, 0) / 1000 + ' xOX' : <Skeleton type="text" />}
                </Typography>
              </Paper>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card">
                <Typography variant="h6" color="textSecondary">
                  Circulating Supply (total)
                </Typography>
                <Typography variant="h5">
                  {circSupply && totalSupply ? (
                    trim(circSupply, 2) + ' / ' + trim(totalSupply, 2)
                  ) : (
                    <Skeleton type="text" />
                  )}
                </Typography>
              </Paper>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card">
                <Typography variant="h6" color="textSecondary">
                  Backing per OX
                </Typography>
                <Typography variant="h5">
                  {backingPerOhm ? formatCurrency(backingPerOhm, 2) : <Skeleton type="text" />}
                </Typography>
              </Paper>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card">
                <Typography variant="h6" color="textSecondary">
                  Treasury Market Value
                </Typography>
                <Typography variant="h5">
                  {/* appleseed-fix */}
                  {treasuryMarketValue ? formatCurrency(treasuryMarketValue, 2) : <Skeleton type="text" />}
                </Typography>
              </Paper>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card">
                <Typography variant="h6" color="textSecondary">
                  % OX Staked
                </Typography>
                <Typography variant="h5">{staked ? `${trim(staked, 2)}%` : <Skeleton type="text" />}</Typography>
              </Paper>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card">
                <Typography variant="h6" color="textSecondary">
                  APY
                </Typography>
                <Typography variant="h5">
                  {stakingAPY ? `${trim(stakingAPY * 100, 2)}%` : <Skeleton type="text" />}
                </Typography>
              </Paper>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card">
                <Typography variant="h6" color="textSecondary">
                  Market Cap
                </Typography>
                <Typography variant="h5">
                  {marketCap && formatCurrency(marketCap, 2)}
                  {!marketCap && <Skeleton type="text" />}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Zoom>
      </Container>
    </div>
  );
}

export default TreasuryDashboard;
