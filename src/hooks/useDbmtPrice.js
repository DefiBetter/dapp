import { useContractRead, useNetwork } from "wagmi";
import { contractAddresses } from "../static/contractAddresses";
import DBMTSaleABI from "../static/ABI/DBMTSaleABI.json";
import { ethers } from "ethers";

export default function useDbmtPrice() {
  const { chain } = useNetwork();

  const { data: basePrice } = useContractRead({
    address: contractAddresses[chain?.network]?.dbmtSale,
    abi: DBMTSaleABI  ,
    functionName: "BASE_PRICE_IN_WEI",
    select: (data) => Number(ethers.utils.formatEther(data)),
    watch: false,
  });

  const { data: currentPrice } = useContractRead({
    address: contractAddresses[chain?.network]?.dbmtSale,
    abi: DBMTSaleABI,
    functionName: "getETHperToken",
    args: [ethers.utils.parseEther('1')],
    select: (data) => Number(ethers.utils.formatEther(data)),
    watch: false,
  });

  return {
    basePrice,
    currentPrice
  };
}
