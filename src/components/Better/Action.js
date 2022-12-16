import styles from "./Action.module.css";
import { ethers } from "ethers";

import { usePrepareContractWrite, useContractWrite } from "wagmi";
import { useEffect } from "react";
import Button from "../common/Button";
import { MedText, NormalText, SmallText } from "../common/Text";

const Action = (props) => {
  console.log("ACTION", props.binAmountList);

  // open position
  const { config: openPositionConfig } = usePrepareContractWrite({
    ...props.betterContractConfig,
    functionName: "openPosition",
    args: [
      props.instrument?.selector,
      props.binAmountList.map((bin) => {
        return ethers.utils.parseEther(bin.toString());
      }),
      props.customFlatFee,
      props.customGainFee,
    ],
    overrides: {
      value: ethers.utils.parseEther(
        (props.binTotal > props.pendingBetterBalance
          ? props.binTotal - props.pendingBetterBalance
          : 0
        ).toString()
      ),
    },
  });

  let { write: depositWrite } = useContractWrite({
    ...openPositionConfig,
    onSuccess(data) {
      props.setBinAmountList([0, 0, 0, 0, 0, 0, 0]);
      console.log("data action", data);
    },
  });

  // claim rewards
  const { config: claimBetterRewardsConfig } = usePrepareContractWrite({
    ...props.betterContractConfig,
    functionName: "claimBetterRewards",
    args: [props.customGainFee],
  });
  let { write: claimWrite } = useContractWrite(claimBetterRewardsConfig);

  return (
    <div className={styles.container}>
      <Button
        onClick={depositWrite}
        disabled={
          Date.now() / 1000 >
          +props.instrument?.lastEpochClosingTime.toString() +
            +props.instrument?.epochDurationInSeconds.toString()
            ? true
            : false
        }
      >
        Deposit
      </Button>
      <Button onClick={claimWrite}>
        <MedText>Claim</MedText>
        <SmallText>
          <NormalText>
            {props.pendingBetterBalance} {props.nativeGas}
          </NormalText>
        </SmallText>
      </Button>
    </div>
  );
};

export default Action;
