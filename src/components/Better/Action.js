import { Button, ButtonWithInfo } from "../common/Button";
import styles from "./Action.module.css";
import { ethers } from "ethers";

import { usePrepareContractWrite, useContractWrite } from "wagmi";
import { useContext, useEffect } from "react";
import { MedText, NormalText, SmallText } from "../common/Text";
import AlertContext from "../../context/AlertContext";
import { timeFormat } from "../common/helper";

const Action = (props) => {
  const [alertMessageList, setAlertMessageList] = useContext(AlertContext);

  // open position
  let { write: depositWrite } = useContractWrite({
    ...{
      ...props.betterContractConfig,
      mode: "recklesslyUnprepared",
      functionName: "openPosition",
      args: [
        props.instrument.selector,
        props.customFlatFee,
        props.customGainFee,
        props.binAmountList.map((bin) => {
          return ethers.utils.parseEther(bin.toString());
        }),
      ],
      overrides: {
        value: ethers.utils.parseEther(
          (props.binTotal >= props.pendingBetterBalance
            ? props.binTotal - props.pendingBetterBalance
            : 0
          ).toString()
        ),
      },
      onError(data) {
        setAlertMessageList([...alertMessageList, JSON.stringify(data)]);
        console.log("openPosition error", data);
        console.log("openPosition pending", props.pendingBetterBalance);
        console.log("openPosition binTotal", props.binTotal);
      },
      onSuccess(data) {
        console.log("openPosition", data);
        setAlertMessageList([
          ...alertMessageList,
          `Successfully deposited ${props.binAmountList.reduce(
            (a, b) => a + b
          )} in Epoch ${
            props.instrument.epoch
          } at ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
        ]);
        props.setBinAmountList([0, 0, 0, 0, 0, 0, 0]);
        props.setBinTotal(0);
      },
    },
  });

  // claim rewards
  const { config: claimBetterRewardsConfig } = usePrepareContractWrite({
    ...props.betterContractConfig,
    functionName: "claimBetterRewards",
    args: [props.customGainFee],
  });
  let { write: claimWrite } = useContractWrite(claimBetterRewardsConfig);

  /* handle onclick */
  const handleOnDeposit = () => {
    if (props.binTotal > 0) {
      depositWrite();
    } else {
      console.log("cannot place empty bets");
    }
  };

  return (
    <div className={styles.container}>
      {Date.now() / 1000 >
      +props.instrument.lastEpochClosingTime.toString() +
        +props.instrument.epochDurationInSeconds.toString() ? (
        <Button disabled>Deposit</Button>
      ) : (
        <Button onClick={handleOnDeposit}>Deposit</Button>
      )}
      <ButtonWithInfo
        onClick={claimWrite}
        info={
          <SmallText>
            <NormalText>
              {props.pendingBetterBalance} {props.nativeGas}
            </NormalText>
          </SmallText>
        }
      >
        <MedText>Claim</MedText>
      </ButtonWithInfo>
    </div>
  );
};

export default Action;
