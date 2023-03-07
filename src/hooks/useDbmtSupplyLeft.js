import { useContractRead, useNetwork } from "wagmi";
import { contractAddresses } from "../static/contractAddresses";
import { ethers } from "ethers";
import IERC20MetadataABI from "../static/ABI/IERC20MetadataABI.json";

export default function useDbmtSupplyLeft() {
  const { chain } = useNetwork();

  const { data } = useContractRead({
    address: contractAddresses[chain?.network]?.dbmtToken,
    abi: IERC20MetadataABI,
    functionName: "balanceOf",
    args: [contractAddresses[chain?.network]?.dbmtSale],
    watch: true,
  });

  return data ? ethers.utils.formatEther(data) : 0;
}
