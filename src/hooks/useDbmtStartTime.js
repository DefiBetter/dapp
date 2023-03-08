import { useContractRead, useNetwork } from "wagmi";
import { contractAddresses } from "../static/contractAddresses";
import DBMTSaleABI from "../static/ABI/DBMTSaleABI.json";

export default function useDbmtStartTime() {
  const { chain } = useNetwork();

  const { data } = useContractRead({
    address: contractAddresses[chain?.network]?.dbmtSale,
    abi: DBMTSaleABI,
    functionName: "discountStartTimestamp",
  });

  return data ? Number(data) : null;
}
