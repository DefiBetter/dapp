import { useContractRead, useNetwork } from "wagmi";
import { contractAddresses } from "../static/contractAddresses";
// import DBMTSaleABI from "../static/ABI/DBMTSaleABI.json";

export default function useDbmtPrice() {
  const { chain } = useNetwork();

  const { data } = useContractRead({
    address: contractAddresses[chain?.network]?.dbmtSale,
    abi: {},
    functionName: "BASE_PRICE_IN_DOLLAR",
  });

  return data ? Number(data) : 0;
}
