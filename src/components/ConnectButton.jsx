import { Button, SvgIcon } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useWeb3Context } from 'src/hooks/web3Context';
import { ReactComponent as WalletIcon } from '../assets/icons/wallet.svg';
import { error } from '../slices/MessagesSlice';
import { useEffect, useState } from 'react';

const ConnectButton = () => {
  const dispatch = useDispatch();
  const { provider, connect, chainID } = useWeb3Context();
  const [ currentChain, setCurrentChain ] = useState();

  const getChainID = async () => {};

  useEffect(() => {}, []);
  return (
    <Button
      endIcon={<SvgIcon className="stake-wallet-icon" viewBox="0 0 24 19" component={WalletIcon} />}
      variant="contained"
      color="primary"
      className="connect-button"
      onClick={async () => {
        connect();
      }}
      key={1}
    >
      Connect Wallet
    </Button>
  );
};

export default ConnectButton;
