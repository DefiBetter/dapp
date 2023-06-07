import { ethers } from "ethers";
import StrategyVaultABI from "../static/ABI/StrategyVaultABI.json";
import { useContractRead } from "wagmi";

export default function useSharePrice(currentVault) {
  const { data } = useContractRead({
    address: currentVault,
    abi: StrategyVaultABI,
    functionName: "getVaultPerformance",
    select: (data) => ethers.utils.formatEther(data),
  });

  return data;
}
