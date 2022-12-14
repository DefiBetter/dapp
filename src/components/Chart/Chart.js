// // TODO change to api hook

// import { useEffect, useState } from "react";
// import Axes from "./Axes";
// import BarChart from "./BarChart";
// import LineChart from "./LineChart";

// // https://io.dexscreener.com/u/chart/bars/{chain}/{tokenAddress}?from={unixStart}&to={unixEnd}&res={chartMinuteResolution}&cb={barCount}
// let tries = 0;

// const Chart = () => {
//   let [data, setData] = useState({ bars: [] });
//   let [chartConfig, setChartConfig] = useState({
//     containerWidth: 600,
//     containerHeight: 600,
//     chartWidth: 600,
//     chartHeight: 600,
//     separatorCountX: 10,
//     separatorCountY: 10,
//     separatorWidth: 50,
//     paddingX: function () {
//       return (this.containerWidth - this.chartWidth) / 2;
//     },
//     paddingY: function () {
//       return (this.containerHeight - this.chartHeight) / 2;
//     },
//     middleCoord: function () {
//       return [
//         this.chartWidth / 2 + this.paddingX(),
//         this.chartHeight / 2 + this.paddingY(),
//       ];
//     },
//   });

//   const getData = (
//     chain,
//     contractAddress,
//     unixStart,
//     unixEnd,
//     chartResolution,
//     barCount
//   ) => {
//     // console.log(tries);
//     fetch(
//       `http://localhost:4000/u/chart/bars/${chain}/${contractAddress}?from=${unixStart}&to=${unixEnd}&res=${chartResolution}&cb=${barCount}`
//     )
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.status === 500) {
//           tries++;
//           getData(
//             chain,
//             contractAddress,
//             unixStart,
//             unixEnd,
//             chartResolution,
//             barCount
//           );
//         } else {
//           console.log(data);
//           setData(data);
//         }
//       });
//   };

//   useEffect(() => {
//     // fetch data
//     getData(
//       "avalanche",
//       "0xbc61c7ecef56e40404fc359ef4dfd6e7528f2b09",
//       1659826800000,
//       1659829737815,
//       60,
//       320
//     );
//   }, []);

//   return (
//     <div>
//       <svg width={window.innerWidth / 2} height={window.innerHeight / 2}>
//         {/* <line x1={0} y1={0} x2={window.innerWidth} y2={0} stroke="grey" /> */}
//         <Axes chartConfig={chartConfig} />
//         <LineChart chartConfig={chartConfig} data={data} />
//         {/* <BarChart chartConfig={chartConfig} data={data} /> */}
//       </svg>
//     </div>
//   );
// };

// export default Chart;

import styles from "./Chart.module.css";
import { underlyingPairAddress } from "../../static/contractAddresses";
import { useState, useRef, useLayoutEffect } from "react";
import { useContractRead, useContractReads } from "wagmi";
import { BigNumber, ethers } from "ethers";
import { Grid, GridCell2, GridRow } from "../common/Grid";

import AggregatorV3InterfaceABI from "../../static/ABI/AggregatorV3InterfaceABI.json";
/* global BigInt */
import LineChart from "./LineChart";
import Axes from "./ChartBackground";
import ChartBackground from "./ChartBackground";

const pairAddress = "0xcA75C4aA579c25D6ab3c8Ef9A70859ABF566fA1d"; // need to make this change with selected asset

const Chart = (props) => {
  /* states */
  // last epoch data
  const [lastEpochData, setLastEpochData] = useState();

  // current epoch data
  const [currentPrice, setCurrentPrice] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(0);

  // chart data
  const [chartData, setChartData] = useState();

  // chart config
  let [chartConfig, setChartConfig] = useState({
    containerWidth: 0,
    containerHeight: 0,
    chartWidth: 0,
    chartHeight: 0,
    epochCount: 1,
    scaleType: { x: "nEpoch", y: "binBorder" },
    paddingX: function () {
      return (this.containerWidth - this.chartWidth) / 2;
    },
    paddingY: function () {
      return (this.containerHeight - this.chartHeight) / 2;
    },
    middleCoord: function () {
      return [this.containerWidth / 2, this.containerHeight / 2];
    },
  });

  // latest round data from chainlink
  const [latestRoundData, setLatestRoundData] = useState([0n, 0n, 0n]);

  /* contract read/write */
  // get last epoch data
  useContractRead({
    ...props.betterContractConfig,
    functionName: "getEpochData",
    args: [props.instrument?.epoch - 1, props.instrument?.selector],
    onError(data) {
      console.log("getEpochData error", data);
    },
    onSuccess(data) {
      console.log("getEpochData", data);
      console.log("getEpochData last epoch", props.instrument?.epoch - 1);
      console.log("getEpochData selector", props.instrument?.selector);
      console.log("yyy closeTime", data.closeTime.toString());
      setLastEpochData(data);
    },
    watch: true,
  });

  // get underlying price and last updated
  useContractRead({
    ...props.betterContractConfig,
    functionName: "getUnderlyingPrice",
    args: [props.instrument?.underlying],
    onError(data) {
      console.log("getUnderlyingPrice error", data);
    },
    onSuccess(data) {
      console.log("getUnderlyingPrice", data);
      setCurrentPrice(+ethers.utils.formatEther(data[0]));
      setLastUpdated(+data[1].toString());
    },
    watch: true,
  });

  // aggregator config
  const aggregatorContractConfig = {
    address: props.instrument?.underlying,
    abi: AggregatorV3InterfaceABI,
  };

  // latestRoundData
  useContractRead({
    ...aggregatorContractConfig,
    args: [],
    functionName: "latestRoundData",
    onError(data) {
      console.log("latestRoundData error", data);
    },
    onSuccess(data) {
      console.log("yyy latest round data", data);
      // console.log("latestRoundData.roundId", 92233720368547771158n);
      // console.log("latestRoundData phaseId", 92233720368547771158n >> 64n);
      // console.log(
      //   "latestRoundData aggregatorRoundId",
      //   92233720368547771158n & 0xffffffffffffffffn
      // );
      const roundId = BigInt(data.roundId);
      const phaseId = roundId >> 64n;
      const aggregatorRoundId = roundId & 0xffffffffffffffffn;

      console.log("latestRoundData roundId", roundId);
      console.log("latestRoundData phaseId", phaseId);
      console.log("latestRoundData aggregatorRoundId", aggregatorRoundId);

      console.log(
        "latestRoundData roundId - aggregatorRoundId + 1",
        BigNumber.from((roundId - aggregatorRoundId + BigInt(1)).toString())
      );

      setLatestRoundData([roundId, phaseId, aggregatorRoundId]);
    },
    watch: true,
  });

  // get historical prices
  useContractReads({
    contracts: (() => {
      {
        let temp = [];
        for (let i = 0; i < 50; i++) {
          temp.push({
            ...aggregatorContractConfig,
            functionName: "getRoundData",
            args: [BigNumber.from((latestRoundData[0] - BigInt(i)).toString())],
          });
        }
        console.log("temp", temp.reverse());
        return temp;
      }
    })(),
    onError(data) {
      console.log("useContractReads error", data);
    },
    onSuccess(data) {
      console.log(
        "yyy historical price",
        data.map((d) => {
          return [
            +d.updatedAt.toString(),
            +ethers.utils.formatUnits(d.answer, 8),
          ];
        })
      );
      setChartData(
        data.map((d) => {
          return [
            +d.updatedAt.toString(),
            +ethers.utils.formatUnits(d.answer, 8),
          ];
        })
      );
    },
    watch: true,
  });
  console.log("chartData", chartData);

  /* chart helper functions */

  const xRangeInfo = (xData) => {
    let xMin, xMax, xRange;
    let xNewMin, xNewMax, xNewRange;

    let xType = chartConfig.scaleType.x;
    if (xType == "nEpoch") {
      let n = chartConfig.epochCount;
      let totalEpochTime =
        +props.instrument.bufferDurationInSeconds.toString() +
        +props.instrument.epochDurationInSeconds.toString();
      let epochStartTime = +lastEpochData.closeTime.toString();
      console.log("getDataPointList epochStartTime", Date(epochStartTime));

      // old range
      console.log("xRangeInfo n", n);
      console.log("xRangeInfo epochStartTime", epochStartTime);
      console.log("xRangeInfo totalEpochTime", totalEpochTime);
      xMin = epochStartTime - totalEpochTime * n;
      console.log("xRangeInfo xMin", xMin);
      xMax = epochStartTime;
      console.log("xRangeInfo xMax", xMax);
      xRange = xMax - xMin;

      // new range
      xNewMin = 0;
      xNewMax = (chartConfig.containerWidth * n) / (n + 1);
      xNewRange = xNewMax - xNewMin;
    } else if (xType == "trailing") {
      xMin = Math.min(...xData);
      xMax = Math.max(...xData);
      xRange = xMax - xMin;

      xNewMin = chartConfig.paddingX();
      xNewMax = chartConfig.middleCoord()[0];
      xNewRange = xNewMax - xNewMin;
    }

    let rangeInfo = [xMin, xMax, xRange];
    let newRangeInfo = [xNewMin, xNewMax, xNewRange];
    return { rangeInfo, newRangeInfo };
  };

  const yRangeInfo = (yData) => {
    let yMin, yMax, yRange;
    let yNewMin, yNewMax, yNewRange;

    let yType = chartConfig.scaleType.y;
    if (yType == "binBorder") {
      yMin = +ethers.utils.formatEther(props.epochData.binStart);
      yMax =
        +ethers.utils.formatEther(props.epochData.binStart) +
        +ethers.utils.formatEther(props.epochData.binSize) * 7;
      yRange = yMax - yMin;

      yNewMin = chartConfig.paddingY();
      yNewMax = chartConfig.paddingY() + chartConfig.chartHeight;
      yNewRange = yNewMax - yNewMin;
    }

    let rangeInfo = [yMin, yMax, yRange];
    let newRangeInfo = [yNewMin, yNewMax, yNewRange];
    return { rangeInfo, newRangeInfo };
  };

  const rangeInfo = (data) => {
    let xData = data[0];
    let yData = data[1];
    let oldRangeInfo = [
        [0, 0, 0],
        [0, 0, 0],
      ],
      newRangeInfo = [
        [0, 0, 0],
        [0, 0, 0],
      ];

    ({ rangeInfo: oldRangeInfo[0], newRangeInfo: newRangeInfo[0] } =
      xRangeInfo(xData));
    ({ rangeInfo: oldRangeInfo[1], newRangeInfo: newRangeInfo[1] } =
      yRangeInfo(yData));

    let epochStartPoint = [
      oldRangeInfo[0][1],
      oldRangeInfo[1][0] + oldRangeInfo[1][2] / 2,
    ];

    console.log("rangeInfo data", data);
    console.log("rangeInfo oldRangeInfo", oldRangeInfo);
    console.log("rangeInfo newRangeInfo", newRangeInfo);
    console.log("rangeInfo epochStartPoint", epochStartPoint);

    return { oldRangeInfo, newRangeInfo, epochStartPoint };
  };

  /* useEffect */
  // chart config based on parent component
  const containerRef = useRef(null);
  useLayoutEffect(() => {
    console.log(
      "containerRef",
      containerRef.current.offsetWidth,
      containerRef.current.offsetHeight
    );
    setChartConfig({
      ...chartConfig,
      containerWidth: containerRef.current.offsetWidth,
      containerHeight: containerRef.current.offsetHeight,
      chartWidth: containerRef.current.offsetWidth * 0.9,
      chartHeight: (containerRef.current.offsetHeight * 7) / 9,
    });
  }, []);

  return (
    <div className={styles.container} ref={containerRef}>
      {/* for the time being (before figuring out a place to get raw data) we will be using dex screener */}
      {/* <div id={styles.dexscreenerEmbed}>
        <iframe
          src={`https://dexscreener.com/${props.underlying}/${
            underlyingPairAddress[props.underlying]
          }?embed=1&trades=0&info=0`}
        />
      </div> */}
      <svg width={"100%"} height={"100%"} style={{ backgroundColor: "white" }}>
        {" "}
        {/* <line x1={0} y1={0} x2={window.innerWidth} y2={0} stroke="grey" /> */}
        <ChartBackground
          chartConfig={chartConfig}
          data={chartData}
          epochData={props.epochData}
          lastEpochData={lastEpochData}
          instrument={props.instrument}
          rangeInfo={rangeInfo}
        />
        <LineChart
          chartConfig={chartConfig}
          data={chartData}
          epochData={props.epochData}
          lastEpochData={lastEpochData}
          instrument={props.instrument}
          rangeInfo={rangeInfo}
        />
        {/* <BarChart chartConfig={chartConfig} data={data} /> */}{" "}
      </svg>
      <Grid>
        <GridRow>
          <GridCell2>Last Epoch Closing Price:</GridCell2>
          <GridCell2>
            {lastEpochData
              ? ethers.utils.formatEther(lastEpochData.closingPrice)
              : null}
          </GridCell2>
        </GridRow>
        <GridRow>
          <GridCell2> Current Epoch Price:</GridCell2>
          <GridCell2>{currentPrice}</GridCell2>
        </GridRow>
        <GridRow>
          <GridCell2> Last updated (current price):</GridCell2>
          <GridCell2>{new Date(lastUpdated * 1000).toISOString()}</GridCell2>
        </GridRow>
      </Grid>
    </div>
  );
};

export default Chart;
