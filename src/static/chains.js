const customChains = {

  hardhat: {
    id: 56,
    name: "BSC",
    network: "bsc",
    nativeCurrency: {
      decimals: 18,
      name: "BNB",
      symbol: "BNB",
    },
    rpcUrls: {
      default: "https://bsc-dataseed1.binance.org/",
    },
    blockExplorers: {
      default: { name: "BSCscan", url: "https://bscscan.com/" },
    },
    testnet: false,
  },

  binanceSmartChain: {
    id: 56,
    name: "BSC",
    network: "bsc",
    nativeCurrency: {
      decimals: 18,
      name: "BNB",
      symbol: "BNB",
    },
    rpcUrls: {
      default: "https://bsc-dataseed1.binance.org/",
    },
    blockExplorers: {
      default: { name: "BSCscan", url: "https://bscscan.com/" },
    },
    testnet: false,
    logo: "bnbchain-logo.png",
  },

  fantomChain: {
    id: 250,
    name: "Fantom Opera",
    network: "fantom",
    nativeCurrency: {
      decimals: 18,
      name: "Fantom",
      symbol: "FTM",
    },
    rpcUrls: {
      default: "https://rpc.ftm.tools/",
    },
    blockExplorers: {
      default: { name: "FTMScan", url: "https://ftmscan.com/" },
    },
    testnet: false,
    logo: "fantom-logo.png",
  },

  defiBetterChain: {
    id: 12345,
    name: "Defi Better",
    network: "defibetter",
    nativeCurrency: {
      decimals: 18,
      name: "bBNB",
      symbol: "bBNB",
    },
    rpcUrls: {
      default: process.env.REACT_APP_DEFI_BETTER_RPC_URL,
    },
    blockExplorers: {
      default: { name: "BETTERScan", url: "https://ftmscan.com/" },
    },
    testnet: false,
    logo: "fantom-logo.png",
  },
};

export default customChains;
