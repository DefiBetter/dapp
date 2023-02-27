import { contractAddresses } from "../static/contractAddresses";
import IERC20MetadataABI from "../static/ABI/IERC20MetadataABI.json";
import { useAccount, useContractRead, useNetwork } from "wagmi";

export default function useAllowance(contractAddress) {
  const { chain } = useNetwork();
  const { address } = useAccount();

  const { data } = useContractRead({
    address: contractAddresses[chain?.network]?.lpToken,
    abi: IERC20MetadataABI,
    functionName: "allowance",
    args: [address, contractAddress],
    select: (data) => Number(data),
    watch: true,
  });

  return data ? data : 0;
}
