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

export default function useUnstakeLP(poolId, lpAmount, onSuccessCallback) {
  const { chain } = useNetwork();

  const preparation = usePrepareContractWrite({
    address: contractAddresses[chain?.network]?.lpStaking,
    abi: LpStakingABI,
    functionName: "unstake",
    args: [poolId, ethers.utils.parseEther(lpAmount.toString())],
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
