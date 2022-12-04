// TODO
const contractAddresses = {
  hardhat: {
    better: "0x367761085BF3C12e5DA2Df99AC6E1a824612b8fb",
    presale: "0xfbC22278A96299D91d41C453234d97b4F5Eb9B2d",
    publicSale: "0xC9a43158891282A2B1475592D5719c001986Aaec",
    btToken: "0x2B0d36FACD61B71CC05ab8F3D2355ec3631C0dd5",
    lpToken: "0x2B0d36FACD61B71CC05ab8F3D2355ec3631C0dd5",
    btStaking: "0x367761085BF3C12e5DA2Df99AC6E1a824612b8fb",
    lpStaking: "0x367761085BF3C12e5DA2Df99AC6E1a824612b8fb",
    nativeGas: "ETH",
  },
  bsc: {
    better: "",
    presale: "0xC6C5A911d6960F5175CE049399E9e9859401969e",
    btToken: "0x9300EaF843c00267037358f397437574A1c17daC",
    lpToken: "0x9300EaF843c00267037358f397437574A1c17daC",
    btStaking: "0x9300EaF843c00267037358f397437574A1c17daC",
    lpStaking: "0x9300EaF843c00267037358f397437574A1c17daC",
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
