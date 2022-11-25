import {
  useContractRead,
  usePrepareContractWrite,
  useContractWrite,
  erc20ABI,
  useWaitForTransaction,
  useAccount,
  useNetwork,
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

function Better() {
  // fetch account and current network
  const { address: connectedAddress, isConnected } = useAccount();
  const { chain: activeChain } = useNetwork();

  /* states */
  const [instrumentList, setInstrumentList] = useState();
  const [instrument, setInstrument] = useState();
  const [totalEpochDuration, setTotalEpochDuration] = useState();
  const [lastEpochClosingTime, setLastEpochClosingTime] = useState();

  /* components */
  // detail
  const [binAmountList, setBinAmountList] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [pendingRewards, setPendingRewards] = useState(0);
  const [customFlatFee, setCustomFlatFee] = useState(0);
  const [customGainFee, setCustomGainFee] = useState(0);

  const [nativeGas, setNativeGas] = useState();

  useEffect(() => {
    setNativeGas(contractAddresses[activeChain?.network]?.nativeGas);
  }, [activeChain]);

  const betterContractConfig = {
    address: contractAddresses[activeChain?.network]?.better,
    abi: DeFiBetterV1ABI,
  };

  console.log("betterContractConfig", betterContractConfig);

  /* Read */
  // instrument list
  useContractRead({
    ...betterContractConfig,
    functionName: "getInstruments",
    onSuccess(data) {
      if (data.length > 0) {
        // set instrument list
        setInstrumentList(data);
        console.log("instrumentList", data);

        // set default instrument
        setInstrument(data[0]);
        console.log("instrument", data[0]);
      }
    },
  });

  // epoch data for currently selected instrument
  useContractRead({
    ...betterContractConfig,
    functionName: "getEpochData",
    args: [1, instrument?.selector],
    onSuccess(data) {
      if (data.length > 0) {
        console.log("EPOCH DATA", data);
      }
    },
  });

  // user pending rewards
  useContractRead({
    ...betterContractConfig,
    functionName: "getPendingBetterRewards",
    args: [customGainFee],
    onSuccess(data) {
      Number(setPendingRewards(ethers.utils.formatEther(data)));
      console.log("pendingRewards", pendingRewards);
    },
    watch: true,
  });

  if (!isConnected) {
    return (
      <>
        <Navbar />
        <div>Please connect your wallet</div>
      </>
    );
  }

  if (activeChain?.unsupported) {
    return (
      <>
        <Navbar />
        <div>Unsupported chain</div>
      </>
    );
  }

  return (
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
            pendingRewards={pendingRewards}
            nativeGas={nativeGas}
          />
        </div>
        <div className={styles.body}>
          <Chart instrument={instrument} />
          <Detail
            binAmountList={binAmountList}
            setBinAmountList={setBinAmountList}
          />
        </div>
      </Container>
    </AppContainer>
  );

  // const {} = useContractRead({
  //   ...betterContractConfig,
  //   functionName: "getInstrumentSelectors",
  //   onSuccess(data) {
  //     if (data.length > 0) {
  //       // set selector
  //       for (let i = 0; i < instrumentList.length; i++) {
  //         if (instrumentList[i].)
  //       }
  //     }
  //   }
  // })

  /* Write */

  /**   
   * struct UnderlyingData {
          address addr;
          string description;
          uint decimals;
      }

      function getBinData(address underlying) external view returns(uint, uint);
      function getEpochData(uint _epoch, address underlying) external view returns(
          uint pot,
          uint numBets,
          uint closingPrice,
          uint binStart,
          uint binSize,
          uint16[7] memory betsPerBin,
          uint[7] memory binValues // holding worth of each bin
      );

      function getUserPositions(uint _epoch, address _underlying) external view returns(uint[7] memory);

      function placeTrades(address underlying, uint[7] calldata amounts) external payable;
      function claimBetterRewards() external;

      function getUnderlyings() external view returns(address[] memory);
      function getUnderlyingPrice(address underlying) external view returns(uint);
      function getUnderlyingsDecimalsDescription() external view returns(UnderlyingData[] memory data);
      function getPendingBetterRewards() external view returns(uint);
   */

  // TODO rerender when epoch timer runs out
  // TODO disable betting when in buffer time

  // ### CONSTS ##########################

  // const BN = ethers.BigNumber.from;
  // const betterContractConfig = {
  //   addressOrName: contractAddresses[activeChain?.network]?.better,
  //   contractInterface: BetterABI,
  // };
  // const BINS = 7;
  // const inline = { display: "inline", padding: "1rem" };

  // // ### STATES ##########################

  // const [underlying, setUnderlying] = useState({});
  // const [binBorders, setBinBorders] = useState({});
  // const [betSizes, setBetSizes] = useState(Array(BINS).fill(BN(0)));
  // const [betSizeSum, setBetSizeSum] = useState(BN(0));

  // useEffect(() => {
  //   setBetSizeSum(betSizes.reduce((a, b) => a.add(b)));
  // }, [betSizes]);

  // // ### CALLBACKS #######################

  // // ### READS ###########################

  // // ---update on page load---------------

  // // underlyings decimals + descriptions
  // const { data: underlyingDataArray } = useContractRead({
  //   ...betterContractConfig,
  //   functionName: "getUnderlyingsDecimalsDescription",
  //   onSuccess(data) {
  //     if (underlying && Object.keys(underlying).length === 0) {
  //       setUnderlying(data[0]);
  //     }
  //   },
  // });

  // // epoch duration
  // const { data: epochDuration } = useContractRead({
  //   ...betterContractConfig,
  //   functionName: "epochDurationInSeconds",
  //   select: (data) => parseInt(data),
  // });

  // // buffer duration
  // const { data: bufferDuration } = useContractRead({
  //   ...betterContractConfig,
  //   functionName: "bufferDurationInSeconds",
  //   select: (data) => parseInt(data),
  // });

  // // ---update on epoch-------------------

  // // last epoch end
  // const { data: lastEpochClose } = useContractRead({
  //   ...betterContractConfig,
  //   functionName: "lastEpochClose",
  //   watch: true,
  //   select: (data) => parseInt(data),
  // });

  // // bin starts & sizes
  // const underlyingValueToFixed = (v) =>
  //   parseFloat(ethers.utils.formatEther(v)).toFixed(3);

  // const { data: binData } = useContractRead({
  //   ...betterContractConfig,
  //   functionName: "getBinData",
  //   args: [underlying?.addr],
  //   watch: true,
  //   onSuccess(data) {
  //     setBinBorders(
  //       [...Array(BINS).keys()].map((i) => data[0].add(data[1].mul(i)))
  //     );
  //   },
  // });

  // // ---update per block------------------

  // // epoch
  // const { data: epoch } = useContractRead({
  //   ...betterContractConfig,
  //   functionName: "epoch",
  // });

  // // epoch data (pot, bin values, etc.)
  // const { data: epochData } = useContractRead({
  //   ...betterContractConfig,
  //   functionName: "getEpochData",
  //   args: [epoch, underlying.addr],
  // });

  // // underlying price
  // const { data: underlyingPrice } = useContractRead({
  //   ...betterContractConfig,
  //   functionName: "getUnderlyingPrice",
  //   args: [underlying?.addr],
  // });

  // // ### WRITES ##########################

  // // place trades
  // const { config: placeBetsConfig } = usePrepareContractWrite({
  //   ...betterContractConfig,
  //   functionName: "placeTrades",
  //   args: [
  //     underlying.addr, // underlying
  //     Array(BINS).fill(0), // array with respecitve bin amounts
  //   ],
  //   overrides: {
  //     from: connectedAddress,
  //     value: 10000,
  //   },
  // });

  // const { write: executePlaceBets } = useContractWrite(placeBetsConfig);

  // // claim rewards

  // // ### MISC ############################

  // // --- data getters -------------------

  // /* const getUnderlyingOptions = useCallback(
  //   () => underlyingDataArray?.map((underlyingDataEntry, index) =>
  //       <option
  //         value={index}
  //         key={index}
  //       >
  //         {underlyingDataEntry.description}
  //       </option>
  //     ) ?? <></>,
  //   [underlyingDataArray]
  // ); */

  // const getUnderlyingOptions = useCallback(
  //   () =>
  //     underlyingDataArray?.map((underlyingDataEntry) => (
  //       <button
  //         onClick={() => setUnderlying(underlyingDataEntry)}
  //         style={inline}
  //         key={"underlyingButton" + underlyingDataEntry.description}
  //       >
  //         {underlyingDataEntry.description}
  //       </button>
  //     )) ?? <></>,
  //   [underlyingDataArray]
  // );

  // function getBinElements() {
  //   return [...Array(BINS).keys()].map((k) => (
  //     <>
  //       <p aria-readonly={true} id={"bin" + k} key={"bin" + k} style={inline}>
  //         {underlyingValueToFixed(binBorders[k] ?? 0)}
  //       </p>

  //       <p
  //         aria-readonly={true}
  //         id={"binValue" + k}
  //         key={"binValue" + k}
  //         style={inline}
  //       >
  //         {underlyingValueToFixed(epochData?.binValues[k] ?? 0)}
  //       </p>

  //       <p
  //         aria-readonly={true}
  //         id={"betsPerBin" + k}
  //         key={"betsPerBin" + k}
  //         style={inline}
  //       >
  //         {epochData?.betsPerBin[k] ?? 0}
  //       </p>

  //       <input
  //         type="number"
  //         style={inline}
  //         id={"inputField" + k}
  //         key={"inputField" + k}
  //         onChange={betsInputHandler(k)}
  //       ></input>

  //       <br></br>
  //     </>
  //   ));
  // }

  // // --- button functions ---------------

  // /* function triggerSelectUnderlying(e) {
  //   setUnderlying(underlyingDataArray[e.target.value]);
  // } */

  // function betsInputHandler(k) {
  //   return (e) => {
  //     setBetSizes(
  //       betSizes?.map((v, i) =>
  //         i === k ? v.add(ethers.utils.parseUnits(e.target.value, 18)) : v
  //       )
  //     );
  //   };
  // }

  // const placeBets = useCallback(() => {
  //   console.log("Placing bets...");
  //   console.log("function:", executePlaceBets);
  //   console.log(
  //     "bets input:",
  //     betSizes.map((x) => x.toString())
  //   );
  //   executePlaceBets?.({
  //     recklesslySetUnpreparedArgs: [
  //       underlying.addr, // underlying
  //       betSizes, // array with respecitve bin amounts
  //     ],
  //     recklesslySetUnpreparedOverrides: {
  //       from: connectedAddress,
  //       value: betSizeSum,
  //     },
  //   });
  // }, [underlying, betSizes, betSizeSum]);

  // const epochDelta = useCallback(
  //   () =>
  //     Math.floor(Date.now() / 1000) -
  //     (lastEpochClose + epochDuration + bufferDuration),
  //   [lastEpochClose, epochDuration, bufferDuration]
  // );

  // return (
  //   <>
  //     //
  //     https://blog.greenroots.info/how-to-create-a-countdown-timer-using-react-hooks
  //     <p>Countdown: 00:00:00</p>
  //     {/* <select value={underlying} onChange={triggerSelectUnderlying}>
  //     <option>Select underlying...</option>
  //     {getUnderlyingOptions()}
  //   </select> */}
  //     <ul style={inline}>{getUnderlyingOptions()}</ul>
  //     <br></br>
  //     <br></br>
  //     <h2 style={inline}>Current oracle price:</h2>
  //     {underlyingValueToFixed(underlyingPrice || 0) || "Fetching..."}
  //     <h2 style={inline}>Current epoch:</h2>
  //     {parseInt(epoch)}
  //     {epochDelta() < 0 ? (
  //       <h2 style={inline}>Epoch still running for: {epochDelta()}</h2>
  //     ) : (
  //       <h2 style={inline}>Epoch closed for {epochDelta()} seconds</h2>
  //     )}
  //     <br></br>
  //     <br></br>
  //     <h2 style={inline}>Last epoch close:</h2>
  //     {new Date(lastEpochClose * 1000).toLocaleString()}
  //     <h2 style={inline}>Betting close:</h2>
  //     {new Date((lastEpochClose + epochDuration) * 1000).toLocaleString()}
  //     <h2 style={inline}>Current close:</h2>
  //     {new Date(
  //       (lastEpochClose + epochDuration + bufferDuration) * 1000
  //     ).toLocaleString()}
  //     <h2>Bins data:</h2>
  //     <div>
  //       <div style={inline}>Starts</div>
  //       <div style={inline}>Values</div>
  //       <div style={inline}># bets</div>
  //       <div style={inline}>User bets</div>
  //     </div>
  //     <br></br>
  //     {getBinElements()}
  //     <button onClick={placeBets}>Place bets</button>
  //   </>
  // );

  // if wallet not connected
}

export default Better;
