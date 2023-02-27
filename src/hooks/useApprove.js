import IERC20MetadataABI from "../static/ABI/IERC20MetadataABI.json";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { ethers } from "ethers";

export default function useApprove(token, contractAddress) {
  const preparation = usePrepareContractWrite({
    address: token,
    abi: IERC20MetadataABI,
    functionName: "approve",
    args: [contractAddress, ethers.constants.MaxUint256.sub("1").toString()],
  });

  const transaction = useContractWrite(preparation.config);
  const confirmation = useWaitForTransaction({
    confirmations: 2,
    hash: transaction.data?.hash,
    onSuccess() {
      // TODO: Add toast
    },
    onError(error) {
      // TODO: Add toast
    },
  });
  return { confirmation, transaction };
}
