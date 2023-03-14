import { useContractRead, useNetwork } from "wagmi";
import { contractAddresses } from "../static/contractAddresses";
import DBMTSaleABI from "../static/ABI/DBMTSaleABI.json";
import { ethers } from "ethers";

export default function useEthPerDbmt(buyAmount) {
  const { chain } = useNetwork();

  const { data } = useContractRead({
    address: contractAddresses[chain?.network]?.dbmtSale,
    abi: DBMTSaleABI,
    enabled: buyAmount && Number(buyAmount) > 0,
    args: [
      buyAmount && Number(buyAmount) > 0
        ? ethers.utils.parseEther(buyAmount)
        : "0",
    ],
    functionName: "getETHperToken",
    select: (data) => ethers.utils.formatEther(data),
  });

  return data;
}