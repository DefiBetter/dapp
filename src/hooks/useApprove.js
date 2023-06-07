import IERC20MetadataABI from "../static/ABI/IERC20MetadataABI.json";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { ethers } from "ethers";
import { useToast } from "../context/ToastContext";
import { ToastStatus } from "../context/ToastContext";

export default function useApprove(token, contractAddress) {
  const toastContext = useToast();

  const preparation = usePrepareContractWrite({
    address: token,
    abi: IERC20MetadataABI,
    functionName: "approve",
    args: [contractAddress, ethers.constants.MaxUint256.sub("1").toString()],
    onError(error) {
      console.error(error);
    },
  });

  const transaction = useContractWrite(preparation.config);
  const confirmation = useWaitForTransaction({
    confirmations: 2,
    hash: transaction.data?.hash,
    onSuccess() {
      toastContext.addToast(
        ToastStatus.Success,
        "Successfully approved",
        transaction.data?.hash
      );
    },
    onError(error) {
      console.error(error);
      toastContext.addToast(
        ToastStatus.Failed,
        "Failed to approve",
        transaction.data?.hash
      );
    },
  });
  return { preparation, confirmation, transaction };
}
