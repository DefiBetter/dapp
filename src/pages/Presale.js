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
    <Container>
      <InnerContainer>
        <Card>
          <FancyTitle word1={"Pre"} word2={"Sale"} />
        </Card>
        <Card>
          <Grid>
            <GridRow>
              <GridCol>Presale Price</GridCol>
              <GridCol>100$</GridCol>
            </GridRow>
            <GridRow>
              <GridCol>Amount</GridCol>
              <GridCol>
                <BlueBorder></BlueBorder>100
              </GridCol>
            </GridRow>
            <GridRow>
              <GridCol>Buy</GridCol>
            </GridRow>
          </Grid>
        </Card>
      </InnerContainer>
    </Container>
  );
}

export default PublicSale;
