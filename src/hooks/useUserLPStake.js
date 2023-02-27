import LpStakingABI from "../static/ABI/LpStakingABI.json";
import { useAccount, useContractRead, useNetwork } from "wagmi";
import { ethers } from "ethers";
import { contractAddresses } from "../static/contractAddresses";

export default function useUserLPStake(poolId) {
  const { address } = useAccount();
  const { chain } = useNetwork();

  const { data } = useContractRead({
    address: contractAddresses[chain?.network]?.lpStaking,
    abi: LpStakingABI,
    functionName: "getUserStake",
    args: [address, poolId],
    select: (data) => ethers.utils.formatEther(data.staked),
    watch: true,
  });

  return data ? data : 0;
}
