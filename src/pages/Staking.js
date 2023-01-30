import { Button } from "../components/common/Button";
import { Contract, ethers } from "ethers";
import { useCallback, useContext, useEffect, useState } from "react";
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
import LpStakingABI from "../static/ABI/LpStakingABI.json";
import BTABI from "../static/ABI/BTABI.json";
import IERC20MetadataABI from "../static/ABI/IERC20MetadataABI.json";

import styles from "./Staking.module.css";
import {
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useProvider,
} from "wagmi";
import { watchContractEvent } from "@wagmi/core";
import { bignumber } from "mathjs";
import Connect from "../components/common/Connect";
import { FancyText } from "../components/common/Text";
import Dropdown from "../components/common/Dropdown";
import AlertContext from "../context/AlertContext";

function Staking() {
  const [alertMessageList, setAlertMessageList] = useContext(AlertContext);

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
    abi: LpStakingABI,
  };

  const btTokenContractConfig = {
    address: contractAddresses[activeChain?.network]?.btToken,
    abi: BTABI,
  };

  const lpTokenContractConfig = {
    address: contractAddresses[activeChain?.network]?.lpToken,
    abi: IERC20MetadataABI,
  };

  // btAllowance bt
  useContractRead({
    ...btTokenContractConfig,
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
    ...btTokenContractConfig,
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
    onSettled(data) {
      setAlertMessageList([...alertMessageList, `Approving BT token...`]);
    },
    onSuccess(data) {},
  });

  // prepare stake bt
  // const { config: stakeBtConfig } = usePrepareContractWrite({
  //   ...btStakingPoolContractConfig,
  //   functionName: "stake",
  //   args: [ethers.utils.parseEther(btAmount.toString())],
  //   onSuccess(data) {},
  //   onError(data) {},
  //   watch: true,
  // });

  const onStakingBtCallback = (type) => {
    if (type == "staking") {
      setAlertMessageList((alertMessageList) => [
        ...alertMessageList,
        `Staking BT tokens...`,
      ]);
    } else if (type == "error") {
      setAlertMessageList((alertMessageList) => [
        ...alertMessageList,
        `Failed to stake BT tokens`,
      ]);
    } else if (type == "success") {
      setAlertMessageList((alertMessageList) => [
        ...alertMessageList,
        `Successfully staked BT tokens`,
      ]);
    } else {
    }
  };

  // stake bt
  const { write: stakeBtWrite } = useContractWrite({
    ...btStakingPoolContractConfig,
    mode: "recklesslyUnprepared",
    functionName: "stake",
    args: [ethers.utils.parseEther(btAmount.toString())],
    onMutate(data) {
      onStakingBtCallback("staking");
    },
    onError(data) {
      onStakingBtCallback("error");
    },
    onSuccess(data) {
      setBtAmount(0);
      onStakingBtCallback("success");
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
    ...btTokenContractConfig,
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
    ...btTokenContractConfig,
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
    ...lpTokenContractConfig,
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
    ...lpTokenContractConfig,
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
    watch: true,
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
    ...lpTokenContractConfig,
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
    ...lpTokenContractConfig,
    functionName: "balanceOf",
    args: [lpStakingPoolContractConfig.address],
    onError(data) {},
    onSuccess(data) {
      setTotalLpStaked(ethers.utils.formatEther(data));
    },
    watch: true,
  });

  // user

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

  // const unwatch = watchContractEvent(
  //   {
  //     address: "0x2B0d36FACD61B71CC05ab8F3D2355ec3631C0dd5",
  //     abi: IERC20MetadataABI,
  //     eventName: "Transfer",
  //     onSuccess(data) {
  //       console.log("event listener success", data);
  //     },
  //     onError(data) {
  //       console.log("event listener error", data);
  //     },
  //   },
  //   (from, to, value) => {
  //     console.log("event listener", from, to, value);
  //   }
  // );

  /* APR calculations */
  // // fetch contract instance
  // const contract = new ethers.Contract(
  //   "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70",
  //   IERC20MetadataABI,
  //   useProvider()
  // );

  // // fetch contract event logs
  // (async () => {
  //   const logs = await contract.filters.Transfer();
  //   const _logs = await contract.queryFilter(logs, 24952070);
  //   console.log(
  //     "event listener logs",
  //     _logs.map((log) => {
  //       return [
  //         log.args.from,
  //         log.args.to,
  //         ethers.utils.formatEther(log.args.value),
  //       ];
  //     })
  //   );
  // })();

  return (
    <Connect isConnected={isConnected} activeChain={activeChain}>
      <AppContainer>
        <Navbar />
        <Container overflow={true}>
          <div className={styles.innerContainer}>
            <Grid>
              <GridRow>
                <GridCell colSpan={2}>
                  <div className={styles.cardContainer}>
                    <Card>
                      <Grid>
                        <GridRow>
                          <GridCell colSpan={3}>
                            <FancyText
                              style={{
                                textAlign: "center",
                                fontSize: "2rem",
                                textDecoration: "underline",
                              }}
                            >
                              Staking
                            </FancyText>
                          </GridCell>
                        </GridRow>
                        <GridRow>
                          <GridCell3>
                            <InputNumber
                              max={0}
                              min={0}
                              onChange={() => {}}
                              placeholder={"hi"}
                              value={0}
                            />
                          </GridCell3>
                          <GridCell3>
                            <Dropdown
                              currentItem={"AVAX"}
                              currentItemLabel={"AVAX"}
                              setCurrentItem={() => {}}
                              itemList={[]}
                              itemLabelList={[
                                "BSC",
                                "AVAX",
                                "MATIC",
                                "FTM",
                                "HARDHAT",
                              ]}
                            />
                          </GridCell3>
                          <GridCell3>
                            <Button>Bridge</Button>
                          </GridCell3>
                        </GridRow>
                      </Grid>
                    </Card>
                  </div>
                </GridCell>
              </GridRow>
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
