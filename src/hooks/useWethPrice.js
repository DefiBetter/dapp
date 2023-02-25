import { useAccount, useContractRead, useNetwork } from "wagmi";
import { contractAddresses } from "../static/contractAddresses";
import AggregatorV3InterfaceABI from "../static/ABI/AggregatorV3InterfaceABI.json";
import { useState } from "react";

const useWethPrice = () => {
  const { chain: activeChain } = useNetwork();

  const [decimals, setDecimals] = useState(0);
  const [wethPrice, setWethPrice] = useState(0);

  // aggregator config
  const aggregatorContractConfig = {
    address: contractAddresses[activeChain?.network]?.WETH,
    abi: AggregatorV3InterfaceABI,
  };

  console.log(
    "contractAddresses[activeChain?.network]?.WETH",
    contractAddresses[activeChain?.network]
  );

  useContractRead({
    ...aggregatorContractConfig,
    functionName: "decimals",
    onSuccess(data) {
      setDecimals(+data);
    },
    watch: true,
  });

  useContractRead({
    ...aggregatorContractConfig,
    functionName: "latestRoundData",
    onError(data) {},
    onSuccess(data) {
      setWethPrice(+data.answer / 10 ** decimals);
    },
    watch: true,
  });

  return wethPrice;
};

export default useWethPrice;
