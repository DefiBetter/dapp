import { useContractRead, useNetwork } from "wagmi";
import { contractAddresses } from "../static/contractAddresses";
import DBMTSaleABI from "../static/ABI/DBMTSaleABI.json";
import { useAccount } from "wagmi";

export default function useInvestorData() {
  const { chain } = useNetwork();
  const { address } = useAccount;

  const { data } = useContractRead({
    address: contractAddresses[chain?.network]?.dbmtToken,
    abi: DBMTSaleABI,
    functionName: "getInvestorData",
    args: [address],
  });

  return data;
}
