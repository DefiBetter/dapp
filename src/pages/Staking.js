import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import Button from "../components/common/Button";
import { Card, CardBlueBgBlackBorder } from "../components/common/Card";
import { AppContainer, Container } from "../components/common/Container";
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
import { contractAddresses } from "../static/contractAddresses";
import DeFiBetterV1ABI from "../static/ABI/DeFiBetterV1ABI.json";
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
import { CenterText } from "../components/common/Text";
import { bignumber, bignumberDependencies } from "mathjs";

function Staking(props) {
  // fetch account and current network
  const { address: connectedAddress, isConnected } = useAccount();
  const { chain: activeChain } = useNetwork();

  // ---constants-----------------------

  const BN = ethers.BigNumber.from;
  const btStakingContractConfig = {
    address: contractAddresses[activeChain?.network]?.btStaking,
    abi: DeFiBetterV1ABI,
  };
  // // console.log("activeChain", activeChain);
  // // console.log("connectedAddress", connectedAddress);
  // // console.log("contractAddresses", contractAddresses);
  // // console.log("btStakingContractConfig", btStakingContractConfig);

  // ------vars--------------------------
  const [bridgeAmount, setBridgeAmount] = useState(0);
  const [lpAmount, setLpAmount] = useState(0);
  const [btAmount, setBtAmount] = useState(0);
  const [zapAmount, setZapAmount] = useState(0);

  const [lpTokenSymbol, setLpTokenSymbol] = useState();

  const [btAllowance, setBtAllowance] = useState(bignumber("0"));
  const [lpAllowance, setLpAllowance] = useState(bignumber("0"));

  const [btBalance, setBtBalance] = useState(0);
  const [lpBalance, setLpBalance] = useState(0);

  useEffect(() => {
    setLpTokenSymbol(
      `BT-${contractAddresses[activeChain?.network]?.nativeGas} LP`
    );
  }, [activeChain]);

  const betterContractConfig = {
    address: contractAddresses[activeChain?.network]?.better,
    abi: DeFiBetterV1ABI,
  };

  // btAllowance bt
  useContractRead({
    address: contractAddresses[activeChain?.network]?.btToken,
    abi: IERC20MetadataABI,
    functionName: "allowance",
    args: [connectedAddress, contractAddresses[activeChain?.network]?.better],
    watch: true,
    onError(data) {
      console.log("allowance bt error", data);
    },
    onSuccess(data) {
      setBtAllowance(data);
    },
  });

  console.log("MAX UINT", ethers.constants.MaxUint256.sub("1").toString());

  // prepare approve bt
  const { config: approveBtConfig } = usePrepareContractWrite({
    address: contractAddresses[activeChain?.network]?.btToken,
    abi: IERC20MetadataABI,
    functionName: "approve",
    args: [
      contractAddresses[activeChain?.network]?.better,
      ethers.constants.MaxUint256.sub("1").toString(),
    ],
    onSuccess(data) {
      console.log("approve prepared", data);
    },
  });

  // infinite approve bt
  const { write: approveBtWrite } = useContractWrite({
    ...approveBtConfig,
    onSuccess(data) {
      console.log("infinite approved", data);
    },
  });

  // prepare stake bt
  const { config: stakeBtConfig } = usePrepareContractWrite({
    ...betterContractConfig,
    functionName: "stake",
    args: [ethers.utils.parseEther(btAmount.toString())],
    onSuccess(data) {
      console.log("prepared stake", data);
    },
    onError(data) {
      console.log("connectedAddress", connectedAddress);
      console.log("btAmount", btAmount);
      console.log("prepare stake error", data);
    },
  });

  // stake bt
  const { write: stakeBtWrite } = useContractWrite({
    ...stakeBtConfig,
    onError(e) {
      console.log("error staking", e);
    },
    onSuccess(data) {
      console.log("staked", data);
      setBtAmount(0);
    },
  });

  // prepare unstake bt
  const { config: unstakeBtConfig } = usePrepareContractWrite({
    ...betterContractConfig,
    functionName: "unstake",
    args: [ethers.utils.parseEther(btAmount.toString())],
    onSuccess(data) {
      console.log("prepared unstake");
    },
  });

  // unstake bt
  const { write: unstakeBtWrite } = useContractWrite({
    ...unstakeBtConfig,
    onSuccess(data) {
      console.log("unstaked", data);
    },
  });

  // claim bt rewards
  const { write: claimBtWrite } = useContractWrite({
    mode: "recklesslyUnprepared",
    ...betterContractConfig,
    functionName: "claim",
    args: [],
    onSuccess(data) {
      console.log("claimed", data);
    },
    onError(data) {
      console.log("claim error", data);
    },
  });

  // balance of bt
  useContractRead({
    address: contractAddresses[activeChain?.network]?.btToken,
    abi: IERC20MetadataABI,
    functionName: "balanceOf",
    args: [connectedAddress],
    watch: true,
    onError(data) {
      console.log("balanceOf bt error", data);
    },
    onSuccess(data) {
      setBtBalance(ethers.utils.formatEther(data));
      console.log("balanceOf bt", ethers.utils.formatEther(data));
    },
  });

  /* LP */
  // lpAllowance
  useContractRead({
    address: contractAddresses[activeChain?.network]?.lpToken,
    abi: IERC20MetadataABI,
    functionName: "allowance",
    args: [connectedAddress, contractAddresses[activeChain?.network]?.better],
    watch: true,
    onError(data) {
      console.log("allowance lp error", data);
    },
    onSuccess(data) {
      setLpAllowance(data);
    },
  });

  console.log("MAX UINT", ethers.constants.MaxUint256.sub("1").toString());

  // prepare approve lp
  const { config: approveLpConfig } = usePrepareContractWrite({
    address: contractAddresses[activeChain?.network]?.btToken,
    abi: IERC20MetadataABI,
    functionName: "approve",
    args: [
      contractAddresses[activeChain?.network]?.better,
      ethers.constants.MaxUint256.sub("1").toString(),
    ],
    onSuccess(data) {
      console.log("approve prepared", data);
    },
  });

  // infinite approve lp
  const { write: approveLpWrite } = useContractWrite({
    ...approveLpConfig,
    onSuccess(data) {
      console.log("infinite approved", data);
    },
  });

  // prepare stake lp
  const { config: stakeLpConfig } = usePrepareContractWrite({
    ...betterContractConfig,
    functionName: "stake",
    args: [ethers.utils.parseEther(lpAmount.toString())],
    onSuccess(data) {
      console.log("prepared stake", data);
    },
    onError(data) {
      console.log("connectedAddress", connectedAddress);
      console.log("lpAmount", lpAmount);
      console.log("prepare stake error", data);
    },
  });

  // stake lp
  const { write: stakeLpWrite } = useContractWrite({
    ...stakeLpConfig,
    onError(e) {
      console.log("error staking", e);
    },
    onSuccess(data) {
      console.log("staked", data);
      setBtAmount(0);
    },
  });

  // prepare unstake lp
  const { config: unstakeLpConfig } = usePrepareContractWrite({
    ...betterContractConfig,
    functionName: "unstake",
    args: [ethers.utils.parseEther(lpAmount.toString())],
    onSuccess(data) {
      console.log("prepared unstake");
    },
  });

  // unstake lp
  const { write: unstakeLpWrite } = useContractWrite({
    ...unstakeLpConfig,
    onSuccess(data) {
      console.log("unstaked", data);
    },
  });

  // claim lp rewards
  const { write: claimLpWrite } = useContractWrite({
    mode: "recklesslyUnprepared",
    ...betterContractConfig,
    functionName: "claim",
    args: [],
    onSuccess(data) {
      console.log("claimed", data);
    },
    onError(data) {
      console.log("claim error", data);
    },
  });

  // balance of lp
  useContractRead({
    address: contractAddresses[activeChain?.network]?.lpToken,
    abi: IERC20MetadataABI,
    functionName: "balanceOf",
    args: [connectedAddress],
    watch: true,
    onError(data) {
      console.log("balanceOf lp error", data);
    },
    onSuccess(data) {
      setLpBalance(ethers.utils.formatEther(data));
      console.log("balanceOf lp", ethers.utils.formatEther(data));
    },
  });

  /* handle input amount changes */
  const handleBtAmount = (e) => {
    console.log("value", e.target.value);
    setBtAmount(e.target.value ? e.target.value : 0);
  };

  const handleLpAmount = (e) => {
    console.log("value", e.target.value);
    setLpAmount(e.target.value ? e.target.value : 0);
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
    <AppContainer>
      <Navbar />
      <Container>
        <div className={styles.innerContainer}>
          {/* <div className={styles.section}>
            <div className={styles.assetContainer}>
              <Card>
                <Grid>
                  <GridRow>
                    <GridCell3>
                      <CenterText>TVL</CenterText>
                    </GridCell3>
                    <GridCell3>
                      <CenterText>LP</CenterText>
                    </GridCell3>
                    <GridCell3>
                      <CenterText>BT</CenterText>
                    </GridCell3>
                  </GridRow>
                  <GridRow>
                    <GridCell3>
                      <CenterText>$10.000M</CenterText>
                    </GridCell3>
                    <GridCell3>
                      <CenterText>$100.000k</CenterText>
                    </GridCell3>
                    <GridCell3>
                      <CenterText>$700.000k</CenterText>
                    </GridCell3>
                  </GridRow>
                </Grid>
              </Card>
            </div>
          </div> */}
          <div className={styles.section}>
            <div className={styles.assetContainer}>
              <Card>
                <Grid>
                  <GridRow>
                    <GridCell2>
                      <InputNumber onChange={() => {}} />
                    </GridCell2>
                    <GridCell4>
                      <Button>Avax</Button>
                    </GridCell4>
                  </GridRow>
                  <GridRow>
                    <GridCell colSpan={3}>
                      <Button onClick={() => {}}>Bridge</Button>
                    </GridCell>
                  </GridRow>
                </Grid>
              </Card>
            </div>
          </div>
          <div className={styles.section}>
            <div className={styles.section2}>
              <div className={styles.assetContainer}>
                <StakeDiagram
                  stakeSymbol={lpTokenSymbol}
                  rewardSymbol={"BT"}
                  stakeName={lpTokenSymbol}
                  rewardName={"Better Token"}
                />
                <Card>
                  <Grid>
                    <GridRow>
                      <GridCell3 colSpan={3}>
                        <Grid>
                          <GridCell4>
                            <CardBlueBgBlackBorder>
                              <b>Total staked:</b>
                            </CardBlueBgBlackBorder>
                          </GridCell4>
                          <GridCell4>
                            <b>
                              {}{" "}
                              {`BT-${
                                contractAddresses[activeChain?.network]
                                  ?.nativeGas
                              } LP`}
                            </b>
                          </GridCell4>
                          <GridCell4>
                            <CardBlueBgBlackBorder>
                              <b>Current APR:</b>
                            </CardBlueBgBlackBorder>
                          </GridCell4>
                          <GridCell4>
                            <b>brrrrr%</b>
                          </GridCell4>
                        </Grid>
                      </GridCell3>
                    </GridRow>
                    <GridRow>
                      <GridCell3 colSpan={2}>
                        <InputNumber
                          onChange={handleLpAmount}
                          min={0}
                          max={() => {
                            console.log("lpBalance", lpBalance);
                            return lpBalance;
                          }}
                          placeholder={0}
                          value={lpAmount > 0 ? lpAmount : ""}
                          setValue={setLpAmount}
                        />
                      </GridCell3>
                      <GridCell3>
                        <InputNumber onChange={() => {}} />
                      </GridCell3>
                    </GridRow>
                    <GridRow>
                      <GridCell3>
                        <Button onClick={stakeLpWrite}>Stake</Button>
                      </GridCell3>
                      <GridCell3>
                        <Button onClick={unstakeLpWrite}>Unstake</Button>
                      </GridCell3>
                      <GridCell3>
                        <Button onClick={() => {}}>Zap in</Button>
                      </GridCell3>
                    </GridRow>
                    <GridRow>
                      <GridCell colSpan={3}>
                        <Button onClick={claimLpWrite}>Claim</Button>
                      </GridCell>
                    </GridRow>
                  </Grid>
                </Card>
              </div>
              <div className={styles.assetContainer}>
                <StakeDiagram
                  stakeSymbol={"BT"}
                  rewardSymbol={
                    contractAddresses[activeChain?.network]?.nativeGas
                  }
                  stakeName={"Better Token"}
                  rewardName={
                    contractAddresses[activeChain?.network]?.nativeGas
                  }
                />
                <Card>
                  <Grid>
                    <GridRow>
                      <GridCell3 colSpan={3}>
                        <Grid>
                          <GridCell4>
                            <CardBlueBgBlackBorder>
                              <b>Total staked:</b>
                            </CardBlueBgBlackBorder>
                          </GridCell4>
                          <GridCell4>
                            <b>{0} BT</b>
                          </GridCell4>
                          <GridCell4>
                            <CardBlueBgBlackBorder>
                              <b>Current APR:</b>
                            </CardBlueBgBlackBorder>
                          </GridCell4>
                          <GridCell4>
                            <b>brrrrr%</b>
                          </GridCell4>
                        </Grid>
                      </GridCell3>
                    </GridRow>
                    <GridRow>
                      <GridCell colSpan={2}>
                        <InputNumber
                          onChange={handleBtAmount}
                          min={0}
                          max={btBalance}
                          placeholder={0}
                          value={btAmount > 0 ? btAmount : ""}
                          setValue={setBtAmount}
                        />
                      </GridCell>
                    </GridRow>
                    <GridRow>
                      <GridCell2>
                        {ethers.BigNumber.from(btAllowance.toString()).lte(
                          ethers.BigNumber.from("0")
                        ) ? (
                          <Button onClick={approveBtWrite}>Approve</Button>
                        ) : (
                          <Button onClick={stakeBtWrite}>Stake</Button>
                        )}
                      </GridCell2>
                      <GridCell2>
                        <Button onClick={unstakeBtWrite}>Unstake</Button>
                      </GridCell2>
                    </GridRow>
                    <GridRow>
                      <GridCell colSpan={2}>
                        <Button onClick={claimBtWrite}>Claim</Button>
                      </GridCell>
                    </GridRow>
                  </Grid>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </AppContainer>
  );
}

export default Staking;
