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
  });

  const { data: priceMulti } = useContractRead({
    address: contractAddresses[chain?.network]?.dbmtSale,
    abi: DBMTSaleABI,
    functionName: "priceMulti",
    select: (data) => Number(data),
  });

  return {
    basePrice: basePrice,
    currentPrice: (basePrice * priceMulti) / 10_000,
  };
}
