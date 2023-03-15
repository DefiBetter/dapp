
import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { useContractRead } from "wagmi";
import { BigNumber, ethers } from "ethers";

import AggregatorV3InterfaceABI from "../../static/ABI/AggregatorV3InterfaceABI.json";
/* global BigInt */
import LineChart from "./modules/LineChart";
import ChartBackground from "./modules/ChartBackground";
import SdCone from "./modules/SdCone";
import { transpose } from "./Transformations";
import { InputNumber } from "../common/Input";

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
    // if (!instrumentRef) {
    //   setInstrumentRef(props.instrument);
    // } else if (instrumentRef != props.instrument) {
    //   console.log("chartData undefined");
    //   setChartData(undefined);
    // } else {
    // }
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
        console.log("chartData adding");
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
        console.log("chartData newChartData");
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
    <div className="w-full h-full bg-[#647687] relative" ref={containerRef}>
      <svg className="w-full h-full bg-db-light-slate">
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
      </svg>
      <div className="text-xs absolute w-full left-2 top-0 text-white flex flex-col lg:flex-row font-bold gap-2 lg:gap-6">
        <div>Current: {currentPrice}</div>
        <div>
          Epoch open:{" "}
          {lastEpochData
            ? ethers.utils.formatEther(lastEpochData.closingPrice)
            : null}
        </div>
        <div>
          Last updated:{" "}
          {(() => {
            const dt = new Date(lastUpdated * 1000);
            return `${dt.toLocaleTimeString()}`;
          })()}
        </div>
      </div>
      <div className="text-xs absolute w-[80%] md:w-1/2 left-2 bottom-6 text-white flex flex-col font-bold gap-2">
        <div className="flex justify-between items-center">
          <div>x scaling</div>
          <div className="flex gap-2">
            <button
              className="border-[1px] border-black shadow-db bg-db-cyan-process p-1 pb-2 w-full rounded-lg text-white hover:bg-db-blue-200"
              onClick={() => {
                setChartConfig({
                  ...chartConfig,
                  scaleType: { ...chartConfig.scaleType, x: "epochStart" },
                });
              }}
            >
              epochStart
            </button>

            <button
              className="border-[1px] border-black shadow-db bg-db-cyan-process p-1 pb-2 w-full rounded-lg text-white hover:bg-db-blue-200"
              onClick={() => {
                setChartConfig({
                  ...chartConfig,
                  scaleType: { ...chartConfig.scaleType, x: "trailing" },
                });
              }}
            >
              trailing
            </button>

            <button
              className="border-[1px] border-black shadow-db bg-db-cyan-process p-1 pb-2 w-full rounded-lg text-white hover:bg-db-blue-200"
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
              anchor
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>y scaling</div>
          <div className="flex gap-2">
            <button
              className="border-[1px] border-black shadow-db bg-db-cyan-process p-1 pb-2 w-full rounded-lg text-white hover:bg-db-blue-200"
              onClick={() => {
                setChartConfig({
                  ...chartConfig,
                  scaleType: { ...chartConfig.scaleType, y: "binBorder" },
                });
              }}
            >
              binBorder
            </button>
            <button
              className="border-[1px] border-black shadow-db bg-db-cyan-process p-1 pb-2 w-full rounded-lg text-white hover:bg-db-blue-200"
              onClick={() => {
                setChartConfig({
                  ...chartConfig,
                  scaleType: { ...chartConfig.scaleType, y: "minMax" },
                });
              }}
            >
              minMax
            </button>
            <button
              className="border-[1px] border-black shadow-db bg-db-cyan-process p-1 pb-2 w-full rounded-lg text-white hover:bg-db-blue-200"
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
              anchor
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>n epochs</div>
          <div>
            <InputNumber
              heightTWClass='h-10'
              min={1}
              onChange={(e) => {
                setChartConfig({
                  ...chartConfig,
                  epochCount: +e.target.value,
                });
              }}
              placeholder={"cannot be 0"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chart;
