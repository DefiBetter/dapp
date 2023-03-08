import { useNetwork } from "wagmi";
import { contractAddresses } from "../static/contractAddresses";

export default function useAddToWallet() {
  const { chain } = useNetwork();

  async function addToWallet(tokenName) {
    const { ethereum } = window;

    const map = {
      DBMT: {
        address: contractAddresses[chain?.network]?.dbmtToken,
        decimals: 18,
        imageURL:
          "https://github.com/ArchitectOfParadise/DefiBetterV1-FrontEnd-V2/blob/dev/src/static/image/dbmt.png?raw=true",
      },
    };

    await ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20", // Initially only supports ERC20, but eventually more!
        options: {
          address: map[tokenName].address,
          symbol: tokenName,
          decimals: map[tokenName].decimals,
          image: map[tokenName].imageURL,
        },
      },
    });
  }

  return addToWallet;
}
