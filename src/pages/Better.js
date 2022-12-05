import {
  useContractRead,
  usePrepareContractWrite,
  useContractWrite,
  erc20ABI,
  useWaitForTransaction,
  useAccount,
  useNetwork,
  useContractReads,
} from "wagmi";
import { useCallback, useEffect, useState } from "react";

import { contractAddresses } from "../static/contractAddresses";
import { ethers } from "ethers";

import Action from "../components/Better/Action";
import Detail from "../components/Better/Detail";
import Epoch from "../components/Better/Epoch";
import Pair from "../components/Better/Pair";
import Chart from "../components/Chart/Chart";
import Navbar from "../components/Navbar/Navbar";
import styles from "./Better.module.css";
import { AppContainer, Container } from "../components/common/Container";

// ABIs
import DeFiBetterV1ABI from "../static/ABI/DeFiBetterV1ABI.json";
import AggregatorV3InterfaceABI from "../static/ABI/AggregatorV3InterfaceABI.json";
import Connect from "../components/common/Connect";

function Better() {
  /* account, network, configs */
  // account
  const { address: connectedAddress, isConnected } = useAccount();

  // network
  const { chain: activeChain } = useNetwork();

  // contract config
  const betterContractConfig = {
    address: contractAddresses[activeChain?.network]?.better,
    abi: DeFiBetterV1ABI,
  };

  /* states */
  // current instrument
  const [instrumentList, setInstrumentList] = useState();
  const [instrument, setInstrument] = useState();

  // epoch data
  const [epochData, setEpochData] = useState();
  const [normalisedBinValueList, setNormalisedBinValueList] = useState([
    0, 0, 0, 0, 0, 0, 0,
  ]);

  // bin data
  const [binAmountList, setBinAmountList] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [binTotal, setBinTotal] = useState(0);

  // user data
  const [pendingBetterBalance, setPendingBetterBalance] = useState(0);
  const [userPosition, setUserPosition] = useState();
  const [userGainsInfo, setUserGainsInfo] = useState();

  // better
  const [customFlatFee, setCustomFlatFee] = useState(0);
  const [customGainFee, setCustomGainFee] = useState(0);

  // misc
  const [nativeGas, setNativeGas] = useState();

  /* contract read/write */
  // instrument list
  useContractRead({
    ...betterContractConfig,
    functionName: "getInstruments",
    onSuccess(data) {
      if (data.length > 0) {
        // set instrument list
        setInstrumentList(data);

        // set default instrument
        setInstrument(data[0]);
      }
    },
  });

  // epoch data for currently selected instrument
  useContractRead({
    ...betterContractConfig,
    functionName: "getEpochData",
    args: [instrument?.epoch, instrument?.selector],
    onSuccess(data) {
      setEpochData(data);
      setNormalisedBinValueList(
        data.binValues.map((v, i, binValues) => {
          const b = binValues.map((vv) => Number(ethers.utils.formatEther(vv)));
          return Math.max(...b) - Math.min(...b) == 0
            ? 0
            : (Number(ethers.utils.formatEther(v)) - Math.min(...b)) /
                (Math.max(...b) - Math.min(...b));
        })
      );
    },
    watch: true,
  });

  // user pending rewards
  useContractRead({
    ...betterContractConfig,
    functionName: "getUserPendingBetterBalance",
    args: [connectedAddress, customGainFee],
    onSuccess(data) {
      Number(setPendingBetterBalance(ethers.utils.formatEther(data)));
      // console.log("pendingBetterBalance", data);
    },
    onError(data) {
      // console.log("pendingBetterBalance error", data);
    },
    watch: true,
  });

  // user positions
  useContractRead({
    ...betterContractConfig,
    functionName: "getUserPosition",
    args: [connectedAddress, instrument?.epoch, instrument?.selector],
    watch: true,
    onSuccess(data) {
      setUserPosition(data);
      // console.log("getUserPosition", data);
    },
    onError(data) {
      // console.log("getUserPosition error", data);
    },
    watch: true,
  });

  // user gains info
  useContractRead({
    ...betterContractConfig,
    functionName: "userGainsInfo",
    args: [connectedAddress],
    onError(data) {
      // console.log("userGainsInfo error", data);
    },
    onSuccess(data) {
      setUserGainsInfo(data);
      // console.log("userGainsInfo", data);
    },
    watch: true,
  });

  // chainlink instrument price history
  const aggContractConfig = {
    address: "",
    abi: AggregatorV3InterfaceABI,
  };
  useContractReads({
    contracts: [{}],
  });

  /* useEffect */
  useEffect(() => {
    // set nativeGas for current network
    setNativeGas(contractAddresses[activeChain?.network]?.nativeGas);

    // set bin total
    setBinTotal(binAmountList.reduce((a, b) => Number(a) + Number(b), 0));
  }, [activeChain, binAmountList]);

  return (
    <Connect isConnected={isConnected} activeChain={activeChain}>
      <AppContainer>
        <Navbar></Navbar>
        <Container>
          <div className={styles.header}>
            <Pair
              instrumentList={instrumentList}
              setInstrument={setInstrument}
              instrument={instrument}
            />
            <Epoch instrument={instrument} />
            <Action
              betterContractConfig={betterContractConfig}
              instrument={instrument}
              binAmountList={binAmountList}
              customFlatFee={customFlatFee}
              customGainFee={customGainFee}
              pendingBetterBalance={pendingBetterBalance}
              nativeGas={nativeGas}
              setBinAmountList={setBinAmountList}
              binTotal={binTotal}
            />
          </div>
          <div className={styles.body}>
            <Chart instrument={instrument} />
            <Detail
              binAmountList={binAmountList}
              setBinAmountList={setBinAmountList}
              pendingBetterBalance={pendingBetterBalance}
              epochData={epochData}
              normalisedBinValueList={normalisedBinValueList}
              instrument={instrument}
              nativeGas={nativeGas}
              userPosition={userPosition}
              userGainsInfo={userGainsInfo}
              betterContractConfig={betterContractConfig}
            />
          </div>
        </Container>
      </AppContainer>
    </Connect>
  );
}

export default Better;
