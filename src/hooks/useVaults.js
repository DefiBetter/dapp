import StrategyVaultManagerABI from "../static/ABI/StrategyVaultManagerABI.json";
import { useContractRead } from "wagmi";

export default function useVaults(vaultAddress, onSuccessCallback) {
  const { data } = useContractRead({
    address: vaultAddress,
    abi: StrategyVaultManagerABI,
    functionName: "getVaults",
    watch: false,
    onSuccess(data) {
      onSuccessCallback(data);
    },
  });

  return data ? data : [];
}
