import { Button } from "../components/common/Button";
import { Contract, ethers } from "ethers";
import { useCallback, useContext, useEffect, useState } from "react";
import { Card, CardBlueBgBlackBorder } from "../components/common/Card";
import { Container } from "../components/common/container/Container";
import AppContainer from "../components/common/container/AppContainer";
import { Grid, GridCol, GridRow } from "../components/common/Grid";
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
import { CenterText, FancyText } from "../components/common/Text";
import Dropdown from "../components/common/Dropdown";
import AlertContext from "../context/AlertContext";
import WindowContext from "../context/WindowContext";
import LpStakingCard from "../components/Staking/LpStakingCard";
import BtStakingCard from "../components/Staking/BtStakingCard";

function Staking() {
  const windowDimension = useContext(WindowContext);

  const [alertMessageList, setAlertMessageList] = useContext(AlertContext);

  // fetch account and current network
  const { address: connectedAddress, isConnected } = useAccount();
  const { chain: activeChain } = useNetwork();

  // ------vars--------------------------
  const [bridgeAmount, setBridgeAmount] = useState(0);

  /* set lp token symbol */
  const [lpTokenSymbol, setLpTokenSymbol] = useState();
  useEffect(() => {
    setLpTokenSymbol(
      `BT-${contractAddresses[activeChain?.network]?.nativeGas} LP`
    );
  }, [activeChain]);

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
    <Container overflow={true}>
      <div className={styles.innerContainer}>
        <Grid>
          {/* <GridRow style={{ marginBottom: "1rem" }}>
            <GridCol xs={12}>
              <div className={styles.cardContainer}>
                <Card>
                  <Grid>
                    <GridRow>
                      <GridCol colSpan={3}>
                        <FancyText
                          style={{
                            textAlign: "center",
                            fontSize: "2rem",
                            textDecoration: "underline",
                          }}
                        >
                          Staking
                        </FancyText>
                      </GridCol>
                    </GridRow>
                    <GridRow>
                      <GridCol>
                        <InputNumber
                          max={0}
                          min={0}
                          onChange={() => {}}
                          placeholder={"hi"}
                          value={0}
                        />
                      </GridCol>
                      <GridCol>
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
                      </GridCol>
                      <GridCol>
                        <Button>Bridge</Button>
                      </GridCol>
                    </GridRow>
                  </Grid>
                </Card>
              </div>
            </GridCol>
          </GridRow> */}
          <GridRow style={{ flexWrap: "wrap" }}>
            <GridCol xs={12} sm={12} md={6} lg={6}>
              <div
                // style={
                //   ["xs", "sm"].filter((b) => b == windowDimension.screen)
                //     .length > 0
                //     ? { width: "100%" }
                //     : {}
                // }
                className={styles.assetContainer}
              >
                <StakeDiagram
                  stakeSymbol={lpTokenSymbol}
                  rewardSymbol={"BT"}
                  stakeName={lpTokenSymbol}
                  rewardName={"Better Token"}
                />
                <LpStakingCard />
              </div>
            </GridCol>
            <GridCol xs={12} sm={12} md={6} lg={6}>
              <div
                // style={
                //   ["xs", "sm"].filter((b) => b == windowDimension.screen)
                //     .length > 0
                //     ? { width: "100vw" }
                //     : {}
                // }
                className={styles.assetContainer}
              >
                <div>
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
                  <BtStakingCard />
                </div>
              </div>
            </GridCol>
          </GridRow>
        </Grid>
      </div>
    </Container>
  );
}

export default Staking;
