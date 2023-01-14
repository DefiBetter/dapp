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
import FancyTitle from "../components/common/Title";

function StrategyVault() {
  /* account, network, configs */
  // account
  const { address: connectedAddress, isConnected } = useAccount();

  // network
  const { chain: activeChain } = useNetwork();
  const [nativeGas, setNativeGas] = useState();

  // instrument
  const [currentInstrument, setCurrentInstrument] = useState();
  const [instrumentList, setInstrumentList] = useState();

  // vault
  const [vaultList, setVaultList] = useState();
  const [currentVault, setCurrentVault] = useState();
  const [vaultBalance, setVaultBalance] = useState(0);
  const [previewMintAmount, setPreviewMintAmount] = useState(0);
  const [previewBurnAmount, setPreviewBurnAmount] = useState(0);
  const [currentVaultName, setCurrentVaultName] = useState("");

  // user
  const [userGasBalance, setUserGasBalance] = useState(0);
  const [userVaultBalance, setUserVaultBalance] = useState(0);

  // input amounts
  const [mintAmount, setMintAmount] = useState(0);
  const [burnAmount, setBurnAmount] = useState(0);

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

  // get instrument list
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

  // get list of strategy vaults from vault manager
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

  // user gas balance
  useBalance({
    address: connectedAddress,
    onSuccess(data) {
      setUserGasBalance(+data.formatted);
    },
    watch: true,
  });

  // user vault balance
  useContractRead({
    address: currentVault,
    abi: IERC20MetadataABI,
    functionName: "balanceOf",
    args: [connectedAddress],
    onSuccess(data) {
      setUserVaultBalance(+ethers.utils.formatEther(data));
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
      value: ethers.utils.parseEther(mintAmount?.toString()),
    },
    onSuccess(data) {
      setMintAmount(0);
    },
  });

  // burn strategy vault token
  const { write: withdrawWrite } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: currentVault,
    abi: StrategyVaultABI,
    functionName: "withdraw",
    args: [ethers.utils.parseEther(burnAmount.toString())],
    onSuccess(data) {
      setBurnAmount(0);
    },
  });

  // balance of gas in vault
  useContractRead({
    address: currentVault,
    abi: StrategyVaultABI,
    functionName: "balance",
    args: [],
    onSuccess(data) {
      console.log("balance " + currentVault, +ethers.utils.formatEther(data));
      setVaultBalance(+ethers.utils.formatEther(data));
    },
    watch: true,
  });

  // preview gas deposit when mint vault token
  useContractRead({
    address: currentVault,
    abi: StrategyVaultABI,
    functionName: "previewDeposit",
    args: [ethers.utils.parseEther(mintAmount.toString())],
    onSuccess(data) {
      console.log("preview", +ethers.utils.formatEther(data));
      setPreviewMintAmount(+ethers.utils.formatEther(data));
    },
  });

  // preview gas withdraw when burn vault token
  useContractRead({
    address: currentVault,
    abi: StrategyVaultABI,
    functionName: "previewWithdraw",
    args: [ethers.utils.parseEther(burnAmount.toString())],
    onSuccess(data) {
      setPreviewBurnAmount(+ethers.utils.formatEther(data));
    },
  });

  // vault token name
  useContractRead({
    address: currentVault,
    abi: IERC20MetadataABI,
    functionName: "name",
    args: [],
    onSuccess(data) {
      setCurrentVaultName(data);
    },
  });

  // helper functions
  const handleMintAmount = (e) => {
    setMintAmount(e.target.value ? e.target.value : 0);
  };
  const handleBurnAmount = (e) => {
    setBurnAmount(e.target.value ? e.target.value : 0);
  };

  /* useEffect */
  useEffect(() => {
    // set nativeGas for current network
    setNativeGas(contractAddresses[activeChain?.network]?.nativeGas);

    // set bin total
  }, [activeChain]);

  return (
    <Connect isConnected={isConnected} activeChain={activeChain}>
      {true ? (
        <AppContainer>
          <Navbar></Navbar>
          <Container>
            <InnerContainer style={{ maxWidth: "55vw" }}>
              <Card>
                <Grid>
                  <GridRow>
                    <GridCell colSpan={2}>
                      <FancyTitle word1={"Strategy"} word2={"Vaults"} />
                    </GridCell>
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
                                <b>
                                  {vaultBalance} {nativeGas}
                                </b>
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
                                <FancyText style={{ marginRight: "1rem" }}>
                                  for
                                </FancyText>
                                <InputNumber
                                  style={{ flex: 1 }}
                                  onChange={handleMintAmount}
                                  min={0}
                                  max={userGasBalance}
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
                                <CenterText>{previewMintAmount}</CenterText>
                              </CardBlueBgBlackBorder>
                              <CenterText>{currentVaultName}</CenterText>
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
                                  <b>Vault Performance:</b>
                                </CenterText>
                              </CardBlueBgBlackBorder>
                            </GridCell2>
                            <GridCell2>
                              <CenterText>
                                <b>xxx% APR</b>
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
                                <FancyText style={{ marginRight: "1rem" }}>
                                  for
                                </FancyText>
                                <InputNumber
                                  style={{ flex: 1 }}
                                  onChange={handleBurnAmount}
                                  min={0}
                                  max={userVaultBalance}
                                  placeholder="Burn amount..."
                                  value={burnAmount > 0 ? burnAmount : ""}
                                  setValue={setBurnAmount}
                                />
                              </div>
                              <CenterText>
                                <b>{currentVaultName}</b>
                              </CenterText>
                            </GridCell>
                          </GridRow>
                          <GridRow>
                            <GridCell colSpan={2}>
                              <FancyText>
                                <CenterText>and receive</CenterText>
                              </FancyText>
                              <CardBlueBgBlackBorder>
                                <CenterText>{previewBurnAmount}</CenterText>
                              </CardBlueBgBlackBorder>
                              <CenterText>{nativeGas}</CenterText>
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
