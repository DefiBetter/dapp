import {
  useContractRead,
  usePrepareContractWrite,
  useContractWrite,
  erc20ABI,
  useWaitForTransaction,
  useAccount,
  useNetwork,
} from "wagmi";
import { useCallback, useState } from "react";
import { InputNumber } from "../components/common/Input";

import DutchAuctionABI from "../static/ABI/DutchAuctionABI.json";
import IERC20MetadataABI from "../static/ABI/IERC20MetadataABI.json";
import { contractAddresses } from "../static/contractAddresses";
import { ethers } from "ethers";
import {
  Container,
  InnerContainer,
} from "../components/common/container/Container";
import AppContainer from "../components/common/container/AppContainer";
import Navbar from "../components/Navbar/Navbar";
import { Card } from "../components/common/Card";
import FancyTitle from "../components/common/Title";
import { Grid, GridCol, GridRow } from "../components/common/Grid";
import { BlueBorder } from "../components/common/Border";

function PublicSale() {
  const { address: connectedAddress, isConnected } = useAccount();
  const { activeChain } = useNetwork();

  // const etherAddress = contractAddresses.etherAddress;
  // const BN = ethers.BigNumber.from;

  // function isNumeric(n) {
  //   return !isNaN(parseFloat(n)) && isFinite(n);
  // }

  // function min(a, b) {
  //   return a.gt(b) ? b : a;
  // }

  // TODO input 0.1 crashes -> define data type probs
  // function parseInput(i) {
  //   if (etherAddress === paymentTokenAddress)
  //     return ethers.utils.parseEther(!isNumeric(i) ? "0" : i);
  //   else {
  //     return !isNumeric(i) || !paymentTokenDecimals
  //       ? BN(0)
  //       : BN(i).mul(BN(10).pow(paymentTokenDecimals || 0));
  //   }
  // }

  /*  
    const { address: connectedAddress, isConnected } = useAccount();
    const { chain: activeChain } = useNetwork(); */

  // const presaleContractConfig = {
  //   addressOrName: contractAddresses[activeChain?.network]?.presale,
  //   contractInterface: DutchAuctionABI,
  // };

  // const [input, setInput] = useState("");
  // const [output, setOutput] = useState("0");

  // ---fetch constants-------------------------------------------------------------------------------

  // fetching payment token address
  // let { data: paymentTokenAddress } = useContractRead({
  //   ...presaleContractConfig,
  //   functionName: "paymentToken",
  // });

  // fetching reward token address
  // let { data: rewardTokenAddress } = useContractRead({
  //   ...presaleContractConfig,
  //   functionName: "rewardToken",
  // });

  // fetching reward token decimals
  // const { data: rewardTokenDecimals } = useContractRead({
  //   addressOrName: rewardTokenAddress,
  //   contractInterface: IERC20MetadataABI,
  //   functionName: "decimals",
  // });

  // fetching payment token decimals
  // const { data: paymentTokenDecimals } = useContractRead({
  //   addressOrName: paymentTokenAddress,
  //   contractInterface: IERC20MetadataABI,
  //   functionName: "decimals",
  // });

  // ---watch variables-----------------------------------------------------------------------------

  // fetching payment token allowance
  // const { data: paymentTokenAllowance } = useContractRead({
  //   addressOrName: paymentTokenAddress,
  //   contractInterface: erc20ABI,
  //   functionName: "allowance",
  //   args: [connectedAddress, presaleContractConfig.addressOrName],
  //   watch: true,
  // });

  // fetching reward token balance
  // const { data: rewardTokenBalance } = useContractRead({
  //   addressOrName: rewardTokenAddress,
  //   contractInterface: erc20ABI,
  //   functionName: "balanceOf",
  //   args: connectedAddress,
  //   watch: true,
  // });

  // fetching output estimate
  // let { isError: isErrorOutputEstimate, refetch: refetchOutputEstimate } =
  //   useContractRead({
  //     ...presaleContractConfig,
  //     functionName: "estimateOutput",
  //     args: parseInput(input),
  //     watch: true,
  //     onSuccess(data) {
  //       // TODO account for decimals of reward token
  //       setOutput(ethers.utils.formatEther(data));
  //     },
  //     onError(error) {
  //       setOutput(error);
  //     },
  //   });

  // ---contract writes-----------------------------------------------------------------------------

  // sending approval for payment token
  // const { config: prepareWriteConfigApprove } = usePrepareContractWrite({
  //   addressOrName: paymentTokenAddress,
  //   contractInterface: erc20ABI,
  //   functionName: "approve",
  //   args: [
  //     //spender
  //     presaleContractConfig.addressOrName,
  //     //value
  //     parseInput(input),
  //   ],
  // });

  // const {
  //   data: approvalTx,
  //   isLoading: settingAllowance,
  //   write: executeApprovePaymentToken,
  // } = useContractWrite(prepareWriteConfigApprove);

  // buy into the presale
  // TODO add buyWithPermit support (automatically try to buy with permit, if not supported fall back to normal one)
  // const { config: prepareWriteConfigBuy } = usePrepareContractWrite({
  //   ...presaleContractConfig,
  //   functionName: "buy",
  //   args:
  //     paymentTokenAddress === etherAddress
  //       ? [0]
  //       : [min(parseInput(input), paymentTokenAllowance || 0)],
  //   overrides: {
  //     value: paymentTokenAddress === etherAddress ? parseInput(input) : 0,
  //   },
  // });
  // const { write: executeBuy } = useContractWrite(prepareWriteConfigBuy);

  // useWaitForTransaction({
  //   hash: approvalTx?.hash,
  //   onSuccess(data) {
  //     executeBuy?.({
  //       recklesslySetUnpreparedArgs:
  //         paymentTokenAddress === etherAddress
  //           ? [0]
  //           : [
  //               ethers.utils
  //                 .parseEther(!isNumeric(input) ? "0" : input)
  //                 .toString(),
  //             ],
  //       recklesslySetUnpreparedOverrides: {
  //         value:
  //           paymentTokenAddress === etherAddress
  //             ? ethers.utils
  //                 .parseEther(!isNumeric(input) ? "0" : input)
  //                 .toString()
  //             : 0,
  //       },
  //     });
  //   },
  // });

  // ---callbacks---------------------------------------------------------------------------------

  // const getPaymentTokenAllowance = useCallback(
  //   () => ethers.utils.formatUnits(paymentTokenAllowance, paymentTokenDecimals),
  //   [paymentTokenAllowance, paymentTokenDecimals]
  // );

  // const getRewardTokenBalance = useCallback(
  //   () => ethers.utils.formatUnits(rewardTokenBalance, rewardTokenDecimals),
  //   [rewardTokenBalance, rewardTokenDecimals]
  // );

  // ------------------------------------------------------------------------------------------

  // const buyingTargetChanged = (e) => {
  //   setInput(e.target.value);
  //   refetchOutputEstimate?.();
  // };

  // ---visibility-----------------------------------------------------------------------------

  /* const buyingDisabled = () => {
      return isBuying || parseInput(input)?.lte(0) || settingAllowance || (
        (paymentTokenAddress !== etherAddress) && parseInput(input)?.gt(paymentTokenAllowance || 0)
      )
    } */

  // const allowingDisabled = () => {
  //   return (
  //     paymentTokenAddress === etherAddress ||
  //     settingAllowance ||
  //     parseInput(input)?.lte(paymentTokenAllowance) ||
  //     parseInput(input)?.lte(0)
  //   );
  // };

  // ---functionality---------------------------------------------------------------------------

  // const allowFunction = (e) => {
  //   e.preventDefault();
  //   if (parseInput(input)?.gt(0)) {
  //     executeApprovePaymentToken?.();
  //   }
  // };

  /* const buyFunction = useCallback((e) => {
  
      e.preventDefault();
      // TODO account for decimals correctly
      executeBuy?.({
        recklesslySetUnpreparedArgs:
          paymentTokenAddress === etherAddress
          ? [0]
          : [ethers.utils.parseEther(!isNumeric(input) ? "0" : input).toString()],
        recklesslySetUnpreparedOverrides: {
          value: 
            paymentTokenAddress === etherAddress
            ? ethers.utils.parseEther(!isNumeric(input) ? "0" : input).toString()
            : 0
        }
      });
    }, [input, paymentTokenAddress, executeBuy, etherAddress]); */

  // ------------------------------------------------------------------------------------------

  return (
    <div className="relative bg-db-background border-[3px] border-db-cyan-process h-full p-2 md:p-0">
      <div className="shadow-db m-auto w-full md:w-1/2 mt-5 bg-white border-2 border-db-cyan-process rounded-2xl p-4">
        <div className="flex justify-center text-5xl">
          Pre
          <span className="font-bold mt-7 font-fancy text-5xl text-db-cyan-process">
            Sale
          </span>
        </div>
      </div>

      <div className="relative z-10 flex flex-col shadow-db m-auto w-full md:w-1/2 mt-5 bg-white border-2 border-db-cyan-process rounded-2xl p-4">
        <div className="flex justify-center gap-10 items-center">
          <div className="shadow-db px-10 text-center bg-db-french-sky p-3 border-[1px] border-black rounded-lg">
            <span className="font-bold">Current Price</span>
          </div>
          <div>100 WETH/BT</div>
        </div>
        <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="w-full md:w-1/2 flex items-center">
            <div className="flex-1 shadow-db text-center font-bold bg-db-french-sky p-3 border-[1px] border-black rounded-lg">
              Time Left
            </div>
            <div className="flex-1 text-center">2:11:59:47</div>
          </div>
          <div className="w-full md:w-1/2 flex items-center">
            <div className="flex-1 shadow-db text-center font-bold bg-db-french-sky p-3 border-[1px] border-black rounded-lg">
              Supply Left
            </div>
            <div className="flex-1 text-center">11.50</div>
          </div>
        </div>

        <div className="mt-3 flex items-center w-full">
          <div className="font-fancy text-db-cyan-process w-24 text-center text-xl pt-1">
            buy
          </div>
          <div className="w-full flex items-center p-2 justify-center bg-db-background rounded-lg shadow-db">
            <input
              //onChange={props.onChange}
              type={"number"}
              min={0}
              placeholder="Amount"
              //value={props.value}
              //max={props.max}
              className="text-black text-sm flex-1"
            />

            <div className="text-black font-bold w-12 text-center">BT</div>
          </div>
        </div>
        <div className="mt-3 flex items-center w-full">
          <div className="font-fancy text-db-cyan-process w-24 text-center text-xl pt-1">
            for
          </div>
          <div className="w-full flex items-center p-2 justify-center bg-db-background rounded-lg shadow-db">
            <div className="text-black text-sm flex-1" />

            <div className="text-black font-bold w-12 text-center">WETH</div>
          </div>
        </div>
        <button className="mt-3 border-[1px] border-black shadow-db pt-1 font-fancy bg-db-cyan-process h-10 w-full rounded-lg text-lg text-white hover:bg-db-blue-200">
          Buy
        </button>
      </div>
      <div className="z-0 absolute h-60 bottom-10 left-[13%]">
        <img
          alt="faucet"
          className="h-full z-0"
          src={require("../static/image/open-vault-clipart.svg").default}
        ></img>
      </div>
    </div>
  );
}

export default PublicSale;
