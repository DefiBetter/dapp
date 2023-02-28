import DeFiBetterV1ABI from "../static/ABI/DeFiBetterV1ABI.json";
import { useAccount, useContractRead, useNetwork } from "wagmi";
import { contractAddresses } from "../static/contractAddresses";

export default function useUserPositionValueForInstrument(
  instrument,
  binAmountList
) {
  const { chain } = useNetwork();
  const { address } = useAccount();

  const { data } = useContractRead({
    address: contractAddresses[chain?.network]?.better,
    abi: DeFiBetterV1ABI,
    functionName: "getUserPositionValueForInstrument",
    args: [
      address,
      instrument?.selector,
      instrument?.epoch,
      10000,
      10000,
      binAmountList,
    ],
    watch: true,
  });
  return data;
}
