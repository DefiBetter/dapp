import DeFiBetterV1ABI from "../static/ABI/DeFiBetterV1ABI.json";
import { useContractRead, useNetwork } from "wagmi";
import { contractAddresses } from "../static/contractAddresses";

export default function useEpochData(instrument, onSuccessCallback) {
  const { chain } = useNetwork();

  useContractRead({
    address: contractAddresses[chain?.network]?.better,
    abi: DeFiBetterV1ABI,
    functionName: "getEpochData",
    args: [instrument?.epoch, instrument?.selector],
    onSuccess(data) {
      onSuccessCallback(data);
    },
    watch: true,
  });
}
