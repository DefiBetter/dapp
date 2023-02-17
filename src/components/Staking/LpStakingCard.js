import { useContext, useState } from "react";
import WindowContext from "../../context/WindowContext";
import { Button } from "../common/Button";
import { Card, CardBlueBgBlackBorder } from "../common/Card";
import { Grid, GridRow } from "../common/Grid";
import { InputNumber } from "../common/Input";
import { CenterText } from "../common/Text";
import { ethers } from "ethers";
import { contractAddresses } from "../../static/contractAddresses";
import LpStakingABI from "../../static/ABI/LpStakingABI.json";
import IERC20MetadataABI from "../../static/ABI/IERC20MetadataABI.json";
import {
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
} from "wagmi";
import { bignumber } from "mathjs";
import Col from "./Col.js";

const LpStakingCard = () => {
  /* global hooks */
  const windowDimension = useContext(WindowContext);
  const { chain: activeChain } = useNetwork();
  const { address: connectedAddress, isConnected } = useAccount();

  /* constants */
  const lpStakingPoolContractConfig = {
    address: contractAddresses[activeChain?.network]?.lpStaking,
    abi: LpStakingABI,
  };

  const lpTokenContractConfig = {
    address: contractAddresses[activeChain?.network]?.lpToken,
    abi: IERC20MetadataABI,
  };

  /* states */
  const [lpAmount, setLpAmount] = useState(0);
  const [zapAmount, setZapAmount] = useState(0);
  const [lpAllowance, setLpAllowance] = useState(bignumber("0"));
  const [lpBalance, setLpBalance] = useState(0);
  const [zapBalance, setZapBalance] = useState(0);
  const [totalLpStaked, setTotalLpStaked] = useState(0);

  /* web3 read/write */
  /* LP */
  // lpAllowance
  useContractRead({
    ...lpTokenContractConfig,
    functionName: "allowance",
    args: [connectedAddress, lpStakingPoolContractConfig.address],
    watch: true,
    // watch: true,
    onError(data) {},
    onSuccess(data) {
      setLpAllowance(data);
    },
  });

  // infinite approve lp
  const { write: approveLpWrite } = useContractWrite({
    ...lpTokenContractConfig,
    mode: "recklesslyUnprepared",
    functionName: "approve",
    args: [
      lpStakingPoolContractConfig.address,
      ethers.constants.MaxUint256.sub("1").toString(),
    ],
    onSuccess(data) {},
  });

  // stake lp
  const { write: stakeLpWrite } = useContractWrite({
    ...lpStakingPoolContractConfig,
    mode: "recklesslyUnprepared",
    functionName: "stake",
    args: [0, ethers.utils.parseEther(lpAmount.toString()), connectedAddress],
    onError(e) {},
    onSuccess(data) {
      setLpAmount(0);
    },
  });

  // unstake lp
  const { write: unstakeLpWrite } = useContractWrite({
    ...lpStakingPoolContractConfig,
    mode: "recklesslyUnprepared",
    functionName: "unstake",
    args: [ethers.utils.parseEther(lpAmount.toString())],
    onSuccess(data) {},
  });

  // claim lp rewards
  const { write: claimLpWrite } = useContractWrite({
    ...lpStakingPoolContractConfig,
    mode: "recklesslyUnprepared",
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

  /* ZAP */
  useBalance({
    address: connectedAddress,
    onError(data) {},
    onSuccess(data) {
      setZapBalance(+data.formatted);
    },
  });

  /* handle callback */
  // lp staking
  const handleLpAmount = (e) => {
    setLpAmount(e.target.value ? e.target.value : 0);
  };

  // zap in - amount in gas token
  const handleZapAmount = (e) => {
    setZapAmount(e.target.value ? e.target.value : 0);
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
              <b>
                {totalLpStaked}{" "}
                {`BT-${contractAddresses[activeChain?.network]?.nativeGas} LP`}
              </b>
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
          <Col xs={6}>
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
          </Col>
          <Col xs={6}>
            <InputNumber
              onChange={handleZapAmount}
              min={0}
              max={zapBalance}
              placeholder={0}
              value={zapAmount > 0 ? zapAmount : ""}
              setValue={setZapAmount}
            />
          </Col>
        </GridRow>
        <GridRow>
          <Col>
            {ethers.BigNumber.from(lpAllowance.toString()).lte(
              ethers.BigNumber.from("0")
            ) ? (
              <Button onClick={approveLpWrite}>Approve</Button>
            ) : (
              <Button onClick={stakeLpWrite}>Stake</Button>
            )}
          </Col>
          <Col>
            <Button onClick={unstakeLpWrite}>Unstake</Button>
          </Col>
          <Col>
            <Button onClick={() => {}} disabled>
              Zap in
            </Button>
          </Col>
        </GridRow>
        <GridRow>
          <Col xs={12}>
            <Button onClick={claimLpWrite}>Claim</Button>
          </Col>
        </GridRow>
      </Grid>
    </Card>
  );
};

export default LpStakingCard;
