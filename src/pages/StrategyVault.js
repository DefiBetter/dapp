import {
  useAccount,
  useBalance,
  useContractRead,
  useContractReads,
  useContractWrite,
  useNetwork,
} from "wagmi";
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
import { Input, InputNumber } from "../components/common/Input";
import { CenterText, FancyText } from "../components/common/Text";
import Navbar from "../components/Navbar/Navbar";
import { contractAddresses } from "../static/contractAddresses";

// ABIs
import DeFiBetterV1ABI from "../static/ABI/DeFiBetterV1ABI.json";
import StrategyVaultABI from "../static/ABI/StrategyVaultABI.json";
import StrategyVaultManagerABI from "../static/ABI/StrategyVaultManagerABI.json";
import IERC20MetadataABI from "../static/ABI/IERC20MetadataABI.json";
import { useEffect, useState } from "react";
import Dropdown from "../components/common/Dropdown";
import { instrumentLabel } from "../components/common/helper";
import { ethers } from "ethers";

function StrategyVault() {
  /* account, network, configs */
  // account
  const { address: connectedAddress, isConnected } = useAccount();

  // network
  const { chain: activeChain } = useNetwork();

  // instrument
  const [currentInstrument, setCurrentInstrument] = useState();
  const [instrumentList, setInstrumentList] = useState();

  // vault
  const [vaultList, setVaultList] = useState();
  const [currentVault, setCurrentVault] = useState();

  // contract config
  const betterContractConfig = {
    address: contractAddresses[activeChain?.network]?.better,
    abi: DeFiBetterV1ABI,
  };

  // constants
  const strategyRef = [
    "BEAR 3",
    "BEAR 2",
    "BEAR 1",
    "NEUTRAL",
    "BULL 1",
    "BULL 2",
    "BULL 3",
  ];

  useContractRead({
    ...betterContractConfig,
    functionName: "getInstruments",
    onError(data) {},
    onSuccess(data) {
      console.log("getInstruments", data);
      setCurrentInstrument(data[0]);
      setInstrumentList(data);
    },
  });

  useContractRead({
    address: currentInstrument?.vaultManager,
    abi: StrategyVaultManagerABI,
    functionName: "getVaults",
    args: [],
    onError(data) {},
    onSuccess(data) {
      console.log("getVaults", data);
      setVaultList(data);
      setCurrentVault(data[3]);
    },
  });

  // useContractReads({
  //   contracts: vaultList?.map((vault) => {
  //     return {
  //       address: vault,
  //       abi: IERC20MetadataABI,
  //       functionName: "name",
  //     };
  //   }),
  //   onSuccess(data) {
  //     console.log("name list", data);
  //     setVaultNameList(data);
  //     setCurrentVault(data[3]); // should be neutral
  //   },
  // });

  const [mintAmount, setMintAmount] = useState(0);
  const [burnAmount, setBurnAmount] = useState(0);
  // helper functions
  const handleMintAmount = (e) => {
    setMintAmount(e.target.value ? e.target.value : 0);
  };
  const handleBurnAmount = (e) => {
    console.log("eee", e.target);
    setBurnAmount(e.tagret.value ? e.target.value : 0);
  };

  const [nativeGas, setNativeGas] = useState();

  /* useEffect */
  useEffect(() => {
    // set nativeGas for current network
    setNativeGas(contractAddresses[activeChain?.network]?.nativeGas);

    // set bin total
  }, [activeChain]);

  const [gasBalance, setGasBalance] = useState(0);
  const [strategyVaultBalance, setStrategyVaultBalance] = useState(0);

  // gas token balance user
  const { data: userData } = useBalance({
    address: connectedAddress,
    onSuccess(data) {
      console.log("bal", data);
      setGasBalance(+data.formatted);
    },
    watch: true,
  });

  // strategy vault token balance user
  useContractRead({
    address: currentVault,
    abi: IERC20MetadataABI,
    functionName: "balanceOf",
    args: [connectedAddress],
    onSuccess(data) {
      console.log(
        "balance of " + currentVault,
        +ethers.utils.formatEther(data)
      );
      setStrategyVaultBalance(+ethers.utils.formatEther(data));
    },
    watch: true,
  });

  // mint strategy vault token
  const { write: depositWrite } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: currentVault,
    abi: StrategyVaultABI,
    functionName: "deposit",
    overrides: {
      value: ethers.utils.parseEther(mintAmount.toString()),
    },
  });

  const { write: withdrawWrite } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: currentVault,
    abi: StrategyVaultABI,
    functionName: "withdraw",
    args: [ethers.utils.parseEther(burnAmount.toString())],
  });

  console.log("currentVault", currentVault);

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
                            <GridCell colSpan={2}>
                              <div
                                style={{
                                  height: "2.5rem",
                                  position: "relative",
                                }}
                              >
                                <Dropdown
                                  currentItemLabel={instrumentLabel(
                                    currentInstrument
                                  )}
                                  currentItem={currentInstrument}
                                  setCurrentItem={setCurrentInstrument}
                                  itemList={instrumentList}
                                  itemLabelList={instrumentList?.map(
                                    (instrument) => instrumentLabel(instrument)
                                  )}
                                />
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
                              <Button onClick={depositWrite}>Mint</Button>
                            </GridCell>
                          </GridRow>
                          <GridRow>
                            <GridCell colSpan={2}>
                              <div style={{ display: "flex" }}>
                                <FancyText>for</FancyText>
                                <InputNumber
                                  style={{ flex: 1 }}
                                  onChange={handleMintAmount}
                                  min={0}
                                  max={(() => {
                                    console.log(
                                      "bal input",
                                      +userData?.formatted
                                    );
                                    return +userData?.formatted;
                                  })()}
                                  placeholder="Mint amount..."
                                  value={mintAmount > 0 ? mintAmount : ""}
                                  setValue={setMintAmount}
                                />
                              </div>
                              <CenterText>
                                <b>{nativeGas}</b>
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
                            <GridCell colSpan={2}>
                              <div
                                style={{
                                  height: "2.5rem",
                                  position: "relative",
                                }}
                              >
                                <Dropdown
                                  currentItem={currentVault}
                                  currentItemLabel={
                                    strategyRef[
                                      vaultList?.indexOf(currentVault)
                                    ]
                                  }
                                  setCurrentItem={setCurrentVault}
                                  itemList={vaultList}
                                  itemLabelList={strategyRef}
                                />
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
                              <Button onClick={withdrawWrite}>Burn</Button>
                            </GridCell>
                          </GridRow>
                          <GridRow>
                            <GridCell colSpan={2}>
                              <div style={{ display: "flex" }}>
                                <FancyText>for</FancyText>
                                <InputNumber
                                  style={{ flex: 1 }}
                                  onChange={handleBurnAmount}
                                  min={0}
                                  max={strategyVaultBalance}
                                  placeholder="Burn amount..."
                                  value={burnAmount > 0 ? burnAmount : ""}
                                  setValue={setBurnAmount}
                                />
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
