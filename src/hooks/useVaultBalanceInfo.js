import StrategyVaultABI from "../static/ABI/StrategyVaultABI.json";
import { useContractRead } from "wagmi";

export default function useVaultBalanceInfo(vaultAddress) {
  const { data } = useContractRead({
    address: vaultAddress,
    abi: StrategyVaultABI,
    functionName: "getVaultBalanceInfo",
    watch: true,
  });

  return data;
}
