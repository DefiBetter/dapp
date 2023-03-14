import IERC20MetadataABI from "../static/ABI/IERC20MetadataABI.json";
import {  useContractRead } from "wagmi";

export default function useSymbol(tokenAddress) {

  const { data } = useContractRead({
    address: tokenAddress,
    abi: IERC20MetadataABI,
    functionName: "symbol",
  });

  return data;
}
