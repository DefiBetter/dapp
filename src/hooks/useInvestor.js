import { useContractRead, useNetwork } from "wagmi";
import { contractAddresses } from "../static/contractAddresses";
import DBMTSaleABI from "../static/ABI/DBMTSaleABI.json";
import { useAccount } from "wagmi";

export default function useInvestor() {
  const { chain } = useNetwork();
  const { address } = useAccount;

  const { data } = useContractRead({
    address: contractAddresses[chain?.network]?.dbmtToken,
    abi: DBMTSaleABI,
    functionName: "investors",
    args: [address],
  });

  return data;
}
