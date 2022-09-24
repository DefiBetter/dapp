import { ethers } from "ethers";
import { useCallback, useState } from "react";
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
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

function Staking() {
  // fetch account and current network
  const { address: connectedAddress, isConnected } = useAccount();
  const { chain: activeChain } = useNetwork();

  // ---constants-----------------------

  const BN = ethers.BigNumber.from;
  const btStakingContractConfig = {
    addressOrName: contractAddresses[activeChain?.network]?.btStaking,
    contractInterface: BetterABI,
  };
  console.log("activeChain", activeChain);
  console.log("connectedAddress", connectedAddress);
  console.log("contractAddresses", contractAddresses);
  console.log("btStakingContractConfig", btStakingContractConfig);

  // ------vars--------------------------
  const [bridgeAmount, setBridgeAmount] = useState(0);
  const [lpAmount, setLpAmount] = useState(0);
  const [btAmount, setBtAmount] = useState(0);
  const [zapAmount, setZapAmount] = useState(0);

  // ---read-----------------------------
  // Better token address
  let { data: btStakingTokenAddress } = useContractRead({
    ...btStakingContractConfig,
    functionName: "getStakingToken",
  });
  console.log("btStakingTokenAddress", btStakingTokenAddress);

  // Better token decimals
  const { data: btStakingTokenDecimals } = useContractRead({
    addressOrName: btStakingTokenAddress,
    contractInterface: IERC20MetadataABI,
    functionName: "decimals",
  });
  console.log("btStakingTokenDecimals", btStakingTokenDecimals);

  // Better token balance of connected address
  const {
    data: btStakingTokenBalance,
    isSuccess: btStakingTokenBalanceSuccess,
    refetch: refetchBtStakingTokenBalance,
  } = useContractRead({
    addressOrName: btStakingTokenAddress,
    contractInterface: IERC20MetadataABI,
    functionName: "balanceOf",
    args: connectedAddress,
    watch: true,
  });

  // Better token allowance for BT staking contract
  const {
    data: btStakingTokenAllowance,
    isSuccess: btStakingTokenAllowanceSuccess,
  } = useContractRead({
    addressOrName: btStakingTokenAddress,
    contractInterface: IERC20MetadataABI,
    functionName: "allowance",
    args: [connectedAddress, btStakingContractConfig.addressOrName],
    watch: true,
  });

  // BT staking reward token (BNB) balance
  const {
    data: rewardTokenBalance,
    isSuccess: rewardTokenBalanceSuccess,
    refetch: refetchRewardTokenBalance,
  } = useBalance({
    addressOrName: connectedAddress,
  });

  // currently BT token staked
  const {
    data: btStaked,
    isSuccess: btStakedBalanceSuccess,
    refetch: refetchBtStaked,
  } = useContractRead({
    ...btStakingContractConfig,
    functionName: "getStaked",
    overrides: {
      from: connectedAddress,
    },
  });

  // pending BT staking reward tokens (BNB)
  const { data: btStakingRewards, isSuccess: pendingBtStakingRewardsSuccess } =
    useContractRead({
      ...btStakingContractConfig,
      functionName: "getPendingRewards",
    });

  // ---writes---------------------------
  // BT staking approve (part 1) --> maybe should change to infinite approval later
  const { config: prepareWriteConfigBtApprove } = usePrepareContractWrite({
    addressOrName: btStakingTokenAddress,
    contractInterface: IERC20MetadataABI,
    functionName: "approve",
    args: [
      //spender
      btStakingContractConfig.addressOrName,
      //value
      min(
        parseStakingInput(btAmount, btStakingTokenDecimals),
        btStakingTokenBalance
          ? BN(btStakingTokenBalance)
          : ethers.constants.MaxUint256 // this is infinite approval, maybe remove or something later
      ),
    ],
  });
  console.log(
    "btStakingTokenBalance",
    btStakingTokenBalance
      ? BN(btStakingTokenBalance)
      : ethers.constants.MaxUint256
  );

  // BT staking approve (part 2)
  const {
    data: btApprovalTx,
    isLoading: isBtApproving,
    write: executeBtStakeApprove,
  } = useContractWrite(prepareWriteConfigBtApprove);

  // BT staking send (part 1)
  const { config: prepareWriteConfigBtStake } = usePrepareContractWrite({
    ...btStakingContractConfig,
    functionName: "stake",
    args: [0],
  });

  // BT staking send (part 2)
  const { isLoading: isBtStaking, writeAsync: executeBtStake } =
    useContractWrite(prepareWriteConfigBtStake);

  // after approval, prompt staking txn
  useWaitForTransaction({
    hash: btApprovalTx?.hash,
    onSuccess(data) {
      executeBtStake?.({
        recklesslySetUnpreparedArgs: [
          min(parseStakingInput(btAmount), BN(btStakingTokenBalance)),
        ],
      }).then(() => {
        refetchBtStakingTokenBalance?.();
        refetchBtStaked?.();
      });
      console.log("Staking...");
    },
  });

  // BT unstaking (part 1)
  const { config: prepareWriteConfigBtUnstake } = usePrepareContractWrite({
    ...btStakingContractConfig,
    functionName: "unstake",
    args: [0], // amount to unstake?
  });

  // BT unstaking (part 2)
  const { isLoading: isBtUnstaking, writeAsync: executeBtUnstake } =
    useContractWrite(prepareWriteConfigBtUnstake);

  // BT staking rewards claim (part 1)
  const { config: prepareWriteConfigBtClaim } = usePrepareContractWrite({
    ...btStakingContractConfig,
    functionName: "claim",
    overrides: {
      from: connectedAddress,
    },
  });

  // BT staking rewards claim (part 2)
  const { isLoading: isBtClaiming, writeAsync: executeBtClaim } =
    useContractWrite(prepareWriteConfigBtClaim);

  // ---visibility-----------------------
  function fetchOrShow(bool, result, dec) {
    if (bool && dec && result) {
      return ethers.utils.formatUnits(result, dec);
    }
    return "Fetching...";
  }

  function btStakingDisabled() {
    return !parseStakingInput(btAmount).gt(0) || isBtApproving || isBtStaking;
  }

  const btStakingButtonText = useCallback(
    () =>
      isBtApproving ? "Approving..." : isBtStaking ? "Staking..." : "Stake",
    [isBtStaking, isBtApproving]
  );

  // ---functionality--------------------
  function min(a, b) {
    return a.gt(b) ? b : a;
  }

  function isNumeric(i) {
    return !isNaN(parseFloat(i)) && isFinite(i);
  }

  function parseStakingInput(i, tokenDecimals) {
    console.log("i", i);
    console.log("tokenDecimals", tokenDecimals);
    if (isNumeric(i) && tokenDecimals) {
      return ethers.utils.parseUnits(i, tokenDecimals);
    }
    return BN(0);
  }

  // unused functions at the moment
  const getBtStakingTokenBalance = useCallback(
    () =>
      fetchOrShow(
        btStakingTokenBalanceSuccess,
        btStakingTokenBalance,
        btStakingTokenDecimals
      ),
    [
      btStakingTokenBalanceSuccess,
      btStakingTokenBalance,
      btStakingTokenDecimals,
    ]
  );

  const getBtStakingTokenAllowance = useCallback(
    () =>
      fetchOrShow(
        btStakingTokenAllowanceSuccess,
        btStakingTokenAllowance,
        btStakingTokenDecimals
      ),
    [
      btStakingTokenAllowanceSuccess,
      btStakingTokenAllowance,
      btStakingTokenDecimals,
    ]
  );
  const getBtStaked = useCallback(
    () => fetchOrShow(btStakedBalanceSuccess, btStaked, btStakingTokenDecimals),
    [btStakedBalanceSuccess, btStaked, btStakingTokenDecimals]
  );

  // ---handle callback-----------------------
  // bridge
  const handleSetBridgeAmount = (e) => {
    console.log("handleSetBridgeAmount");
    setBridgeAmount(e.target.value ?? 0);
  };

  const handleOnBridge = (e) => {
    console.log("handleOnBridge");
  };

  // lp
  const handleSetLpStakeAmount = (e) => {
    console.log("handleSetLpStakeAmount");
    setLpAmount(e.target.value ?? 0);
  };

  const handleOnLpStake = (e) => {
    console.log("handleOnLpStake");
  };
  const handleOnLpUnstake = (e) => {
    console.log("handleOnLpUnstake");
  };
  const handleOnLpClaimRewards = (e) => {
    console.log("handleOnLpClaimRewards");
  };

  // bt
  const handleSetBtStakeAmount = (e) => {
    console.log("handleSetBtStakeAmount");
    setBtAmount(e.target.value ?? 0);
  };

  const handleOnBtStake = (e) => {
    console.log("handleOnBtStake");
    e.preventDefault();
    console.log("btAmount", btAmount);
    console.log("parseStakingInput(btAmount)", parseStakingInput(btAmount, 18));
    console.log(
      "parseStakingInput(btAmount)?.gt(0)",
      parseStakingInput(btAmount, 18)?.gt(0)
    );
    if (parseStakingInput(btAmount, 18)?.gt(0)) {
      console.log(
        "executeBtStakeApprove?.()",
        executeBtStakeApprove ? "true" : "false"
      );
      executeBtStakeApprove?.();
      console.log("Approving...");
    }
  };

  const handleOnBtUnstake = (e) => {
    console.log("handleOnBtUnstake");
    e.preventDefault();
    if (parseStakingInput(btAmount)?.gt(0)) {
      executeBtUnstake?.({
        recklesslySetUnpreparedArgs: min(
          parseStakingInput(btAmount),
          BN(btStaked)
        ),
        recklesslySetUnpreparedOverrides: {
          from: connectedAddress,
        },
      }).then(() => {
        refetchBtStaked?.();
        refetchBtStakingTokenBalance?.();
      });
      console.log("Unstaking...");
    }
  };

  const handleOnBtClaimRewards = (e) => {
    console.log("handleOnBtClaimRewards");
    e.preventDefault();
    if (parseStakingInput(rewardTokenBalance, 18)?.gt(0)) {
      executeBtClaim?.({
        recklesslySetUnpreparedOverrides: {
          from: connectedAddress,
        },
      }).then(() => {
        refetchRewardTokenBalance?.();
      });
      console.log("Claiming...");
    }
  };

  // zap
  const handleSetZapAmount = (e) => {
    console.log("handleSetZapAmount");
    setZapAmount(e.target.value ?? 0);
  };

  const handleOnZap = (e) => {
    console.log("handleOnZap");
  };

  // if wallet not connected
  if (!isConnected) {
    return (
      <>
        <Navbar />
        <div>Please connect your wallet</div>
      </>
    );
  }

  if (activeChain?.unsupported) {
    return (
      <>
        <Navbar />
        <div>Unsupported chain</div>
      </>
    );
  }

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
                    <InputNumber onChange={handleSetLpStakeAmount} />
                  </GridCell3>
                  <GridCell3>
                    <InputNumber onChange={handleSetZapAmount} />
                  </GridCell3>
                </GridRow>
                <GridRow>
                  <GridCell3>
                    <Button
                      onClick={handleOnLpStake}
                      disabled={btStakingDisabled()}
                    >
                      Stake
                    </Button>
                  </GridCell3>
                  <GridCell3>
                    <Button
                      onClick={handleOnLpUnstake}
                      disabled={isBtUnstaking || !btStaked}
                    >
                      Unstake
                    </Button>
                  </GridCell3>
                  <GridCell3>
                    <Button onClick={handleOnZap}>Zap in</Button>
                  </GridCell3>
                </GridRow>
                <GridRow>
                  <GridCell colSpan={3}>
                    <Button onClick={handleOnLpClaimRewards}>Claim</Button>
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
                    <InputNumber onChange={handleSetBtStakeAmount} />
                  </GridCell>
                </GridRow>
                <GridRow>
                  <GridCell2>
                    <Button onClick={handleOnBtStake}>
                      {btStakingButtonText()}
                    </Button>
                  </GridCell2>
                  <GridCell2>
                    <Button onClick={handleOnBtUnstake}>
                      {isBtUnstaking ? "Unstaking..." : "Unstake"}
                    </Button>
                  </GridCell2>
                </GridRow>
                <GridRow>
                  <GridCell colSpan={2}>
                    <Button
                      onClick={handleOnBtClaimRewards}
                      disabled={isBtClaiming}
                    >
                      Claim&nbsp;&nbsp;&nbsp;&nbsp;
                      {fetchOrShow(
                        pendingBtStakingRewardsSuccess,
                        btStakingRewards,
                        18
                      )}
                    </Button>
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
