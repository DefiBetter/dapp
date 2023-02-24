// TODO
const contractAddresses = {
  hardhat: {
    btToken: process.env.REACT_APP_btToken,
    vcPresale: process.env.REACT_APP_vcPresale,
    communityPresale: process.env.REACT_APP_communityPresale,
    publicSale: process.env.REACT_APP_publicSale,
    btStaking: process.env.REACT_APP_btStaking,
    better: process.env.REACT_APP_better,
    lpToken: process.env.REACT_APP_lpToken,
    lpStaking: process.env.REACT_APP_lpStaking,
    nativeGas: "bBNB",
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
    better: "0xdb01265Db404b2474C8Fa2406987D9eB6bCa5db3",
    presale: "0xC6C5A911d6960F5175CE049399E9e9859401969e",
    btToken: "0x9300EaF843c00267037358f397437574A1c17daC",
    btStaking: "0xa2153a46df5b35f12f2bdd959fa22d675546f11f",
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
const underlyingPairAddress = {
  ethereum: "0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640",
  avalanche: "0xf4003F4efBE8691B60249E6afbD307aBE7758adb",
};

export { contractAddresses, underlyingPairAddress };
