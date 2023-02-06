import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { contractAddresses } from "../../static/contractAddresses";
import { Button, ButtonWithInfo } from "../common/Button";
import { Card, CardBlueBgBlackBorder } from "../common/Card";
import Dropdown from "../common/Dropdown";
import { Grid, GridCol, GridRow } from "../common/Grid";
import {
  CountdownFormatted,
  instrumentLabel,
  trimNumber,
} from "../common/helper";
import { InputNumber } from "../common/Input";
import { CenterText, FancyText, MedText } from "../common/Text";
import FancyTitle from "../common/Title";
import IERC20MetadataABI from "../../static/ABI/IERC20MetadataABI.json";
import StrategyVaultABI from "../../static/ABI/StrategyVaultABI.json";
import StrategyVaultManagerABI from "../../static/ABI/StrategyVaultManagerABI.json";
import DeFiBetterV1ABI from "../../static/ABI/DeFiBetterV1ABI.json";
import {
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
  useNetwork,
} from "wagmi";
import { InnerContainer } from "../common/container/Container";

const VaultCard = () => {
  /* global hooks */
  const { address: connectedAddress, isConnected } = useAccount();
  const { chain: activeChain } = useNetwork();
  const [nativeGas, setNativeGas] = useState();

  /* constants */
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

  /* states */
  // instrument
  const [currentInstrument, setCurrentInstrument] = useState();
  const [instrumentList, setInstrumentList] = useState();

  // vault
  const [vaultList, setVaultList] = useState();
  const [currentVault, setCurrentVault] = useState();
  const [vaultBalanceInfo, setVaultBalanceInfo] = useState();
  const [previewMintAmount, setPreviewMintAmount] = useState(0);
  const [previewBurnAmount, setPreviewBurnAmount] = useState(0);
  const [currentVaultName, setCurrentVaultName] = useState("");
  const [queuedAmount, setQueuedAmount] = useState(0);
  const [currentVaultPerformance, setCurrentVaultPerformance] = useState("0");

  // user
  const [userGasBalance, setUserGasBalance] = useState(0);
  const [userVaultBalance, setUserVaultBalance] = useState(0);

  // input amounts
  const [mintAmount, setMintAmount] = useState(0);
  const [burnAmount, setBurnAmount] = useState(0);

  /* web3 read/write */
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
    onError(data) {
      console.log("getVaults currentInstrument", currentInstrument);
      console.log("getVaults vaultManager", currentInstrument?.vaultManager);
    },
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
    onMutate(data) {
      console.log("withdraw mutate", data);
    },
    onSuccess(data) {
      setBurnAmount(0);
    },
    onError(data) {
      console.log("withdraw error", data);
    },
  });

  // vault balance info
  useContractRead({
    address: currentVault,
    abi: StrategyVaultABI,
    functionName: "getVaultBalanceInfo",
    args: [],
    onSuccess(data) {
      console.log("getVaultBalanceInfo", currentVault, data);
      setVaultBalanceInfo(data);
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

  // vault performance
  useContractRead({
    address: currentVault,
    abi: StrategyVaultABI,
    functionName: "getVaultPerformance",
    args: [],
    onError(data) {
      console.log("getVaultPerformance", data);
    },
    onSuccess(data) {
      console.log("getVaultPerformance", data);
      setCurrentVaultPerformance(data);
    },
    watch: true,
  });

  /* handle callback */
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

  if (true) {
    return (
      <Card>
        <Grid>
          <GridRow>
            <GridCol padding={"0.5rem"} xs={12}>
              <FancyTitle word1={"Strategy"} word2={"Vaults"} />
            </GridCol>
          </GridRow>
          <GridRow>
            <GridCol padding={"0.5rem"} xs={6}>
              <Dropdown
                currentItemLabel={instrumentLabel(currentInstrument)}
                currentItem={currentInstrument}
                setCurrentItem={setCurrentInstrument}
                itemList={instrumentList}
                itemLabelList={instrumentList?.map((instrument) =>
                  instrumentLabel(instrument)
                )}
              />
            </GridCol>
            <GridCol padding={"0.5rem"} xs={6}>
              <Dropdown
                currentItem={currentVault}
                currentItemLabel={strategyRef[vaultList?.indexOf(currentVault)]}
                setCurrentItem={setCurrentVault}
                itemList={vaultList}
                itemLabelList={strategyRef}
              />
            </GridCol>
          </GridRow>
          <GridRow>
            <GridCol padding={"0.5rem"} xs={3}>
              <CardBlueBgBlackBorder>
                <CenterText>
                  <b>Vault Balance:</b>
                </CenterText>
              </CardBlueBgBlackBorder>
            </GridCol>
            <GridCol padding={"0.5rem"} xs={3}>
              <CenterText>
                <b>
                  {vaultBalanceInfo
                    ? trimNumber(
                        ethers.utils.formatEther(vaultBalanceInfo.totalBalance),
                        6
                      )
                    : null}{" "}
                  {nativeGas}
                </b>
              </CenterText>
            </GridCol>
            <GridCol padding={"0.5rem"} xs={3}>
              <CardBlueBgBlackBorder>
                <CenterText>
                  <b>Vault Performance:</b>
                </CenterText>
              </CardBlueBgBlackBorder>
            </GridCol>
            <GridCol padding={"0.5rem"} xs={3}>
              <CenterText>
                <b>
                  {currentVaultPerformance
                    ? trimNumber(
                        ethers.utils.formatEther(currentVaultPerformance) * 100,
                        6
                      )
                    : "0"}
                  %
                </b>
              </CenterText>
            </GridCol>
          </GridRow>
          <GridRow>
            <GridCol padding={"0.5rem"} xs={6}>
              <Grid>
                <GridRow>
                  <GridCol padding={"0.5rem"} xs={12}>
                    <Button onClick={depositWrite}>Mint</Button>
                  </GridCol>
                </GridRow>
                <GridRow>
                  <GridCol padding={"0.5rem"} xs={2}>
                    <FancyText style={{ marginRight: "1rem" }}>for</FancyText>
                  </GridCol>
                  <GridCol padding={"0.5rem"} xs={10}>
                    <InputNumber
                      style={{ flex: 1 }}
                      onChange={handleMintAmount}
                      min={0}
                      max={userGasBalance}
                      placeholder="Mint amount..."
                      value={mintAmount > 0 ? mintAmount : ""}
                      setValue={setMintAmount}
                    />
                  </GridCol>
                </GridRow>
                <GridRow style={{ flexWrap: "wrap" }}>
                  <GridCol padding={"0.5rem"} xs={12}>
                    <CenterText>
                      <b>{nativeGas}</b>
                    </CenterText>
                  </GridCol>
                  <GridCol padding={"0.5rem"} xs={12}>
                    <FancyText style={{ width: "100%" }}>
                      <CenterText>and receive</CenterText>
                    </FancyText>
                  </GridCol>
                </GridRow>
                <GridRow>
                  <GridCol padding={"0.5rem"} xs={12}>
                    <CardBlueBgBlackBorder style={{ width: "100%" }}>
                      <CenterText>{previewMintAmount}</CenterText>
                    </CardBlueBgBlackBorder>
                  </GridCol>
                </GridRow>
                <GridRow>
                  <GridCol padding={"0.5rem"} xs={12}>
                    <CenterText>{currentVaultName}</CenterText>
                  </GridCol>
                </GridRow>
              </Grid>
            </GridCol>
            <GridCol padding={"0.5rem"} xs={6}>
              <Grid>
                <GridRow>
                  <GridCol padding={"0.5rem"} xs={12}>
                    <ButtonWithInfo
                      onClick={withdrawWrite}
                      info={
                        <>
                          {queuedAmount} {nativeGas} (queued for{" "}
                          <CountdownFormatted
                            ms={
                              1674163322 * 1000 +
                              10 * 1000 * 60 * 60 * 24 * 36.5
                            }
                          />
                          )
                        </>
                      }
                    >
                      <MedText>
                        {queuedAmount > 0 && burnAmount > 0
                          ? `Claim queued\xa0 & \xa0burn`
                          : queuedAmount > 0
                          ? `Claim queued`
                          : `Burn`}
                      </MedText>
                    </ButtonWithInfo>
                  </GridCol>
                </GridRow>
                <GridRow>
                  <GridCol padding={"0.5rem"} xs={2}>
                    <FancyText style={{ marginRight: "1rem" }}>for</FancyText>
                  </GridCol>
                  <GridCol padding={"0.5rem"} xs={10}>
                    <InputNumber
                      style={{ flex: 1 }}
                      onChange={handleBurnAmount}
                      min={0}
                      max={userVaultBalance}
                      placeholder="Burn amount..."
                      value={burnAmount > 0 ? burnAmount : ""}
                      setValue={setBurnAmount}
                    />
                  </GridCol>
                </GridRow>
                <GridRow style={{ flexWrap: "wrap" }}>
                  <GridCol padding={"0.5rem"} xs={12}>
                    <CenterText>
                      <b>{currentVaultName}</b>
                    </CenterText>
                  </GridCol>
                  <GridCol padding={"0.5rem"} xs={12}>
                    <FancyText style={{ width: "100%" }}>
                      <CenterText>and receive</CenterText>
                    </FancyText>
                  </GridCol>
                </GridRow>
                <GridRow>
                  <GridCol padding={"0.5rem"} xs={12}>
                    <CardBlueBgBlackBorder style={{ width: "100%" }}>
                      <CenterText>{previewBurnAmount}</CenterText>
                    </CardBlueBgBlackBorder>
                  </GridCol>
                </GridRow>
                <GridRow>
                  <GridCol padding={"0.5rem"} xs={12}>
                    <CenterText>{nativeGas}</CenterText>
                  </GridCol>
                </GridRow>
              </Grid>
            </GridCol>
          </GridRow>
        </Grid>
      </Card>
    );
  }
};

export default VaultCard;
