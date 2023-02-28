import DeFiBetterV1ABI from "../static/ABI/DeFiBetterV1ABI.json";
import { useAccount, useContractRead, useNetwork } from "wagmi";
import { contractAddresses } from "../static/contractAddresses";

export default function useUserGainsInfo() {
  const { chain } = useNetwork();
  const { address } = useAccount();

  const { data } = useContractRead({
    address: contractAddresses[chain?.network]?.better,
    abi: DeFiBetterV1ABI,
    functionName: "getUserGainsInfo",
    args: [address],
    watch: true,
  });

  return data;
}
