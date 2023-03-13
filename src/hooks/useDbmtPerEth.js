import { useContractRead, useNetwork } from "wagmi";
import { contractAddresses } from "../static/contractAddresses";
import DBMTSaleABI from "../static/ABI/DBMTSaleABI.json";
import { ethers } from "ethers";

export default function useDbmtPerEth(buyAmount, onSuccessCallback) {
  const { chain } = useNetwork();

  useContractRead({
    address: contractAddresses[chain?.network]?.dbmtSale,
    abi: DBMTSaleABI,
    enabled: Number(buyAmount) > 0,
    args: [ethers.utils.parseEther(buyAmount)],
    functionName: "getTokenPerEth",
    onSuccess(data) {
      onSuccessCallback(ethers.utils.formatEther(data));
    },
  });
}
