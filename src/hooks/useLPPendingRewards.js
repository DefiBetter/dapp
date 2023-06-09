import LpStakingABI from "../static/ABI/LpStakingABI.json";
import { useAccount, useContractRead, useNetwork } from "wagmi";
import { ethers } from "ethers";
import { contractAddresses } from "../static/contractAddresses";

export default function useLPPendingRewards(poolId, userStaked) {
  const { address } = useAccount();
  const { chain } = useNetwork();

  const { data } = useContractRead({
    address: contractAddresses[chain?.network]?.lpStaking,
    abi: LpStakingABI,
    functionName: "getPendingRewards",
    enabled: userStaked > 0,
    args: [address, poolId],
    select: (data) => ethers.utils.formatEther(data),
    watch: true,
  });

  return data ? data : 0;
}
