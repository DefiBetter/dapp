import { WagmiConfig, createClient, configureChains, chain } from "wagmi";

import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

import { InjectedConnector } from "wagmi/connectors/injected";
import Connector from "./components/Connector";

import customChains from "./static/chains";
import { ThemeProvider } from "./context/ThemeContext";

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider, webSocketProvider } = configureChains(
  [
    customChains.binanceSmartChain,
    customChains.hardhat,
    // chain.polygon,
    // customChains.fantomChain,
    // customChains.defiBetterChain,
  ],
  [
    jsonRpcProvider({
      rpc: (_chain) => {
        if (_chain.id === customChains.binanceSmartChain.id) {
          return { http: customChains.binanceSmartChain.rpcUrls.default };
        }
        return null;
      },
    }),
    jsonRpcProvider({
      rpc: (_chain) => {
        if (_chain.id === customChains.hardhat.id) {
          return { http: customChains.hardhat.rpcUrls.default };
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
    new InjectedConnector({
      chains,
      options: {
        name: (detectedName) =>
          `Injected (${
            typeof detectedName === "string"
              ? detectedName
              : detectedName.join(", ")
          })`,
        shimDisconnect: true,
      },
    }),
  ],
  provider,
  // webSocketProvider
});

// Pass client to React Context Provider
function App() {
  return (
    <WagmiConfig client={client}>
      <ThemeProvider>
        <Connector />
      </ThemeProvider>
    </WagmiConfig>
  );
}

export default App;
