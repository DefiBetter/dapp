import styles from "./Action.module.css";
import { ethers } from "ethers";

import { usePrepareContractWrite, useContractWrite } from "wagmi";
import { useEffect } from "react";

const Action = ({ instrument, binAmountList, betterContractConfig }) => {
  console.log("ACTION", binAmountList);

  // open position
  const { config: openPositionConfig } = usePrepareContractWrite({
    ...betterContractConfig,
    functionName: "openPosition",
    args: [
      instrument?.selector,
      binAmountList.map((bin) => {
        return ethers.utils.parseEther(bin.toString());
      }),
      "0",
      "0",
    ],
    overrides: {
      value: ethers.utils.parseEther(
        binAmountList.reduce((a, b) => Number(a) + Number(b), 0).toString()
      ),
    },
  });

  let { write: depositWrite } = useContractWrite(openPositionConfig);

  // claim rewards
  const { config: claimBetterRewardsConfig } = usePrepareContractWrite({
    ...betterContractConfig,
    functionName: "claimBetterRewards",
    args: ["0"],
  });
  let { write: claimWrite } = useContractWrite(claimBetterRewardsConfig);

  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={depositWrite}>
        Deposit
      </button>
      <button className={styles.button} onClick={claimWrite}>
        <div>Claim</div>
      </button>
    </div>
  );
};

export default Action;
