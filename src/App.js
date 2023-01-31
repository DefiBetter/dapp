import { WagmiConfig, createClient, configureChains, chain } from "wagmi";

import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

import { MetaMaskConnector } from "wagmi/connectors/metaMask";

import Connector from "./components/Connector";

import customChains from "./static/chains";

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider, webSocketProvider } = configureChains(
  [
    // chain.polygon,
    customChains.binanceSmartChain,
    // customChains.fantomChain,
    // customChains.defiBetterChain,
    // { ...chain.hardhat, logo: "hardhat-logo.png" },
    // chain.hardhat
  ],
  [
    publicProvider(),
    jsonRpcProvider({
      rpc: (_chain) => {
        for (const custChain of Object.values(customChains)) {
          if (_chain.id === custChain.id)
            return { http: custChain.rpcUrls.default };
        }
        return null;
      },
    }),
  ]
);

// Set up client
const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains,
      options: {
        shimDisconnect: true,
        UNSTABLE_shimOnConnectSelectAccount: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
});

// Pass client to React Context Provider
function App() {
  return (
    <WagmiConfig client={client}>
      <Connector />
    </WagmiConfig>
  );
}

export default App;
