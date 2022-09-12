import { ethers } from "ethers";
import { useState } from "react";
import Button from "../components/common/Button";
import { Card } from "../components/common/Card";
import { Container } from "../components/common/Container";
import {
  Grid,
  GridCell,
  GridCell2,
  GridCell3,
  GridCell4,
  GridRow,
} from "../components/common/Grid";
import { InputNumber } from "../components/common/Input";
import Navbar from "../components/Navbar/Navbar";
import StakeDiagram from "../components/Staking/StakeDiagram";
import contractAddresses from "../static/contractAddresses";
import BetterABI from "../static/ABI/BetterABI.json";
import IERC20MetadataABI from "../static/ABI/IERC20MetadataABI.json";

import styles from "./Staking.module.css";
import {
  useBalance,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

function Staking({ activeChain, connectedAddress }) {
  // ---consts--------------------------

  const BN = ethers.BigNumber.from;
  const stakingContractConfig = {
    addressOrName: contractAddresses[activeChain?.network]?.better,
    contractInterface: BetterABI,
  };

  // ---reads----------------------------

  // ------consts------------------------

  // staking token addr
  const { data: stakingTokenAddress } = useContractRead({
    ...stakingContractConfig,
    functionName: "getStakingToken",
  });

  // staking token decimals
  const { data: stakingTokenDecimals } = useContractRead({
    addressOrName: stakingTokenAddress,
    contractInterface: IERC20MetadataABI,
    functionName: "decimals",
  });

  // ------vars--------------------------

  const [toStake, setToStake] = useState("0");
  const [toUnstake, setToUnstake] = useState("0");

  // staking token balance
  const {
    data: stakingTokenBalance,
    isSuccess: stakingTokenBalanceSuccess,
    refetch: refetchStakingTokenBalance,
  } = useContractRead({
    addressOrName: stakingTokenAddress,
    contractInterface: IERC20MetadataABI,
    functionName: "balanceOf",
    args: connectedAddress,
    watch: true,
  });

  // staking token allowance
  const {
    data: stakingTokenAllowance,
    isSuccess: stakingTokenAllowanceSuccess,
  } = useContractRead({
    addressOrName: stakingTokenAddress,
    contractInterface: IERC20MetadataABI,
    functionName: "allowance",
    args: [connectedAddress, stakingContractConfig.addressOrName],
    watch: true,
  });

  // reward token balance
  const {
    data: rewardTokenBalance,
    isSuccess: rewardTokenBalanceSuccess,
    refetch: refetchRewardTokenBalance,
  } = useBalance({
    addressOrName: connectedAddress,
  });

  // currently staked
  const {
    data: staked,
    isSuccess: stakedBalanceSuccess,
    refetch: refetchStaked,
  } = useContractRead({
    ...stakingContractConfig,
    functionName: "getStaked",
    overrides: {
      from: connectedAddress,
    },
  });

  // pending reward tokens
  const { data: rewards, isSuccess: pendingRewardsSuccess } = useContractRead({
    ...stakingContractConfig,
    functionName: "getPendingRewards",
  });

  // ---writes---------------------------

  // stake approve
  const { config: prepareWriteConfigApprove } = usePrepareContractWrite({
    addressOrName: stakingTokenAddress,
    contractInterface: IERC20MetadataABI,
    functionName: "approve",
    args: [
      //spender
      stakingContractConfig.addressOrName,
      //value
      min(parseStakingInput(toStake), BN(stakingTokenBalance)),
    ],
  });

  const {
    data: approvalTx,
    isLoading: isApproving,
    write: executeStakeApprove,
  } = useContractWrite(prepareWriteConfigApprove);

  // stake send
  const { config: prepareWriteConfigStake } = usePrepareContractWrite({
    ...stakingContractConfig,
    functionName: "stake",
    args: [0],
  });
  const { isLoading: isStaking, writeAsync: executeStake } = useContractWrite(
    prepareWriteConfigStake
  );

  useWaitForTransaction({
    hash: approvalTx?.hash,
    onSuccess(data) {
      executeStake?.({
        recklesslySetUnpreparedArgs: [
          min(parseStakingInput(toStake), BN(stakingTokenBalance)),
        ],
      }).then(() => {
        refetchStakingTokenBalance?.();
        refetchStaked?.();
      });
      console.log("Staking...");
    },
  });

  // unstake
  const { config: prepareWriteConfigUnstake } = usePrepareContractWrite({
    ...stakingContractConfig,
    functionName: "unstake",
    args: [0],
  });
  const { isLoading: isUnstaking, writeAsync: executeUnstake } =
    useContractWrite(prepareWriteConfigUnstake);

  // claim
  const { config: prepareWriteConfigClaim } = usePrepareContractWrite({
    ...stakingContractConfig,
    functionName: "claim",
    overrides: {
      from: connectedAddress,
    },
  });
  const { isLoading: isClaiming, writeAsync: executeClaim } = useContractWrite(
    prepareWriteConfigClaim
  );

  // ---visibility-----------------------

  function fetchOrShow(bool, result, dec) {
    if (bool && dec && result) {
      return ethers.utils.formatUnits(result, dec);
    }
    return "Fetching...";
  }

  function stakingDisabled() {
    return !parseStakingInput(toStake).gt(0) || isApproving || isStaking;
  }

  const stakingbuttonText = useCallback(
    () => (isApproving ? "Approving..." : isStaking ? "Staking..." : "Stake"),
    [isStaking, isApproving]
  );

  // ---functionality--------------------

  function min(a, b) {
    return a.gt(b) ? b : a;
  }

  function triggerStake(e) {
    e.preventDefault();
    if (parseStakingInput(toStake)?.gt(0)) {
      executeStakeApprove?.();
      console.log("Approving...");
    }
  }

  function triggerUnstake(e) {
    e.preventDefault();
    if (parseStakingInput(toUnstake)?.gt(0)) {
      executeUnstake?.({
        recklesslySetUnpreparedArgs: min(
          parseStakingInput(toUnstake),
          BN(staked)
        ),
        recklesslySetUnpreparedOverrides: {
          from: connectedAddress,
        },
      }).then(() => {
        refetchStaked?.();
        refetchStakingTokenBalance?.();
      });
      console.log("Unstaking...");
    }
  }

  function triggerClaim(e) {
    e.preventDefault();
    if (parseStakingInput(rewards)?.gt(0)) {
      executeClaim?.({
        recklesslySetUnpreparedOverrides: {
          from: connectedAddress,
        },
      }).then(() => {
        refetchRewardTokenBalance?.();
      });
      console.log("Claiming...");
    }
  }

  function isNumeric(i) {
    return !isNaN(parseFloat(i)) && isFinite(i);
  }

  function parseStakingInput(i) {
    if (isNumeric(i) && stakingTokenDecimals) {
      return ethers.utils.parseUnits(i, stakingTokenDecimals);
    }
    return BN(0);
  }

  const getStakingTokenBalance = useCallback(
    () =>
      fetchOrShow(
        stakingTokenBalanceSuccess,
        stakingTokenBalance,
        stakingTokenDecimals
      ),
    [stakingTokenBalanceSuccess, stakingTokenBalance, stakingTokenDecimals]
  );
  const getStakingTokenAllowance = useCallback(
    () =>
      fetchOrShow(
        stakingTokenAllowanceSuccess,
        stakingTokenAllowance,
        stakingTokenDecimals
      ),
    [stakingTokenAllowanceSuccess, stakingTokenAllowance, stakingTokenDecimals]
  );
  const getStaked = useCallback(
    () => fetchOrShow(stakedBalanceSuccess, staked, stakingTokenDecimals),
    [stakedBalanceSuccess, staked, stakingTokenDecimals]
  );

  // ui code
  const [bridgeAmount, setBridgeAmount] = useState(0);
  const [stakeLpAmount, setStakeLpAmount] = useState(0);
  const [stakeBtAmount, setStakeBtAmount] = useState(0);
  const [zapAmount, setZapAmount] = useState(0);

  // bridge
  const handleSetBridgeAmount = (e) => {
    console.log("handleSetBridgeAmount");
    setBridgeAmount(e.target.value ?? 0);
  };

  const handleOnBridge = (e) => {
    console.log("handleOnBridge");
  };

  // lp
  const handleSetStakeLpAmount = (e) => {
    console.log("handleSetStakeLpAmount");
    setStakeLpAmount(e.target.value ?? 0);
  };

  const handleOnStakeLp = (e) => {
    console.log("handleOnStakeLp");
  };
  const handleOnUnstakeLp = (e) => {
    console.log("handleOnUnstakeLp");
  };
  const handleOnClaimRewardsLp = (e) => {
    console.log("handleOnClaimRewardsLp");
  };

  // bt
  const handleSetStakeBtAmount = (e) => {
    console.log("handleSetStakeBtAmount");
    setStakeBtAmount(e.target.value ?? 0);
  };

  const handleOnStakeBt = (e) => {
    console.log("handleOnStakeBt");
  };
  const handleOnUnstakeBt = (e) => {
    console.log("handleOnUnstakeBt");
  };
  const handleOnClaimRewardsBt = (e) => {
    console.log("handleOnClaimRewardsBt");
  };

  // zap
  const handleSetZapAmount = (e) => {
    console.log("handleSetZapAmount");
    setZapAmount(e.target.value ?? 0);
  };

  const handleOnZap = (e) => {
    console.log("handleOnZap");
  };

  return (
    <>
      <Navbar />
      <Container>
        <div className={styles.section}>
          <Card>
            <Grid>
              <GridRow>
                <GridCell3>
                  <div className={styles.centerText}>TVL</div>
                </GridCell3>
                <GridCell3>
                  <div className={styles.centerText}>LP</div>
                </GridCell3>
                <GridCell3>
                  <div className={styles.centerText}>BT</div>
                </GridCell3>
              </GridRow>
              <GridRow>
                <GridCell3>
                  <div className={styles.centerText}>$10.000M</div>
                </GridCell3>
                <GridCell3>
                  <div className={styles.centerText}>$100.000k</div>
                </GridCell3>
                <GridCell3>
                  <div className={styles.centerText}>$700.000k</div>
                </GridCell3>
              </GridRow>
            </Grid>
          </Card>
        </div>
        <div className={styles.section}>
          <div className={styles.assetContainer}>
            <Card>
              <Grid>
                <GridRow>
                  <GridCell2>
                    <InputNumber onChange={handleSetBridgeAmount} />
                  </GridCell2>
                  <GridCell4>
                    <Button>Avax</Button>
                  </GridCell4>
                </GridRow>
                <GridRow>
                  <GridCell colSpan={3}>
                    <Button onClick={handleOnBridge}>Bridge</Button>
                  </GridCell>
                </GridRow>
              </Grid>
            </Card>
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.assetContainer}>
            <StakeDiagram
              stakeSymbol={"BT-BNB-LP"}
              rewardSymbol={"BT"}
              stakeName={"BT-BNB-LP"}
              rewardName={"Better Token"}
            />
            <Card>
              <Grid>
                <GridRow>
                  <GridCell3 colSpan={2}>
                    <InputNumber onChange={handleSetStakeLpAmount} />
                  </GridCell3>
                  <GridCell3>
                    <InputNumber onChange={handleSetZapAmount} />
                  </GridCell3>
                </GridRow>
                <GridRow>
                  <GridCell3>
                    <Button onClick={handleOnStakeLp}>Stake</Button>
                  </GridCell3>
                  <GridCell3>
                    <Button onClick={handleOnUnstakeLp}>Unstake</Button>
                  </GridCell3>
                  <GridCell3>
                    <Button onClick={handleOnZap}>Zap in</Button>
                  </GridCell3>
                </GridRow>
                <GridRow>
                  <GridCell colSpan={3}>
                    <Button onClick={handleOnClaimRewardsLp}>Claim</Button>
                  </GridCell>
                </GridRow>
              </Grid>
            </Card>
          </div>
          <div className={styles.assetContainer}>
            <StakeDiagram
              stakeSymbol={"BT"}
              rewardSymbol={"BNB"}
              stakeName={"Better Token"}
              rewardName={"BNB"}
            />
            <Card>
              <Grid>
                <GridRow>
                  <GridCell colSpan={2}>
                    <InputNumber onChange={handleSetStakeBtAmount} />
                  </GridCell>
                </GridRow>
                <GridRow>
                  <GridCell2>
                    <Button onClick={handleOnStakeBt}>Stake</Button>
                  </GridCell2>
                  <GridCell2>
                    <Button onClick={handleOnUnstakeBt}>Unstake</Button>
                  </GridCell2>
                </GridRow>
                <GridRow>
                  <GridCell colSpan={2}>
                    <Button onClick={handleOnClaimRewardsBt}>Claim</Button>
                  </GridCell>
                </GridRow>
              </Grid>
            </Card>
          </div>
        </div>
      </Container>
    </>
  );
}

export default Staking;
