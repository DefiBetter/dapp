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
  return (
    <>
      <Navbar />
      <Container>
        <div className={styles.innerContainer}>
          <div className={styles.assetContainer}>
            <Card>
              <Grid>
                <GridRow>
                  <GridCell2>
                    <InputNumber />
                  </GridCell2>
                  <GridCell4>
                    <Button>Avax</Button>
                  </GridCell4>
                </GridRow>
                <GridRow>
                  <GridCell colSpan={3}>
                    <Button>Bridge</Button>
                  </GridCell>
                </GridRow>
              </Grid>
            </Card>
          </div>
        </div>
        <div className={styles.innerContainer}>
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
                    <InputNumber />
                  </GridCell3>
                  <GridCell3>
                    <InputNumber />
                  </GridCell3>
                </GridRow>
                <GridRow>
                  <GridCell3>
                    <Button>Stake</Button>
                  </GridCell3>
                  <GridCell3>
                    <Button>Unstake</Button>
                  </GridCell3>
                  <GridCell3>
                    <Button>Zap in</Button>
                  </GridCell3>
                </GridRow>
                <GridRow>
                  <GridCell colSpan={3}>
                    <Button>Claim</Button>
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
                    <InputNumber />
                  </GridCell>
                </GridRow>
                <GridRow>
                  <GridCell2>
                    <Button>Stake</Button>
                  </GridCell2>
                  <GridCell2>
                    <Button>Unstake</Button>
                  </GridCell2>
                </GridRow>
                <GridRow>
                  <GridCell colSpan={2}>
                    <Button>Claim</Button>
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
