import BtStakingABI from "../static/ABI/BtStakingABI.json";
import { useAccount, useContractRead, useNetwork } from "wagmi";
import { ethers } from "ethers";
import { contractAddresses } from "../static/contractAddresses";

export default function useUserBTStake() {
  const { address } = useAccount();
  const { chain } = useNetwork();

  const { data } = useContractRead({
    address: contractAddresses[chain?.network]?.btStaking,
    abi: BtStakingABI,
    functionName: "getStaked",
    args: [address],
    select: (data) => ethers.utils.formatEther(data),
    watch: true,
  });

  return data ? data : 0;
}
