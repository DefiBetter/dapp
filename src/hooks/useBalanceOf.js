import IERC20MetadataABI from "../static/ABI/IERC20MetadataABI.json";
import { useAccount, useContractRead } from "wagmi";
import { ethers } from "ethers";

export default function useBalanceOf(contractAddress, balanceOf) {
  const { address } = useAccount();
 

  const { data } = useContractRead({
    address: contractAddress,
    abi: IERC20MetadataABI,
    functionName: "balanceOf",
    args: [balanceOf ? balanceOf : address],
    select: (data) => ethers.utils.formatEther(data),
    watch: true,
  });
  return data ? data : 0;
}
