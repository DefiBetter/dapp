import {
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import BtStakingABI from "../static/ABI/BtStakingABI.json";
import { contractAddresses } from "../static/contractAddresses";

export default function useClaimBT(onSuccessCallback) {
  const { chain } = useNetwork();

  const preparation = usePrepareContractWrite({
    address: contractAddresses[chain?.network]?.btStaking,
    abi: BtStakingABI,
    functionName: "claim",
  });

  const transaction = useContractWrite(preparation.config);
  const confirmation = useWaitForTransaction({
    confirmations: 2,
    hash: transaction.data?.hash,
    onSuccess() {
      // TODO: Add toast
      onSuccessCallback();
    },
    onError(error) {
      // TODO: Add toast
    },
  });
  return { confirmation, transaction };
}
