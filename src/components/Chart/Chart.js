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
import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { useContractRead, useContractReads } from "wagmi";
import { BigNumber, ethers } from "ethers";
import { Grid, GridCol, GridRow } from "../common/Grid";

import AggregatorV3InterfaceABI from "../../static/ABI/AggregatorV3InterfaceABI.json";
/* global BigInt */
import LineChart from "./modules/LineChart";
import Axes from "./modules/ChartBackground";
import ChartBackground from "./modules/ChartBackground";
import SdCone from "./modules/SdCone";
import { transpose } from "./Transformations";
import { Button } from "../common/Button";
import { NormalText } from "../common/Text";
import { Input, InputNumber } from "../common/Input";

const pairAddress = "0xcA75C4aA579c25D6ab3c8Ef9A70859ABF566fA1d"; // need to make this change with selected asset

/* chart rework:
- global chart data state
- hook fetch chart data from global storage
- hook fetch historical data from current time (backwards)
- hook to fetch live data
- add live data to chart state
- add data to local storage
- preprocess data for only price (y) and time (x)
- enable modular addons to the chart like line, bar, sd cone, other svg-compatiable elements
- x-axis scaling
- y-axis scaling
- anchor x-axis
- anchor y-axis
- svg renders all the above
- append event listener to track live data (instead of pinging it ever 1 second as of now)

data flow:
- raw data (chainlink)
- preprocessed data => saved to local storage
- transformed data (for svg)
*/

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
    scaleType: {
      x: "epochStart", // epochStart, trailing
      y: "binBorder", // binBorder, minMax
      xAnchor: true,
      yAnchor: true,
    },
    xLabelStart: function (xData) {
      if (this.scaleType.x == "epochStart") {
        return this.middleCoord;
      }
    },
    yLabelStart: function (yData) {
      if (this.scaleType.y == "binBorder") {
        return this.paddingY();
      }
    },
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
    onError(data) {},
    onSuccess(data) {
      setLastEpochData(data);
    },
    // watch: true,
  });

  // get underlying price and last updated
  useContractRead({
    ...props.betterContractConfig,
    functionName: "getUnderlyingPrice",
    args: [props.instrument.underlying],
    onError(data) {},
    onSuccess(data) {
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

  const aggregatorInterface = new ethers.utils.Interface(
    AggregatorV3InterfaceABI
  );

  // latestRoundData
  useContractRead({
    ...aggregatorContractConfig,
    args: [],
    functionName: "latestRoundData",
    onError(data) {},
    onSuccess(data) {
      const roundId = BigInt(data.roundId);
      const phaseId = roundId >> 64n;
      const aggregatorRoundId = roundId & 0xffffffffffffffffn;

      setLatestRoundData([roundId, phaseId, aggregatorRoundId]);
    },
    watch: true,
  });

  const [pointer, setPointer] = useState(0n);
  const [instrumentRef, setInstrumentRef] = useState();
  const [latestRoundDataRef, setLatestRoundDataRef] = useState();
  useEffect(() => {
    if (!latestRoundDataRef) {
      setLatestRoundDataRef(latestRoundData);
    } else if (latestRoundDataRef != latestRoundData) {
      setPointer(latestRoundData[0]);
    } else {
    }
  }, [latestRoundData]);

  useEffect(() => {
    if (!instrumentRef) {
      setInstrumentRef(props.instrument);
    } else if (instrumentRef != props.instrument) {
      setChartData(undefined);
    } else {
    }
  }, [props.instrument]);

  let roundIdList = [];
  const { refetch: getRoundDataMultiCallRefetch } = useContractRead({
    ...props.betterContractConfig,
    functionName: "multiCall",
    args: (() => {
      let addressList = [];
      let encodedDataList = [];
      let newRoundIdList = [];
      for (let i = 0; i < 100 && !(BigInt(i) > pointer); i++) {
        const currentRoundId = (pointer - BigInt(i)).toString();
        addressList.push(aggregatorContractConfig.address);

        encodedDataList.push(
          aggregatorInterface.encodeFunctionData("getRoundData", [
            BigNumber.from(currentRoundId),
          ])
        );
        newRoundIdList.push(currentRoundId);
      }
      roundIdList = newRoundIdList;
      return [addressList, encodedDataList];
    })(),
    onError(data) {},
    onSuccess(data) {
      // decode
      let decodedResultList = [];

      for (let d of data) {
        decodedResultList.push(
          aggregatorInterface.decodeFunctionResult("getRoundData", d)
        );
      }

      let newChartData = {};
      decodedResultList.map((r, i) => {
        const round = {
          time: +r.updatedAt.toString(),
          price: +ethers.utils.formatUnits(r.answer, 8),
        };
        newChartData[roundIdList[i]] = round;
      });
      if (chartData) {
        setChartData({ ...chartData, ...newChartData });

        // fetch historical data if not enough
        const timeList = Object.values(chartData).map((r) => r.time);
        const minTime = Math.min(...timeList);

        const oldestTime =
          +props.instrument.lastEpochClosingTime.toString() -
          (+props.instrument.epochDurationInSeconds.toString() +
            props.instrument.bufferDurationInSeconds.toString()) *
            chartConfig.epochCount;

        if (minTime > oldestTime) {
          const newPointer = pointer - 50n;
          setPointer(newPointer);
          getRoundDataMultiCallRefetch();
        }
      } else {
        setChartData(newChartData);
      }
    },
  });

  const rangeInfo = (data) => {
    /* data structure
      data = [
        [x1, x2, ..., xn],
        [y1, y2, ..., yn]
      ]
    */
    let xData = data[0];
    let yData = data[1];

    // default range info
    let oldRangeInfo = [
        [0, 0, 0], // x value
        [0, 0, 0], // y value
      ],
      newRangeInfo = [
        [0, 0, 0], // x value
        [0, 0, 0], // y value
      ];
    let yLabelSize;

    /* epoch start point */
    let epochStartPoint = [
      +props.instrument.lastEpochClosingTime,
      yData[
        xData.indexOf(
          xData.find((val) => val >= +props.instrument.lastEpochClosingTime)
        )
      ],
    ];
    console.log("epochStartPoint", epochStartPoint);

    /* both x and y range info vars */
    let n = chartConfig.epochCount;
    let totalEpochTime =
      +props.instrument.bufferDurationInSeconds.toString() +
      +props.instrument.epochDurationInSeconds.toString();
    let epochStartTime = +lastEpochData.closeTime.toString();

    // scaling type
    let xType = chartConfig.scaleType.x;
    let yType = chartConfig.scaleType.y;

    /* xRangeInfo */
    let xMin, xMax, xRange;
    let xNewMin, xNewMax, xNewRange;

    if (xType == "epochStart") {
      // old range
      xMin = epochStartTime - totalEpochTime * n;
      xMax = epochStartTime;
      xRange = xMax - xMin;

      // new range
      xNewMin = chartConfig.paddingX();
      if (chartConfig.scaleType.xAnchor) {
        // anchor x point to the x axis n shifts
        xNewMax = (chartConfig.containerWidth * n) / (n + 1);
      } else {
        xNewMax = chartConfig.containerWidth;
      }
      xNewRange = xNewMax - xNewMin;
    } else if (xType == "trailing") {
      xMin = Math.max(...xData) - totalEpochTime;
      console.log("xMin", xMin);
      xMax = Math.max(...xData);
      xRange = xMax - xMin;

      xNewMin = chartConfig.paddingX();

      // anchor x point to the x axis n shifts
      if (chartConfig.scaleType.xAnchor) {
        xNewMax = (chartConfig.containerWidth * n) / (n + 1);
      } else {
        xNewMax = chartConfig.containerWidth;
      }
      xNewRange = xNewMax - xNewMin;
    }

    oldRangeInfo[0] = [xMin, xMax, xRange];
    newRangeInfo[0] = [xNewMin, xNewMax, xNewRange];

    /* yRangeInfo */
    let yMin, yMax, yRange;
    let yNewMin, yNewMax, yNewRange;

    if (yType == "binBorder") {
      yLabelSize = +ethers.utils.formatEther(props.epochData.binSize);

      yMin = +ethers.utils.formatEther(props.epochData.binStart);
      yMax = yMin + yLabelSize * 7;
      yRange = yMax - yMin;

      yNewMin = chartConfig.paddingY();
      yNewMax = chartConfig.paddingY() + chartConfig.chartHeight;
      yNewRange = yNewMax - yNewMin;
    } else if (yType == "minMax") {
      let xType = chartConfig.scaleType.x;

      let data_ = transpose(data);

      data_ = data_.filter(
        (coord) =>
          coord[0] >=
          epochStartPoint[0] - totalEpochTime * chartConfig.epochCount
      );

      if (!chartConfig.scaleType.xAnchor) {
        data_ = data_.filter((coord) => coord[0] <= epochStartPoint[0]);
      }

      data_ = transpose(data_);

      let yDataTrimmed = data_[1];
      if (chartConfig.scaleType.yAnchor) {
        if (xType == "epochStart") {
          yMin = Math.min(...yDataTrimmed);
          yMax = Math.max(...yDataTrimmed);

          // logic to see which points to anchor in the y axis
          let diffMin = epochStartPoint[1] - yMin;
          let diffMax = yMax - epochStartPoint[1];

          if (diffMin > diffMax) {
            yMax = epochStartPoint[1];
            yRange = epochStartPoint[1] - yMin;

            yNewMin = chartConfig.paddingY();
            yNewMax = chartConfig.middleCoord()[1];
          } else {
            yMin = epochStartPoint[1];
            yRange = yMax - epochStartPoint[1];

            yNewMin = chartConfig.middleCoord()[1];
            yNewMax = chartConfig.paddingY() + chartConfig.chartHeight;
          }
        }
      } else {
        yMin = Math.min(...yDataTrimmed);
        yMax = Math.max(...yDataTrimmed);

        yNewMin = chartConfig.paddingY();
        yNewMax = chartConfig.paddingY() + chartConfig.chartHeight;
      }
      yNewRange = yNewMax - yNewMin;
      console.log("yNewRange", yNewRange);
    }

    oldRangeInfo[1] = [yMin, yMax, yRange];
    newRangeInfo[1] = [yNewMin, yNewMax, yNewRange];

    return { oldRangeInfo, newRangeInfo, epochStartPoint, yLabelSize };
  };

  /* useEffect */
  // chart config based on parent component
  const containerRef = useRef(null);
  useLayoutEffect(() => {
    setChartConfig({
      ...chartConfig,
      containerWidth: containerRef.current.offsetWidth,
      containerHeight: containerRef.current.offsetHeight,
      chartWidth: containerRef.current.offsetWidth * 1,
      chartHeight: (containerRef.current.offsetHeight * 7) / 9,
    });
  }, []);

  useLayoutEffect(() => {
    const _setChartConfig = () => {
      setChartConfig({
        ...chartConfig,
        containerWidth: containerRef.current.offsetWidth,
        containerHeight: containerRef.current.offsetHeight,
        chartWidth: containerRef.current.offsetWidth * 1,
        chartHeight: (containerRef.current.offsetHeight * 7) / 9,
      });
    };

    // Attach the event listener to the window object
    window.addEventListener("resize", _setChartConfig);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", _setChartConfig);
    };
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
      <svg
        width={"100%"}
        height={"100%"}
        style={{ backgroundColor: "#758A9E" }}
      >
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
        <SdCone
          epochData={props.epochData}
          data={chartData}
          instrument={props.instrument}
          rangeInfo={rangeInfo}
          sdCount={2}
          chartConfig={chartConfig}
        />
        <SdCone
          epochData={props.epochData}
          data={chartData}
          instrument={props.instrument}
          rangeInfo={rangeInfo}
          sdCount={1}
          chartConfig={chartConfig}
        />
        <SdCone
          epochData={props.epochData}
          data={chartData}
          instrument={props.instrument}
          rangeInfo={rangeInfo}
          sdCount={1}
          chartConfig={chartConfig}
          trailing={true}
          color={"#2AAEE6"}
        />
        <SdCone
          epochData={props.epochData}
          data={chartData}
          instrument={props.instrument}
          rangeInfo={rangeInfo}
          sdCount={2}
          chartConfig={chartConfig}
          trailing={true}
          color={"#2AAEE6"}
        />
        {/* <BarChart chartConfig={chartConfig} data={data} /> */}
      </svg>
      <div className={styles.chartOverlay}>
        <div>
          <div></div>
          <div></div>
        </div>
        <Grid>
          <GridRow>
            <GridCol>
              <GridCol>
                <b>Current: {currentPrice}</b>
              </GridCol>
            </GridCol>
            <GridCol>
              <GridCol>
                Epoch open:{" "}
                {lastEpochData
                  ? ethers.utils.formatEther(lastEpochData.closingPrice)
                  : null}
              </GridCol>
            </GridCol>
            <GridCol>
              <GridCol>
                Last updated:{" "}
                {(() => {
                  const dt = new Date(lastUpdated * 1000);
                  return `${dt.toLocaleTimeString()}`;
                })()}
              </GridCol>
            </GridCol>
          </GridRow>
        </Grid>
      </div>
      <div className={styles.chartOverlayBottom}>
        <Grid>
          <GridRow>
            <GridCol>
              <b>x scaling:</b>
            </GridCol>
            <GridCol>
              <Button
                onClick={() => {
                  setChartConfig({
                    ...chartConfig,
                    scaleType: { ...chartConfig.scaleType, x: "epochStart" },
                  });
                }}
              >
                <NormalText>epochStart</NormalText>
              </Button>
              <Button
                onClick={() => {
                  setChartConfig({
                    ...chartConfig,
                    scaleType: { ...chartConfig.scaleType, x: "trailing" },
                  });
                }}
              >
                <NormalText>trailing</NormalText>
              </Button>
            </GridCol>
            <GridCol>
              <Button
                onClick={() => {
                  setChartConfig({
                    ...chartConfig,
                    scaleType: {
                      ...chartConfig.scaleType,
                      xAnchor: !chartConfig.scaleType.xAnchor,
                    },
                  });
                }}
              >
                <NormalText>Anchor</NormalText>
              </Button>
            </GridCol>
          </GridRow>
          <GridRow>
            <GridCol>
              <b>y scaling:</b>
            </GridCol>
            <GridCol>
              <Button
                onClick={() => {
                  setChartConfig({
                    ...chartConfig,
                    scaleType: { ...chartConfig.scaleType, y: "binBorder" },
                  });
                }}
              >
                <NormalText>binBorder</NormalText>
              </Button>
              <Button
                onClick={() => {
                  setChartConfig({
                    ...chartConfig,
                    scaleType: { ...chartConfig.scaleType, y: "minMax" },
                  });
                }}
              >
                <NormalText>minMax</NormalText>
              </Button>
            </GridCol>
            <GridCol>
              <Button
                onClick={() => {
                  setChartConfig({
                    ...chartConfig,
                    scaleType: {
                      ...chartConfig.scaleType,
                      yAnchor: !chartConfig.scaleType.yAnchor,
                    },
                  });
                }}
              >
                <NormalText>Anchor</NormalText>
              </Button>
            </GridCol>
          </GridRow>
          <GridRow>
            <GridCol>n epochs</GridCol>
            <GridCol>
              <Input
                min={1}
                onChange={(e) => {
                  setChartConfig({
                    ...chartConfig,
                    epochCount: +e.target.value,
                  });
                }}
                placeholder={"cannot be 0"}
              />
            </GridCol>
          </GridRow>
        </Grid>
      </div>
    </div>
  );
};

export default Chart;
