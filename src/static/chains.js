const customChains = {

  hardhat: {
    id: 56,
    name: 'BSC',
    network: 'bsc',
    nativeCurrency: {
      decimals: 18,
      name: 'BNB',
      symbol: 'BNB',
    },
    rpcUrls: {
      default: 'https://bsc-dataseed1.binance.org/',
    },
    blockExplorers: {
      default: { name: 'BSCscan', url: 'https://bscscan.com/' },
    },
    testnet: false,
},

  binanceSmartChain: {
      id: 56,
      name: 'BSC',
      network: 'bsc',
      nativeCurrency: {
        decimals: 18,
        name: 'BNB',
        symbol: 'BNB',
      },
      rpcUrls: {
        default: 'https://bsc-dataseed1.binance.org/',
      },
      blockExplorers: {
        default: { name: 'BSCscan', url: 'https://bscscan.com/' },
      },
      testnet: false,
  },

  fantomChain: {
      id: 250,
      name: 'Fantom Opera',
      network: 'fantom',
      nativeCurrency: {
        decimals: 18,
        name: 'Fantom',
        symbol: 'FTM',
      },
      rpcUrls: {
        default: 'https://rpc.ftm.tools/',
      },
      blockExplorers: {
        default: { name: 'FTMScan', url: 'https://ftmscan.com/' },
      },
      testnet: false,
  }

}

export default customChains;