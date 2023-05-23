import { useContractRead, useNetwork } from "wagmi";
import { contractAddresses } from "../static/contractAddresses";
import ReferralSaleABI from "../static/ABI/ReferralSaleABI.json";

export default function useDbmtStartTime() {
  const { chain } = useNetwork();

  const { data } = useContractRead({
    address: contractAddresses[chain?.network]?.dbmtSale,
    abi: ReferralSaleABI,
    functionName: "discountStartTimestamp",
  });

  return data ? Number(data) : null;
}
