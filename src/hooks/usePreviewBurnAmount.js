import { ethers } from "ethers";
import StrategyVaultABI from "../static/ABI/StrategyVaultABI.json";
import { useContractRead } from "wagmi";

export default function usePreviewBurnAmount(vaultAddress, burnAmount) {
  const { data } = useContractRead({
    address: vaultAddress,
    abi: StrategyVaultABI,
    functionName: "previewWithdraw",
    args: [ethers.utils.parseEther(burnAmount.toString())],
    watch: true,
    keepPreviousData: true,
    select: (data) => ethers.utils.formatEther(data),
  });

  return data ? data : 0;
}
