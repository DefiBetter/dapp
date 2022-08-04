import {useNetwork, useSwitchNetwork, useAccount } from "wagmi";

import {
  NavLink,
  Route,
  Routes
} from 'react-router-dom'

import Better from './../pages/Better'
import Staking from './../pages/Staking'
import PublicSale from '../pages/PublicSale'
import Presale from '../pages/Presale'

import Navbar from './Navbar'
import WalletConnect from './WalletConnect'
import SwitchNetwork from './SwitchNetwork'

function Connector() {

  const network = useNetwork();
  const networkSwitcher = useSwitchNetwork();
  const account = useAccount();

  const liStyle = {
    "display": "inline",
    "margin": "1rem",
    "padding": "1rem"
  }

  return <>

    <Navbar>
      <ul style={liStyle}>
        <li style={liStyle}><NavLink to="/" end>Better</NavLink></li>
        <li style={liStyle}><NavLink to="/staking">Staking</NavLink></li>
        <li style={liStyle}><NavLink to="/public-sale">Public Sale</NavLink></li>
        <li style={liStyle}><NavLink to="/presale">Presale</NavLink></li>
      </ul>
      <br></br>
      <br></br>

      <WalletConnect address={account.address} />
      <SwitchNetwork network={network} networkSwitcher={networkSwitcher} />
    </Navbar>

    <Routes>

      <Route path="/" element={
        <>
          <h1>Better</h1>
          <Better 
            connectedAddress={account.address} 
            activeChain={network.chain} 
            isConnected={account.isConnected}/>
        </>
      } />

      <Route path="/public-sale" element={<>
        <h1>PublicSale</h1>
        <PublicSale 
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

      <Route path="/presale" element={
        <>
          <h1>Presale</h1>
          <Presale 
            activeChain={network.chain}
            connectedAddress={account.address}
          />
        </>
      } />

    </Routes>

  </>

}

export default Connector;