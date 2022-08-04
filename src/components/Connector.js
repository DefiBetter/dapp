import {useNetwork, useSwitchNetwork, useAccount } from "wagmi";

import {
  NavLink,
  Route,
  Routes
} from 'react-router-dom'

import Better from './../pages/Better'
import Staking from './../pages/Staking'
import Presale from './../pages/Presale'

import Navbar from './Navbar'
import WalletConnect from './WalletConnect'
import SwitchNetwork from './SwitchNetwork'

function Connector() {

  /* const { chain: activeChain } = useNetwork()
  const { chains, error, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork()
  const { address: connectedAddress } = useAccount(); */
  const network = useNetwork();
  const networkSwitcher = useSwitchNetwork();
  const account = useAccount();

  /* const chainInfo = {
    activeChain: activeChain
  }

  const networkInfo = {
    supportedChains: chains,
    error: error,
    isLoading: isLoading,
    pendingChainId: pendingChainId,
    switchNetwork: switchNetwork
  }; */

  return <>

    <Navbar>
      <ul>
        <li><NavLink to="/" end>Better</NavLink></li>
        <li><NavLink to="/staking">Staking</NavLink></li>
        <li><NavLink to="/presale">Presale</NavLink></li>
      </ul>
      <WalletConnect address={account.address} />
      <SwitchNetwork network={network} networkSwitcher={networkSwitcher} />
    </Navbar>

    <Routes>

      <Route path="/" element={
        <>
          <h1>better</h1>
          <Better />
        </>
      } />

      <Route path="/presale" element={<>
        <h1>Presale</h1>
        <Presale 
          connectedAddress={account.address} 
          activeChain={network.chain} 
          isConnected={account.isConnected} />
      </>
      } />

      <Route path="/staking" element={
        <>
          <h1>Staking</h1>
          <Staking 
            activeChain={network.chain}
            connectedAddress={account.address}
          />
        </>
      } />

    </Routes>

  </>

}

export default Connector;