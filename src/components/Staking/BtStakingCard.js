import { Button, ButtonWithInfo } from "../common/Button";
import { Card, CardBlueBgBlackBorder } from "../common/Card";
import { Grid, GridRow } from "../common/Grid";
import { InputNumber } from "../common/Input";
import Col from "./Col";
import { ethers } from "ethers";
import { useContext, useState } from "react";
import WindowContext from "../../context/WindowContext";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
} from "wagmi";
import { contractAddresses } from "../../static/contractAddresses";
import BtStakingABI from "../../static/ABI/BtStakingABI.json";
import BTABI from "../../static/ABI/BTABI.json";
import AlertContext from "../../context/AlertContext";
import { bignumber } from "mathjs";
import { CenterText, MedText, SmallText, NormalText } from "../common/Text";

const BtStakingCard = (props) => {
  /* global hooks */
  const windowDimension = useContext(WindowContext);
  const { address: connectedAddress, isConnected } = useAccount();
  const { chain: activeChain } = useNetwork();
  const [alertMessageList, setAlertMessageList] = useContext(AlertContext);

  /* constants */
  const btStakingPoolContractConfig = {
    address: contractAddresses[activeChain?.network]?.btStaking,
    abi: BtStakingABI,
  };

  const btTokenContractConfig = {
    address: contractAddresses[activeChain?.network]?.btToken,
    abi: BTABI,
  };

  /* states */
  const [btAmount, setBtAmount] = useState(0);
  const [btAllowance, setBtAllowance] = useState(bignumber("0"));
  const [btBalance, setBtBalance] = useState(0);
  const [totalBtStaked, setTotalBtStaked] = useState(0);
  const [pendingRewards, setPedingRewards] = useState(0);

  /* web3 read/write */
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

  // infinite approve bt
  const { write: approveBtWrite } = useContractWrite({
    ...btTokenContractConfig,
    mode: "recklesslyUnprepared",
    functionName: "approve",
    args: [
      btStakingPoolContractConfig.address,
      ethers.constants.MaxUint256.sub("1").toString(),
    ],
    onSettled(data) {
      setAlertMessageList([...alertMessageList, `Approving BT token...`]);
    },
    onSuccess(data) {
      setAlertMessageList([
        ...alertMessageList,
        `Successfully approved BT tokens`,
      ]);
    },
  });

  // stake bt
  const { write: stakeBtWrite } = useContractWrite({
    ...btStakingPoolContractConfig,
    mode: "recklesslyUnprepared",
    functionName: "stake",
    args: [ethers.utils.parseEther(btAmount.toString())],
    onMutate(data) {
      setAlertMessageList((alertMessageList) => [
        ...alertMessageList,
        `Staking BT tokens...`,
      ]);
    },
    onError(data) {
      setAlertMessageList((alertMessageList) => [
        ...alertMessageList,
        `Failed to stake BT tokens`,
      ]);
    },
    onSuccess(data) {
      setBtAmount(0);
      setAlertMessageList((alertMessageList) => [
        ...alertMessageList,
        `Successfully staked BT tokens`,
      ]);
    },
  });

  // unstake bt
  const { write: unstakeBtWrite } = useContractWrite({
    ...btStakingPoolContractConfig,
    functionName: "unstake",
    args: [ethers.utils.parseEther(btAmount.toString())],
    onMutate(data) {
      setAlertMessageList((alertMessageList) => [
        ...alertMessageList,
        `Unstaking BT tokens...`,
      ]);
    },
    onError(data) {
      setAlertMessageList([...alertMessageList, `Failed to unstake BT tokens`]);
    },
    onSuccess(data) {
      setAlertMessageList([
        ...alertMessageList,
        `Successfully unstaked BT tokens`,
      ]);
    },
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

  // pending staking rewards
  useContractRead({
    ...btStakingPoolContractConfig,
    functionName: "getPendingRewards",
    args: [connectedAddress],
    onError(data) {},
    onSuccess(data) {
      setPedingRewards(ethers.utils.formatEther(data));
    },
    watch: true,
  });

  /* handle callback */
  // bt staking
  const handleBtAmount = (e) => {
    setBtAmount(e.target.value ? e.target.value : 0);
  };

  return (
    <Card
      padding={1}
      style={
        ["xxs"].filter((b) => b == windowDimension.screen).length > 0
          ? { display: "none" }
          : {}
      }
    >
      <Grid>
        <GridRow style={{ marginBottom: "1rem" }}>
          <Col xs={3.5}>
            <CardBlueBgBlackBorder style={{ width: "100%" }}>
              <CenterText>
                <b>Total staked:</b>
              </CenterText>
            </CardBlueBgBlackBorder>
          </Col>
          <Col xs={2.5}>
            <CenterText>
              <b>{totalBtStaked} BT</b>
            </CenterText>
          </Col>
          <Col xs={3.5}>
            <CardBlueBgBlackBorder style={{ width: "100%" }}>
              <CenterText>
                <b>Current APR:</b>
              </CenterText>
            </CardBlueBgBlackBorder>
          </Col>
          <Col xs={2.5}>
            <CenterText>
              <b>brrrrr%</b>
            </CenterText>
          </Col>
        </GridRow>
        <GridRow>
          <Col xs={12}>
            <InputNumber
              onChange={handleBtAmount}
              min={0}
              max={btBalance}
              placeholder={0}
              value={btAmount > 0 ? btAmount : ""}
              setValue={setBtAmount}
            />
          </Col>
        </GridRow>
        <GridRow>
          <Col xs={6}>
            {ethers.BigNumber.from(btAllowance.toString()).lte(
              ethers.BigNumber.from("0")
            ) ? (
              <Button onClick={approveBtWrite}>Approve</Button>
            ) : (
              <Button onClick={stakeBtWrite}>Stake</Button>
            )}
          </Col>
          <Col xs={6}>
            <Button onClick={unstakeBtWrite}>Unstake</Button>
          </Col>
        </GridRow>
        <GridRow>
          <Col xs={12}>
            <ButtonWithInfo 
              onClick={claimBtWrite}
              info={
                <SmallText>
                  <NormalText>
                    {pendingRewards} {props.nativeGas}
                  </NormalText>
                </SmallText>
              }
            >
              <MedText>Claim</MedText>
            </ButtonWithInfo>
          </Col>
        </GridRow>
      </Grid>
    </Card>
  );
};

export default BtStakingCard;
