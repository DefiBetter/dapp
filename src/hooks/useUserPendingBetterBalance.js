import DeFiBetterV1ABI from "../static/ABI/DeFiBetterV1ABI.json";
import { useAccount, useContractRead, useNetwork } from "wagmi";
import { contractAddresses } from "../static/contractAddresses";
import { ethers } from "ethers";

export default function useUserPendingBetterBalance(customGainFee) {
  const { chain } = useNetwork();
  const { address } = useAccount();

  const { data } = useContractRead({
    address: contractAddresses[chain?.network]?.better,
    abi: DeFiBetterV1ABI,
    functionName: "getUserPendingBetterBalance",
    args: [address, customGainFee],
    watch: true,
  });

  return data ? ethers.utils.formatEther(data) : 0;
}
