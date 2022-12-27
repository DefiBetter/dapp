import { useAccount, useNetwork } from "wagmi";
import Button from "../components/common/Button";
import {
  Card,
  CardBlueBg,
  CardBlueBgBlackBorder,
} from "../components/common/Card";
import Connect from "../components/common/Connect";
import {
  AppContainer,
  Container,
  InnerContainer,
} from "../components/common/Container";
import {
  Grid,
  GridCell,
  GridRow,
  GridCell2,
  GridCell4,
} from "../components/common/Grid";
import { Input } from "../components/common/Input";
import { CenterText, FancyText } from "../components/common/Text";
import Navbar from "../components/Navbar/Navbar";

function StrategyVault() {
  /* account, network, configs */
  // account
  const { address: connectedAddress, isConnected } = useAccount();

  // network
  const { chain: activeChain } = useNetwork();

  return (
    <Connect isConnected={isConnected} activeChain={activeChain}>
      {true ? (
        <AppContainer>
          <Navbar></Navbar>
          <Container>
            <InnerContainer>
              <Card>
                <Grid>
                  <GridRow>
                    <GridCell colSpan={2}>Strategy Vaults</GridCell>
                  </GridRow>
                  <GridRow>
                    <GridCell2>
                      <div style={{ display: "flex" }}>
                        <Grid>
                          <GridRow>
                            <GridCell>
                              <div style={{ display: "flex" }}>
                                <div>BTN</div>
                                <div>Select Instrument...</div>
                              </div>
                            </GridCell>
                          </GridRow>
                          <GridRow>
                            <GridCell2>
                              <CardBlueBgBlackBorder>
                                <CenterText>
                                  <b>Vault Balance:</b>
                                </CenterText>
                              </CardBlueBgBlackBorder>
                            </GridCell2>
                            <GridCell2>
                              <CenterText>
                                <b>123 BNB</b>
                              </CenterText>
                            </GridCell2>
                          </GridRow>
                          <GridRow>
                            <GridCell colSpan={2}>
                              <Button>Mint</Button>
                            </GridCell>
                          </GridRow>
                          <GridRow>
                            <GridCell colSpan={2}>
                              <div style={{ display: "flex" }}>
                                <FancyText>for</FancyText>
                                <Input placeholder="Amount..." />
                              </div>
                              <CenterText>
                                <b>123 BNB</b>
                              </CenterText>
                            </GridCell>
                          </GridRow>
                          <GridRow>
                            <GridCell colSpan={2}>
                              <FancyText>
                                <CenterText>and receive</CenterText>
                              </FancyText>
                              <CardBlueBgBlackBorder>
                                <CenterText>123</CenterText>
                              </CardBlueBgBlackBorder>
                              <CenterText>
                                BTC/USD 10m 1.0 SD 1.1428 E <b>Bull 3</b>
                              </CenterText>
                            </GridCell>
                          </GridRow>
                        </Grid>
                        <Grid>
                          <GridRow>
                            <GridCell>
                              <div style={{ display: "flex" }}>
                                <div>BTN</div>
                                <div>Select Instrument...</div>
                              </div>
                            </GridCell>
                          </GridRow>
                          <GridRow>
                            <GridCell2>
                              <CardBlueBgBlackBorder>
                                <CenterText>
                                  <b>Vault Balance:</b>
                                </CenterText>
                              </CardBlueBgBlackBorder>
                            </GridCell2>
                            <GridCell2>
                              <CenterText>
                                <b>123 BNB</b>
                              </CenterText>
                            </GridCell2>
                          </GridRow>
                          <GridRow>
                            <GridCell colSpan={2}>
                              <Button>Mint</Button>
                            </GridCell>
                          </GridRow>
                          <GridRow>
                            <GridCell colSpan={2}>
                              <div style={{ display: "flex" }}>
                                <FancyText>for</FancyText>
                                <Input placeholder="Amount..." />
                              </div>
                              <CenterText>
                                <b>123 BNB</b>
                              </CenterText>
                            </GridCell>
                          </GridRow>
                          <GridRow>
                            <GridCell colSpan={2}>
                              <FancyText>
                                <CenterText>and receive</CenterText>
                              </FancyText>
                              <CardBlueBgBlackBorder>
                                <CenterText>123</CenterText>
                              </CardBlueBgBlackBorder>
                              <CenterText>
                                BTC/USD 10m 1.0 SD 1.1428 E <b>Bull 3</b>
                              </CenterText>
                            </GridCell>
                          </GridRow>
                        </Grid>
                      </div>
                    </GridCell2>
                  </GridRow>
                </Grid>
              </Card>
            </InnerContainer>
          </Container>
        </AppContainer>
      ) : (
        <div>loading app...</div>
      )}
    </Connect>
  );
}

export default StrategyVault;
