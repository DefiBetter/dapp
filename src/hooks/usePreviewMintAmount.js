import { ethers } from "ethers";
import StrategyVaultABI from "../static/ABI/StrategyVaultABI.json";
import { useContractRead } from "wagmi";

export default function usePreviewMintAmount(vaultAddress, mintAmount) {
  const { data } = useContractRead({
    address: vaultAddress,
    abi: StrategyVaultABI,
    functionName: "previewDeposit",
    args: [ethers.utils.parseEther(mintAmount.toString())],
    watch: true,
    keepPreviousData: true,
    select: (data) => ethers.utils.formatEther(data),
  });

  return data ? data : 0;
}
