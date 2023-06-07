import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { ethers } from "ethers";
import LpStakingABI from "../static/ABI/LpStakingABI.json";
import { contractAddresses } from "../static/contractAddresses";
import { ToastStatus, useToast } from "../context/ToastContext";

export default function useStakeLP(poolId, lpAmount, onSuccessCallback) {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const toastContext = useToast();

  const preparation = usePrepareContractWrite({
    address: contractAddresses[chain?.network]?.lpStaking,
    abi: LpStakingABI,
    functionName: "stake",
    args: [poolId, ethers.utils.parseEther(lpAmount.toString()), address],
    onError(err) {
      console.log(err)
    }
  });

  const transaction = useContractWrite(preparation.config);
  const confirmation = useWaitForTransaction({
    confirmations: 2,
    hash: transaction.data?.hash,
    onError(error) {
      console.error(error);
      toastContext.addToast(
        ToastStatus.Failed,
        "Failed to stake LP",
        transaction.data?.hash
      );
    },
    onSuccess() {
      toastContext.addToast(
        ToastStatus.Success,
        "Successfully staked LP",
        transaction.data?.hash
      );
      onSuccessCallback();
    },
  });
  return { confirmation, transaction };
}
