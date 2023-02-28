import IERC20MetadataABI from "../static/ABI/IERC20MetadataABI.json";
import { useContractRead } from "wagmi";

export default function useVaultName(currentVault) {
  const { data } = useContractRead({
    address: currentVault,
    abi: IERC20MetadataABI,
    functionName: "name",
    watch: false,
  });

  return data ? data : "";
}
