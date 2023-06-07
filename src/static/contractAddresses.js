// TODO
const contractAddresses = {
  hardhat: {
    dbmtToken: process.env.REACT_APP_dbmtToken,
    dbmtAirdrop: process.env.REACT_APP_airdropContract,
    dbmtSale: process.env.REACT_APP_dbmtSale,
    btToken: process.env.REACT_APP_btToken,
    vcPresale: process.env.REACT_APP_vcPresale,
    communityPresale: process.env.REACT_APP_communityPresale,
    publicSale: process.env.REACT_APP_publicSale,
    btStaking: process.env.REACT_APP_btStaking,
    better: process.env.REACT_APP_better,
    lpToken: process.env.REACT_APP_lpToken,
    lpStaking: process.env.REACT_APP_lpStaking,
    nativeGas: "bBNB",
    WETH: process.env.REACT_APP_PRICE_FEED_ETH,
  },
  defibetter: {
    better: "0x4C2F7092C2aE51D986bEFEe378e50BD4dB99C901",
    presale: "0xfbC22278A96299D91d41C453234d97b4F5Eb9B2d",
    publicSale: "0xC9a43158891282A2B1475592D5719c001986Aaec",
    btToken: "0x2B0d36FACD61B71CC05ab8F3D2355ec3631C0dd5",
    btStaking: "0x367761085BF3C12e5DA2Df99AC6E1a824612b8fb",
    lpToken: "0x45AAcfFFd0A96734F79f3C8a391A4CE31236417b",
    lpStaking: "0x2a810409872AfC346F9B5b26571Fd6eC42EA4849",
    nativeGas: "bBNB",
  },
  bsc: {
    dbmtToken: "0x5a101a20170656a5377f7d24ac43c97a1d7b274d",
    dbmtAirdrop: "0xab0ac050dca35be5025780bddf4fe4a88ca0e4fc",
    dbmtSale: "0x69df551a3deFcfB227631986FfEf53B49AebBB6F",
    better: "0xb4AAAC10043C561a6d54FE5357e837ef6DDE70f9", // poc
    presale: "0xC6C5A911d6960F5175CE049399E9e9859401969e",
    btToken: "0x4b7de91042d3eaFe43ad74CA5fd3f3c8E6C1A1B9", // poc
    btStaking: "0x6F1038D801D5Ab5a57f5bb91EC2223695e9a953A", // poc
    lpStaking: "0x367761085BF3C12e5DA2Df99AC6E1a824612b8fb",
    nativeGas: "BNB",
  },
  polygon: {
    better: "",
    btToken: "",
    lpToken: "",
    btStaking: "",
    lpStaking: "",
    nativeGas: "MATIC",
  },
  fantom: {
    better: "",
    btToken: "",
    lpToken: "",
    btStaking: "",
    lpStaking: "",
    nativeGas: "FTM",
  },
  etherAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
};

// better chart (dexscreener) underlying pair addresses
const underlyingToTradingViewSymbol = {
  DOGE: "BINANCE:DOGEUSDT",
  AVAX: "AVAXUSD",
  JOE: "JOEUSD",
  SPY: "AMEX:SPY",
};

export { contractAddresses, underlyingToTradingViewSymbol };
