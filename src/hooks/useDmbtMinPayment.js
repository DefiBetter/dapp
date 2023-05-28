import { useContractRead, useNetwork } from "wagmi";
import { contractAddresses } from "../static/contractAddresses";
import ReferralSaleABI from "../static/ABI/ReferralSaleABI.json";
import { ethers } from "ethers";

export default function useDmbtMinPayment() {
  const { chain } = useNetwork();

  const { data } = useContractRead({
    address: contractAddresses[chain?.network]?.dbmtSale,
    abi: ReferralSaleABI,
    functionName: "minPayment",
    select: (data) => ethers.utils.formatEther(data)
  });

  return data ? Number(data) : 0;
}
