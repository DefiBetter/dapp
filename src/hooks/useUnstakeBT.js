import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { ethers } from "ethers";
import BtStakingABI from "../static/ABI/BtStakingABI.json";
import { contractAddresses } from "../static/contractAddresses";
import { ToastStatus, useToast } from "../context/ToastContext";

export default function useUnstakeBT(btAmount, onSuccessCallback) {
  const { chain } = useNetwork();
  const toastContext = useToast();

  const preparation = usePrepareContractWrite({
    address: contractAddresses[chain?.network]?.btStaking,
    abi: BtStakingABI,
    functionName: "unstake",
    args: [ethers.utils.parseEther(btAmount.toString())],
  });

  const transaction = useContractWrite(preparation.config);
  const confirmation = useWaitForTransaction({
    confirmations: 2,
    hash: transaction.data?.hash,
    onError(error) {
      console.error(error);
      toastContext.addToast(
        ToastStatus.Failed,
        "Failed to unstake BT",
        transaction.data?.hash
      );
    },
    onSuccess() {
      toastContext.addToast(
        ToastStatus.Success,
        "Successfuly staked BT",
        transaction.data?.hash
      );
      onSuccessCallback();
    },
  });
  return { confirmation, transaction };
}
