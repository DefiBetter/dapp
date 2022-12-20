import {
  useNetwork,
  useContractRead,
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  erc20ABI,
  useWaitForTransaction,
} from "wagmi";
import { useCallback, useState } from "react";

import DutchAuctionABI from "../static/ABI/DutchAuctionABI.json";
import IERC20MetadataABI from "../static/ABI/IERC20MetadataABI.json";
import { contractAddresses } from "../static/contractAddresses";
import { ethers } from "ethers";
import Navbar from "../components/Navbar/Navbar";

import styles from "./PublicSale.module.css";
import { AppContainer, Container } from "../components/common/Container";
import { Card } from "../components/common/Card";
import { Grid, GridCell, GridCell4, GridRow } from "../components/common/Grid";
import Button from "../components/common/Button";

function PublicSale() {
  const etherAddress = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
  const BN = ethers.BigNumber.from;

  function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  function min(a, b) {
    return a.gt(b) ? b : a;
  }

  // TODO input 0.1 crashes
  function parseInput(i) {
    return ethers.utils.parseUnits(i, paymentTokenDecimals);
  }

  const { address: connectedAddress, isConnected } = useAccount();
  const { chain } = useNetwork();

  const publicSaleContractConfig = {
    address: contractAddresses[chain?.network]?.publicSale,
    abi: DutchAuctionABI,
  };

  const [input, setInput] = useState("0");
  const [output, setOutput] = useState("0");

  // ---fetch constants-------------------------------------------------------------------------------

  // fetching payment token address
  let { data: paymentTokenAddress } = useContractRead({
    ...publicSaleContractConfig,
    functionName: "paymentToken",
  });

  // fetching reward token address
  let { data: rewardTokenAddress } = useContractRead({
    ...publicSaleContractConfig,
    functionName: "rewardToken",
  });

  // fetching reward token decimals
  const { data: rewardTokenDecimals } = useContractRead({
    ...publicSaleContractConfig,
    functionName: "decimals",
  });

  // fetching payment token decimals
  const { data: paymentTokenDecimals } = useContractRead({
    address: paymentTokenAddress,
    abi: IERC20MetadataABI,
    functionName: "decimals",
  });

  // ---watch variables-----------------------------------------------------------------------------

  // fetching payment token allowance
  const { data: paymentTokenAllowance } = useContractRead({
    address: paymentTokenAddress,
    abi: erc20ABI,
    functionName: "allowance",
    args: [connectedAddress, publicSaleContractConfig.address],
    // watch: true,
  });

  // fetching reward token balance
  const { data: rewardTokenBalance } = useContractRead({
    address: rewardTokenAddress,
    abi: erc20ABI,
    functionName: "balanceOf",
    args: connectedAddress,
    // watch: true,
  });

  // fetching supply left
  const { data: supplyLeft } = useContractRead({
    address: rewardTokenAddress,
    abi: erc20ABI,
    functionName: "balanceOf",
    args: publicSaleContractConfig.address,
    // watch: true,
  });

  // fetching output estimate
  let { isError: isErrorOutputEstimate, refetch: refetchOutputEstimate } =
    useContractRead({
      ...publicSaleContractConfig,
      functionName: "estimateOutput",
      args: parseInput(input),
      // watch: true,
      onSuccess(data) {
        // TODO account for decimals of reward token
        setOutput(ethers.utils.formatEther(data));
      },
      onError(error) {
        setOutput(error);
      },
    });

  // ---contract writes-----------------------------------------------------------------------------

  // sending approval for payment token
  const { config: prepareWriteConfigApprove } = usePrepareContractWrite({
    address: paymentTokenAddress,
    abi: erc20ABI,
    functionName: "approve",
    args: [
      //spender
      publicSaleContractConfig.address,
      //value
      parseInput(input),
    ],
  });

  const {
    data: approvalTx,
    isLoading: settingAllowance,
    write: executeApprovePaymentToken,
  } = useContractWrite(prepareWriteConfigApprove);

  // buy into the presale
  // TODO add buyWithPermit support (automatically try to buy with permit, if not supported fall back to normal one)
  const { config: prepareWriteConfigBuy } = usePrepareContractWrite({
    ...publicSaleContractConfig,
    functionName: "buy",
    args:
      paymentTokenAddress === etherAddress
        ? [0]
        : [min(parseInput(input), paymentTokenAllowance || 0)],
    overrides: {
      value: paymentTokenAddress === etherAddress ? parseInput(input) : 0,
    },
  });
  const { isLoading: isBuying, write: executeBuy } = useContractWrite(
    prepareWriteConfigBuy
  );

  useWaitForTransaction({
    hash: approvalTx?.hash,
    onSuccess(data) {
      executeBuy?.({
        recklesslySetUnpreparedArgs:
          paymentTokenAddress === etherAddress
            ? [0]
            : [
                ethers.utils
                  .parseEther(!isNumeric(input) ? "0" : input)
                  .toString(),
              ],
        recklesslySetUnpreparedOverrides: {
          value:
            paymentTokenAddress === etherAddress
              ? ethers.utils
                  .parseEther(!isNumeric(input) ? "0" : input)
                  .toString()
              : 0,
        },
      });
    },
  });

  // ---callbacks---------------------------------------------------------------------------------

  const getPaymentTokenAllowance = useCallback(
    () => ethers.utils.formatUnits(paymentTokenAllowance, paymentTokenDecimals),
    [paymentTokenAllowance, paymentTokenDecimals]
  );

  const getRewardTokenBalance = useCallback(
    () => ethers.utils.formatUnits(rewardTokenBalance, rewardTokenDecimals),
    [rewardTokenBalance, rewardTokenDecimals]
  );

  // ------------------------------------------------------------------------------------------

  const buyingTargetChanged = (e) => {
    setInput(e.target.value.toString());
    refetchOutputEstimate?.();
  };

  // ---visibility-----------------------------------------------------------------------------

  const buyingDisabled = () => {
    return (
      isBuying ||
      parseInput(input)?.lte(0) ||
      settingAllowance ||
      (paymentTokenAddress !== etherAddress &&
        parseInput(input)?.gt(paymentTokenAllowance || 0))
    );
  };

  const allowingDisabled = () => {
    return (
      paymentTokenAddress === etherAddress ||
      settingAllowance ||
      parseInput(input)?.lte(paymentTokenAllowance) ||
      parseInput(input)?.lte(0)
    );
  };

  // ---functionality---------------------------------------------------------------------------

  const allowFunction = (e) => {
    e.preventDefault();
    if (parseInput(input)?.gt(0)) {
      executeApprovePaymentToken?.();
    }
  };

  const buyFunction = useCallback(
    (e) => {
      e.preventDefault();
      // TODO account for decimals correctly
      executeBuy?.({
        recklesslySetUnpreparedArgs:
          paymentTokenAddress === etherAddress
            ? [0]
            : [
                ethers.utils
                  .parseEther(!isNumeric(input) ? "0" : input)
                  .toString(),
              ],
        recklesslySetUnpreparedOverrides: {
          value:
            paymentTokenAddress === etherAddress
              ? ethers.utils
                  .parseEther(!isNumeric(input) ? "0" : input)
                  .toString()
              : 0,
        },
      });
    },
    [input, paymentTokenAddress, executeBuy]
  );

  // ------------------------------------------------------------------------------------------

  if (!isConnected) {
    return (
      <AppContainer>
        <Navbar />
        <div>Please connect your wallet</div>
      </AppContainer>
    );
  }

  if (chain?.unsupported) {
    return (
      <AppContainer>
        <Navbar />
        <div>Unsupported chain</div>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <Navbar />
      <Container>
        <div className={styles.innerContainer}>
          <Card>
            <div className={styles.titleImage}>
              <svg>
                <text x="20" y="50" className={styles.pre}>
                  Public
                </text>
                <text x="80" y="80" className={styles.sale}>
                  Sale
                </text>
              </svg>
            </div>
          </Card>
          <Card>
            <Grid>
              <GridRow>
                <GridCell colSpan={4}>
                  <div className={styles.currentPrice}>
                    <p>
                      <b>Current price:</b> {input / output} WETH ($
                      {(input / output) * 1500})
                    </p>
                  </div>
                </GridCell>
              </GridRow>
              <GridRow>
                <GridCell4>
                  <div className={styles.header}>
                    <b>Time left</b>
                  </div>
                </GridCell4>
                <GridCell4>
                  <div className={styles.statBody}>{}</div>
                </GridCell4>
                <GridCell4>
                  <div className={styles.header}>
                    <b>Supply left</b>
                  </div>
                </GridCell4>
                <GridCell4>
                  <div className={styles.statBody}>
                    {ethers.utils.formatEther(supplyLeft || 0)}
                  </div>
                </GridCell4>
              </GridRow>
              <GridRow>
                <GridCell>
                  <div className={styles.action}>BUY</div>
                </GridCell>
                <GridCell colSpan={3}>
                  <input
                    className={styles.amount}
                    type="number"
                    placeholder="0"
                    onChange={buyingTargetChanged}
                  />
                </GridCell>
              </GridRow>
              <GridRow>
                <GridCell>
                  <div className={styles.action}>FOR</div>
                </GridCell>
                <GridCell colSpan={3}>
                  <input
                    className={styles.amount}
                    type="number"
                    value={output}
                  />
                </GridCell>
              </GridRow>
              <GridRow>
                <GridCell colSpan={4}>
                  <Button onClick={allowFunction}>Buy</Button>
                </GridCell>
              </GridRow>
            </Grid>
          </Card>
        </div>
      </Container>
      {/* <p readOnly={true}>
        Payment token allowance: {getPaymentTokenAllowance()}
      </p>
      <p readOnly={true}> Reward token balance: {getRewardTokenBalance()}</p>

      <form>
        <div onChange={buyingTargetChanged}>
          <label htmlFor="inputField">Input amount:</label>
          <input
            name="inputField"
            type="text"
            className="input"
            placeholder="Buy for..."
            autoComplete="off"
            value={input.toString()}
          />
        </div>

        <div readOnly={true}>
          <label htmlFor="outputField">Output estimate:</label>
          <input
            name="outputField"
            type="text"
            className="input"
            value={output}
          />
        </div>

        <button onClick={buyFunction} disabled={buyingDisabled()}>
          Buy
        </button>

        <button onClick={allowFunction} disabled={allowingDisabled()}>
          Allow
        </button>

        {isErrorOutputEstimate && <div>Error occured while fetching data!</div>}
      </form> */}
    </AppContainer>
  );
}

export default PublicSale;
