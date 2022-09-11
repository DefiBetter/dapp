import { useEffect, useState } from "react";
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
import { Input, InputNumber } from "../components/common/Input";
import Navbar from "../components/Navbar/Navbar";
import StakeDiagram from "../components/Staking/StakeDiagram";
import styles from "./Staking.module.css";

function Staking() {
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
