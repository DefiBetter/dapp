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
import BtStakingABI from "../static/ABI/BtStakingABI.json";
import IERC20MetadataABI from "../static/ABI/IERC20MetadataABI.json";

import styles from "./Staking.module.css";
import {
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
} from "wagmi";
import { bignumber } from "mathjs";
import Connect from "../components/common/Connect";

function Staking() {
  // fetch account and current network
  const { address: connectedAddress, isConnected } = useAccount();
  const { chain: activeChain } = useNetwork();

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
  const [zapBalance, setZapBalance] = useState(0);

  const [totalBtStaked, setTotalBtStaked] = useState(0);
  const [totalLpStaked, setTotalLpStaked] = useState(0);

  useEffect(() => {
    setLpTokenSymbol(
      `BT-${contractAddresses[activeChain?.network]?.nativeGas} LP`
    );
  }, [activeChain]);

  // ---constants-----------------------

  const btStakingPoolContractConfig = {
    address: contractAddresses[activeChain?.network]?.btStaking,
    abi: BtStakingABI,
  };

  const lpStakingPoolContractConfig = {
    address: contractAddresses[activeChain?.network]?.lpStaking,
    abi: BtStakingABI,
  };

  // btAllowance bt
  useContractRead({
    address: contractAddresses[activeChain?.network]?.btToken,
    abi: IERC20MetadataABI,
    functionName: "allowance",
    args: [
      connectedAddress,
      contractAddresses[activeChain?.network]?.btStaking,
    ],
    onError(data) {},
    onSuccess(data) {
      setBtAllowance(data);
    },
    watch: true,
  });

  // prepare approve bt
  const { config: approveBtConfig } = usePrepareContractWrite({
    address: contractAddresses[activeChain?.network]?.btToken,
    abi: IERC20MetadataABI,
    functionName: "approve",
    args: [
      btStakingPoolContractConfig.address,
      ethers.constants.MaxUint256.sub("1").toString(),
    ],
    onSuccess(data) {},
  });

  // infinite approve bt
  const { write: approveBtWrite } = useContractWrite({
    ...approveBtConfig,
    onSuccess(data) {},
  });

  // prepare stake bt
  const { config: stakeBtConfig } = usePrepareContractWrite({
    ...btStakingPoolContractConfig,
    functionName: "stake",
    args: [ethers.utils.parseEther(btAmount.toString())],
    onSuccess(data) {},
    onError(data) {},
  });

  // stake bt
  const { write: stakeBtWrite } = useContractWrite({
    ...stakeBtConfig,
    onError(data) {
      console.log("stakeBtWrite error", data);
    },
    onSuccess(data) {
      setBtAmount(0);
    },
  });

  // prepare unstake bt
  const { config: unstakeBtConfig } = usePrepareContractWrite({
    ...btStakingPoolContractConfig,
    functionName: "unstake",
    args: [ethers.utils.parseEther(btAmount.toString())],
    onSuccess(data) {},
  });

  // unstake bt
  const { write: unstakeBtWrite } = useContractWrite({
    ...unstakeBtConfig,
    onSuccess(data) {},
  });

  // claim bt rewards
  const { write: claimBtWrite } = useContractWrite({
    mode: "recklesslyUnprepared",
    ...btStakingPoolContractConfig,
    functionName: "claim",
    args: [],
    onSuccess(data) {},
    onError(data) {},
  });

  // balance of bt
  useContractRead({
    address: contractAddresses[activeChain?.network]?.btToken,
    abi: IERC20MetadataABI,
    functionName: "balanceOf",
    args: [connectedAddress],
    onError(data) {},
    onSuccess(data) {
      setBtBalance(ethers.utils.formatEther(data));
    },
    watch: true,
  });

  // total bt staked
  useContractRead({
    address: contractAddresses[activeChain?.network]?.btToken,
    abi: IERC20MetadataABI,
    functionName: "balanceOf",
    args: [btStakingPoolContractConfig.address],
    onError(data) {},
    onSuccess(data) {
      setTotalBtStaked(ethers.utils.formatEther(data));
    },
    watch: true,
  });

  /* LP */
  // lpAllowance
  useContractRead({
    address: contractAddresses[activeChain?.network]?.lpToken,
    abi: IERC20MetadataABI,
    functionName: "allowance",
    args: [connectedAddress, lpStakingPoolContractConfig.address],
    // watch: true,
    onError(data) {},
    onSuccess(data) {
      setLpAllowance(data);
    },
  });

  // prepare approve lp
  const { config: approveLpConfig } = usePrepareContractWrite({
    address: contractAddresses[activeChain?.network]?.btToken,
    abi: IERC20MetadataABI,
    functionName: "approve",
    args: [
      lpStakingPoolContractConfig.address,
      ethers.constants.MaxUint256.sub("1").toString(),
    ],
    onSuccess(data) {},
  });

  // infinite approve lp
  const { write: approveLpWrite } = useContractWrite({
    ...approveLpConfig,
    onSuccess(data) {},
  });

  // prepare stake lp
  const { config: stakeLpConfig } = usePrepareContractWrite({
    ...lpStakingPoolContractConfig,
    functionName: "stake",
    args: [ethers.utils.parseEther(lpAmount.toString())],
    onSuccess(data) {},
    onError(data) {},
  });

  // stake lp
  const { write: stakeLpWrite } = useContractWrite({
    ...stakeLpConfig,
    onError(e) {},
    onSuccess(data) {
      setBtAmount(0);
    },
  });

  // prepare unstake lp
  const { config: unstakeLpConfig } = usePrepareContractWrite({
    ...lpStakingPoolContractConfig,
    functionName: "unstake",
    args: [ethers.utils.parseEther(lpAmount.toString())],
    onSuccess(data) {},
  });

  // unstake lp
  const { write: unstakeLpWrite } = useContractWrite({
    ...unstakeLpConfig,
    onSuccess(data) {},
  });

  // claim lp rewards
  const { write: claimLpWrite } = useContractWrite({
    mode: "recklesslyUnprepared",
    ...lpStakingPoolContractConfig,
    functionName: "claim",
    args: [],
    onSuccess(data) {},
    onError(data) {},
  });

  // balance of lp
  useContractRead({
    address: contractAddresses[activeChain?.network]?.lpToken,
    abi: IERC20MetadataABI,
    functionName: "balanceOf",
    args: [connectedAddress],
    onError(data) {},
    onSuccess(data) {
      setLpBalance(ethers.utils.formatEther(data));
    },
    watch: true,
  });

  // total lp staked
  useContractRead({
    address: contractAddresses[activeChain?.network]?.lpToken,
    abi: IERC20MetadataABI,
    functionName: "balanceOf",
    args: [lpStakingPoolContractConfig.address],
    onError(data) {},
    onSuccess(data) {
      setTotalLpStaked(ethers.utils.formatEther(data));
    },
    watch: true,
  });

  /* ZAP */
  useBalance({
    address: connectedAddress,
    onError(data) {},
    onSuccess(data) {
      setZapBalance(+data.formatted);
    },
  });

  /* handle input amount changes */
  // bt staking
  const handleBtAmount = (e) => {
    setBtAmount(e.target.value ? e.target.value : 0);
  };

  // lp staking
  const handleLpAmount = (e) => {
    setLpAmount(e.target.value ? e.target.value : 0);
  };

  // zap in - amount in gas token
  const handleZapAmount = (e) => {
    setZapAmount(e.target.value ? e.target.value : 0);
  };

  return (
    <Connect isConnected={isConnected} activeChain={activeChain}>
      <AppContainer>
        <Navbar />
        <Container>
          <div className={styles.innerContainer}>
            <Grid>
              {/* <GridRow>
                <GridCell colSpan={2}>
                  <div className={styles.cardContainer}>
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
                </GridCell>
              </GridRow> */}
              <GridRow>
                <GridCell2>
                  <div className={styles.assetContainer}>
                    <StakeDiagram
                      stakeSymbol={lpTokenSymbol}
                      rewardSymbol={"BT"}
                      stakeName={lpTokenSymbol}
                      rewardName={"Better Token"}
                    />
                  </div>
                </GridCell2>
                <GridCell2>
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
                  </div>
                </GridCell2>
              </GridRow>
              <GridRow>
                <GridCell2>
                  <div className={styles.assetContainer}>
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
                                  {totalLpStaked}{" "}
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
                              max={lpBalance}
                              placeholder={0}
                              value={lpAmount > 0 ? lpAmount : ""}
                              setValue={setLpAmount}
                            />
                          </GridCell3>
                          <GridCell3>
                            <InputNumber
                              onChange={handleZapAmount}
                              min={0}
                              max={zapBalance}
                              placeholder={0}
                              value={zapAmount > 0 ? zapAmount : ""}
                              setValue={setZapAmount}
                            />
                          </GridCell3>
                        </GridRow>
                        <GridRow>
                          <GridCell3>
                            {ethers.BigNumber.from(lpAllowance.toString()).lte(
                              ethers.BigNumber.from("0")
                            ) ? (
                              <Button onClick={approveLpWrite}>Approve</Button>
                            ) : (
                              <Button onClick={stakeLpWrite}>Stake</Button>
                            )}
                          </GridCell3>
                          <GridCell3>
                            <Button onClick={unstakeLpWrite}>Unstake</Button>
                          </GridCell3>
                          <GridCell3>
                            <Button onClick={() => {}} disabled>
                              Zap in
                            </Button>
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
                </GridCell2>
                <GridCell2>
                  <div className={styles.assetContainer}>
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
                                <b>{totalBtStaked} BT</b>
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
                </GridCell2>
              </GridRow>
            </Grid>
          </div>
        </Container>
      </AppContainer>
    </Connect>
  );
}

export default Staking;
