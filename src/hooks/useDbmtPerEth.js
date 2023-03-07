import { useContractRead, useNetwork } from "wagmi";
import { contractAddresses } from "../static/contractAddresses";
// import DBMTSaleABI from "../static/ABI/DBMTSaleABI.json";
import { ethers } from "ethers";

export default function useDbmtPerEth(buyAmount) {
  const { chain } = useNetwork();

  const { data } = useContractRead({
    address: contractAddresses[chain?.network]?.dbmtSale,
    abi: {},
    enabled: buyAmount > 0,
    args: [ethers.utils.parseEther(buyAmount)],
    functionName: "getTokenPerEth",
  });

  return data ? ethers.utils.formatEther(data) : 0;
}
