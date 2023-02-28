import DeFiBetterV1ABI from "../static/ABI/DeFiBetterV1ABI.json";
import { useContractRead, useNetwork } from "wagmi";
import { contractAddresses } from "../static/contractAddresses";

export default function useInstrumentBySelector(
  instrumentSelector,
  onSuccessCallback
) {
  const { chain } = useNetwork();

  const { isFetching, refetch } = useContractRead({
    address: contractAddresses[chain?.network]?.better,
    abi: DeFiBetterV1ABI,
    args: [instrumentSelector],
    functionName: "getInstrumentBySelector",
    onSuccess(data) {
      onSuccessCallback(data);
    },
    watch: false,
  });

  return { isFetching, refetch };
}
