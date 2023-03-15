import { useNetwork } from "wagmi";
import { useEffect, useRef, useState } from "react";

import { contractAddresses } from "../static/contractAddresses";
import { ethers } from "ethers";

import Action from "../components/Better/Action";
import Bins from "../components/Better/Bins";
import Epoch from "../components/Better/Epoch";
import Pair from "../components/Better/Pair";
import Chart from "../components/Chart/Chart";
import useInstruments from "../hooks/useInstruments";
// ABIs
import DeFiBetterV1ABI from "../static/ABI/DeFiBetterV1ABI.json";
import ContentLoader from "react-content-loader";
import Stats from "../components/Better/Stats";
import useInstrumentBySelector from "../hooks/useInstrumentBySelector";
import useEpochData from "../hooks/useEpochData";
import useUserPendingBetterBalance from "../hooks/useUserPendingBetterBalance";
import useUserPositionValueForInstrument from "../hooks/useUserPositionValueForInstrument";
import useRewardPeriodInfo from "../hooks/useRewardPeriodInfo";
import useUserGainsInfo from "../hooks/useUserGainsInfo";

function Better() {
  /* account, network, configs */
  // account
  // network
  const { chain: activeChain } = useNetwork();

  // contract config
  const betterContractConfig = {
    address: contractAddresses[activeChain?.network]?.better,
    abi: DeFiBetterV1ABI,
  };

  /* states */
  // current instrument
  const [instrumentSelector, setInstrumentSelector] = useState();
  const [instrument, setInstrument] = useState();
  const [instrumentList, setInstrumentList] = useState();

  // epoch data
  const [epochData, setEpochData] = useState();
  const [normalisedBinValueList, setNormalisedBinValueList] = useState([
    0, 0, 0, 0, 0, 0, 0,
  ]);

  // bin data
  const [binAmountList, setBinAmountList] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [binTotal, setBinTotal] = useState(0);

  // better
  const [customFlatFee, setCustomFlatFee] = useState(10_000);
  const [customGainFee, setCustomGainFee] = useState(10_000);

  // misc
  const [nativeGas, setNativeGas] = useState();

  /* initial contract read/writes */
  // instrument list
  useInstruments((data) => {
    // create mutable copy
    let _data = [...data];
    if (data.length > 0) {
      // sort via underlyingDescription
      _data = _data.sort((a, b) => {
        const _a = a.underlyingDescription;
        const _b = b.underlyingDescription;
        return _a < _b ? -1 : _a > _b ? 1 : 0;
        // possibly add time sort as well later
      });

      setInstrumentList(_data);
      // set default instrument
      setInstrumentSelector(_data[0].selector);
    }
  });

  const {
    refetch: getInstrumentBySelectorRefetch,
    isRefetching: getInstrumentBySelectorIsRefetching,
  } = useInstrumentBySelector(instrumentSelector, (data) => {
    if (!instrument) {
      setInstrument(data);
    }

    if (data.selector === instrument.selector) {
      if (data.epoch !== instrument.epoch) {
        setInstrument(data);
      }
    }
    // Setting the retrieved instrument in the instrument List to update timers
    const tmpInstrumentList = instrumentList;
    for (let index = 0; index < tmpInstrumentList.length; index++) {
      if (tmpInstrumentList[index].selector === data.selector) {
        tmpInstrumentList[index] = data;
      }
    }
    setInstrumentList(tmpInstrumentList);
  });
  useEpochData(instrument, (data) => {
    setEpochData(data);
    setNormalisedBinValueList(
      data.binValues.map((v, i, binValues) => {
        const b = binValues.map((vv) => Number(ethers.utils.formatEther(vv)));
        return Math.max(...b) - 0 === 0
          ? 0
          : (Number(ethers.utils.formatEther(v)) - 0) / (Math.max(...b) - 0);
      })
    );
  });
  const pendingBetterBalance = useUserPendingBetterBalance(customGainFee);
  const userPosition = useUserPositionValueForInstrument(
    instrument,
    binAmountList
  );
  const rewardPeriodInfo = useRewardPeriodInfo();
  const userGainsInfo = useUserGainsInfo();

  /* useEffect */
  useEffect(() => {
    // set nativeGas for current network
    setNativeGas(contractAddresses[activeChain?.network]?.nativeGas);

    // set bin total
  }, [activeChain]);

  let interval = useRef(null);
  useEffect(() => {
    interval.current = setInterval(getInstrumentBySelectorRefetch, 10000);
    return () => {
      clearInterval(interval.current);
    };
  }, []);

  /* some extra details for dynamic calc
  max-width: 1219.2
  max-height: 812.16
  */

  return (
    <div id="full">
      {epochData && betterContractConfig ? (
        <div className="bg-db-light dark:bg-db-dark-nav transition-colors rounded-lg p-2 md:p-4">
          {/* DESKTOP VIEW */}
          <div className="hidden lg:block">
            {/* Top Row */}
            <div className="flex">
              <div className="w-full lg:w-2/3 px-2">
                <div className="w-full flex items-center md:items-start flex-col md:flex-row gap-3 lg:gap-0">
                  <div>
                    <Pair
                      instrumentList={instrumentList}
                      setInstrument={setInstrument}
                      instrument={instrument}
                      getInstrumentBySelectorRefetch={
                        getInstrumentBySelectorRefetch
                      }
                    />
                  </div>
                  <div className="ml-auto mr-auto">
                    <Epoch
                      instrument={instrument}
                      setInstrument={setInstrument}
                      getInstrumentBySelectorRefetch={
                        getInstrumentBySelectorRefetch
                      }
                      getInstrumentBySelectorIsRefetching={
                        getInstrumentBySelectorIsRefetching
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="w-1/3 px-2">
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
            </div>

            {/* Middle Row */}
            <div className="relative mt-2 flex w-full h-[480px]">
              <div className="w-2/3 h-full">
                <Chart
                  instrument={instrument}
                  epochData={epochData}
                  betterContractConfig={betterContractConfig}
                />
              </div>

              <div className="w-1/3 h-[480px] flex">
                <div className="w-1/2">
                  <Bins
                    binAmountList={binAmountList}
                    binTotal={binTotal}
                    setBinAmountList={setBinAmountList}
                    setBinTotal={setBinTotal}
                    pendingBetterBalance={pendingBetterBalance}
                    epochData={epochData}
                    normalisedBinValueList={normalisedBinValueList}
                    instrument={instrument}
                    nativeGas={nativeGas}
                    userPosition={userPosition}
                    betterContractConfig={betterContractConfig}
                    rewardPeriodInfo={rewardPeriodInfo}
                    userGainsInfo={userGainsInfo}
                  />
                </div>
                <div className="w-1/2">
                  <Stats
                    pendingBetterBalance={pendingBetterBalance}
                    epochData={epochData}
                    instrument={instrument}
                    nativeGas={nativeGas}
                    userPosition={userPosition}
                    betterContractConfig={betterContractConfig}
                    rewardPeriodInfo={rewardPeriodInfo}
                    userGainsInfo={userGainsInfo}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile View */}
          <div className="block lg:hidden">
            <div className="w-full">
              <div className="w-full flex items-center md:items-start flex-col md:flex-row gap-3 px-2">
                <div>
                  <Pair
                    instrumentList={instrumentList}
                    setInstrument={setInstrument}
                    instrument={instrument}
                    getInstrumentBySelectorRefetch={
                      getInstrumentBySelectorRefetch
                    }
                  />
                </div>
                <div className="ml-auto mr-auto">
                  <Epoch
                    instrument={instrument}
                    setInstrument={setInstrument}
                    getInstrumentBySelectorRefetch={
                      getInstrumentBySelectorRefetch
                    }
                    getInstrumentBySelectorIsRefetching={
                      getInstrumentBySelectorIsRefetching
                    }
                  />
                </div>
              </div>
              <div className="mt-4 flex w-full flex-col gap-4">
                <div className="relative w-full h-[480px]">
                  <Chart
                    instrument={instrument}
                    epochData={epochData}
                    betterContractConfig={betterContractConfig}
                  />
                  <Bins
                    binAmountList={binAmountList}
                    binTotal={binTotal}
                    setBinAmountList={setBinAmountList}
                    setBinTotal={setBinTotal}
                    pendingBetterBalance={pendingBetterBalance}
                    epochData={epochData}
                    normalisedBinValueList={normalisedBinValueList}
                    instrument={instrument}
                    nativeGas={nativeGas}
                    userPosition={userPosition}
                    betterContractConfig={betterContractConfig}
                    rewardPeriodInfo={rewardPeriodInfo}
                    userGainsInfo={userGainsInfo}
                  />
                </div>

                <div className="w-full px-2">
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
                <div className="w-full lg:w-1/2 h-[480px]">
                  <Stats
                    pendingBetterBalance={pendingBetterBalance}
                    epochData={epochData}
                    instrument={instrument}
                    nativeGas={nativeGas}
                    userPosition={userPosition}
                    betterContractConfig={betterContractConfig}
                    rewardPeriodInfo={rewardPeriodInfo}
                    userGainsInfo={userGainsInfo}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <BetterLoader />
      )}
    </div>
  );
}

const BetterLoader = () => (
  <ContentLoader
    speed={2}
    width={"100%"}
    height={"100%"}
    viewBox="0 0 300 150"
    backgroundColor="#1D2738"
    foregroundColor="#6D90C2"
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
