import IERC20MetadataABI from "../static/ABI/IERC20MetadataABI.json";
import { useContractRead } from "wagmi";

export default function useVaultPerformance(currentVault) {
  const { data } = useContractRead({
    address: currentVault,
    abi: IERC20MetadataABI,
    functionName: "getVaultPerformance",
    watch: true,
  });

  return data ? data : null;
}
