import { ethers } from "ethers";
import StrategyVaultABI from "../static/ABI/StrategyVaultABI.json";
import { useAccount, useContractRead } from "wagmi";

export default function usePreviewBurnAmount(vaultAddress, burnAmount, isFromInput) {
  const { data } = useContractRead({
    address: vaultAddress,
    abi: StrategyVaultABI,
    functionName: "previewWithdraw",
    args: [ethers.utils.parseEther(burnAmount.toString())],
    watch: true,
    select: (data) => ethers.utils.formatEther(data),
  });

  return data;
}
