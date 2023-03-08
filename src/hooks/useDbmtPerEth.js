import { useContractRead, useNetwork } from "wagmi";
import { contractAddresses } from "../static/contractAddresses";
import DBMTSaleABI from "../static/ABI/DBMTSaleABI.json";
import { ethers } from "ethers";

export default function useDbmtPerEth(buyAmount) {
  const { chain } = useNetwork();

  const { data } = useContractRead({
    address: contractAddresses[chain?.network]?.dbmtSale,
    abi: DBMTSaleABI,
    enabled: buyAmount > 0,
    args: [ethers.utils.parseEther(buyAmount)],
    functionName: "getTokenPerEth",
  });

  console.log("buyAmount = " + ethers.utils.parseEther(buyAmount));
  console.log("useDbmtPerEth = " + data);
  return data ? ethers.utils.formatEther(data) : 0;
}
