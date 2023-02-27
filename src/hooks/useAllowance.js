import IERC20MetadataABI from "../static/ABI/IERC20MetadataABI.json";
import { useAccount, useContractRead } from "wagmi";

export default function useAllowance(tokenAddress, contractAddress) {
  const { address } = useAccount();

  const { data } = useContractRead({
    address: tokenAddress,
    abi: IERC20MetadataABI,
    functionName: "allowance",
    args: [address, contractAddress],
    select: (data) => Number(data),
    watch: true,
  });

  return data ? data : 0;
}
