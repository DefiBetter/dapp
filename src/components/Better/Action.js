import { Button, ButtonWithInfo } from "../common/Button";
import styles from "./Action.module.css";
import { ethers } from "ethers";

import { usePrepareContractWrite, useContractWrite } from "wagmi";
import { useEffect } from "react";
import { MedText, NormalText, SmallText } from "../common/Text";

const Action = (props) => {
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
      onError(data) {},
      onSuccess(data) {},
    },
    onSuccess(data) {
      props.setBinAmountList([0, 0, 0, 0, 0, 0, 0]);
      props.setBinTotal(0);
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
