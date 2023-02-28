import DeFiBetterV1ABI from "../static/ABI/DeFiBetterV1ABI.json";
import { useContractRead, useNetwork } from "wagmi";
import { contractAddresses } from "../static/contractAddresses";

export default function useRewardPeriodInfo() {
  const { chain } = useNetwork();

  const { data } = useContractRead({
    address: contractAddresses[chain?.network]?.better,
    abi: DeFiBetterV1ABI,
    functionName: "rewardPeriodInfo",
    watch: true,
  });

  return data;
}
