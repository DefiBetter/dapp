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
import { useCallback, useEffect, useRef, useState } from "react";

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
import ContentLoader from "react-content-loader";

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

  const betterInterface = new ethers.utils.Interface(DeFiBetterV1ABI);

  /* states */
  // current instrument
  const [instrumentList, setInstrumentList] = useState();
  const [instrumentSelector, setInstrumentSelector] = useState();
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

  // reward period info
  const [rewardPeriodInfo, setRewardPeriodInfo] = useState();

  // better
  const [customFlatFee, setCustomFlatFee] = useState(10 * 1000);
  const [customGainFee, setCustomGainFee] = useState(10 * 1000);

  // misc
  const [nativeGas, setNativeGas] = useState();

  /* initial contract read/writes */
  // instrument list
  useContractRead({
    ...betterContractConfig,
    functionName: "getInstruments",
    onSuccess(data) {
      if (data.length > 0) {
        // set instrument list
        setInstrumentList(data);

        // set default instrument
        setInstrumentSelector(data[0].selector);
      }
    },
  });

  // instrument
  const {
    refetch: getInstrumentBySelectorRefetch,
    isRefetching: getInstrumentBySelectorIsRefetching,
  } = useContractRead({
    ...betterContractConfig,
    functionName: "getInstrumentBySelector",
    args: [instrumentSelector],
    onError(data) {},
    onSuccess(data) {
      if (!instrument) {
        setInstrument(data);
      }
      if (data.selector == instrument.selector) {
        if (data.epoch != instrument.epoch) {
          setInstrument(data);
        } else {
        }
      } else {
      }
    },
  });

  let interval = useRef(null);
  useEffect(() => {
    interval.current = setInterval(getInstrumentBySelectorRefetch, 1000);
    return () => {
      clearInterval(interval.current);
    };
  }, []);

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
      setPendingBetterBalance(+ethers.utils.formatEther(data));
    },
    onError(data) {},
    watch: true,
  });

  // user positions
  useContractRead({
    ...betterContractConfig,
    functionName: "getUserPositionValueForInstrument",
    args: [
      connectedAddress,
      instrument?.selector,
      instrument?.epoch,
      10000,
      10000,
      binAmountList,
    ],
    onSuccess(data) {
      setUserPosition(data);
    },
    onError(data) {},
    watch: true,
  });

  // user gains info
  useContractRead({
    ...betterContractConfig,
    functionName: "getUserGainsInfo",
    args: [connectedAddress],
    onError(data) {},
    onSuccess(data) {
      setUserGainsInfo(data);
    },
    watch: true,
  });

  // reward period info
  useContractRead({
    ...betterContractConfig,
    functionName: "rewardPeriodInfo",
    args: [],
    onError(data) {},
    onSuccess(data) {
      setRewardPeriodInfo(data);
    },
    watch: true,
  });

  /* useEffect */
  useEffect(() => {
    // set nativeGas for current network
    setNativeGas(contractAddresses[activeChain?.network]?.nativeGas);

    // set bin total
  }, [activeChain]);

  return (
    <Connect isConnected={isConnected} activeChain={activeChain}>
      <AppContainer>
        <Navbar></Navbar>
        {epochData && betterContractConfig ? (
          <Container>
            <div className={styles.header}>
              <Pair
                instrumentList={instrumentList}
                setInstrument={setInstrument}
                instrument={instrument}
              />
              <Epoch
                instrument={instrument}
                setInstrument={setInstrument}
                getInstrumentBySelectorRefetch={getInstrumentBySelectorRefetch}
                getInstrumentBySelectorIsRefetching={
                  getInstrumentBySelectorIsRefetching
                }
              />
              <Action
                betterContractConfig={betterContractConfig}
                instrument={instrument}
                binAmountList={binAmountList}
                setBinTotal={setBinTotal}
                customFlatFee={customFlatFee}
                customGainFee={customGainFee}
                pendingBetterBalance={pendingBetterBalance}
                nativeGas={nativeGas}
                setBinAmountList={setBinAmountList}
                binTotal={binTotal}
              />
            </div>
            <div className={styles.body}>
              <Chart
                instrument={instrument}
                epochData={epochData}
                betterContractConfig={betterContractConfig}
              />
              <Detail
                binAmountList={binAmountList}
                setBinAmountList={setBinAmountList}
                setBinTotal={setBinTotal}
                pendingBetterBalance={pendingBetterBalance}
                epochData={epochData}
                normalisedBinValueList={normalisedBinValueList}
                instrument={instrument}
                nativeGas={nativeGas}
                userPosition={userPosition}
                userGainsInfo={userGainsInfo}
                betterContractConfig={betterContractConfig}
                rewardPeriodInfo={rewardPeriodInfo}
              />
            </div>
          </Container>
        ) : (
          <Container>
            <BetterLoader />
          </Container>
        )}
      </AppContainer>
    </Connect>
  );
}

const BetterLoader = () => (
  <ContentLoader
    speed={2}
    width={"100%"}
    height={"100%"}
    viewBox="0 0 300 150"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    preserveAspectRatio="none"
  >
    {/* header */}
    <rect x="1" y="1" rx="3" ry="3" width="98" height="10" />
    <rect x="101" y="1" rx="3" ry="3" width="98" height="10" />
    <rect x="201" y="1" rx="3" ry="3" width="98" height="10" />
    {/* chart */}
    <rect
      x="1"
      y="13"
      rx="3"
      ry="3"
      width={98 + 2 + 98}
      height={150 - 13 - 1}
    />
    {/* bins */}
    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n, i, arr) => (
      <rect
        x={98 + 2 + 98 + 3}
        y={13 + (15 + 2) * n}
        rx="3"
        ry="3"
        width={48}
        height={150 / arr.length}
      />
    ))}
    {/* epoch data */}
    {[0, 1, 2].map((n, i, arr) => (
      <rect
        x={98 + 2 + 98 + 3 + 48 + 2}
        y={13 + (150 / arr.length + 2) * n}
        rx="3"
        ry="3"
        width={48}
        height={150 / arr.length}
      />
    ))}
  </ContentLoader>
);

export default Better;
