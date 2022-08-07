// TODO change to api hook

import { useEffect, useState } from "react";
import Axes from "./Axes";
import LineChart from "./LineChart";

// https://io.dexscreener.com/u/chart/bars/{chain}/{tokenAddress}?from={unixStart}&to={unixEnd}&res={chartMinuteResolution}&cb={barCount}
let tries = 0;

const Chart = () => {
  let [data, setData] = useState({ bars: [] });
  let [chartConfig, setChartConfig] = useState({
    containerWidth: 600,
    containerHeight: 600,
    chartWidth: 500,
    chartHeight: 500,
    separatorCountX: 10,
    separatorCountY: 10,
    separatorWidth: 50,
    paddingX: function () {
      return (this.containerWidth - this.chartWidth) / 2;
    },
    paddingY: function () {
      return (this.containerHeight - this.chartHeight) / 2;
    },
    middleCoord: function () {
      return [
        this.chartWidth / 2 + this.paddingX(),
        this.chartHeight / 2 + this.paddingY(),
      ];
    },
  });

  const getData = (
    chain,
    contractAddress,
    unixStart,
    unixEnd,
    chartResolution,
    barCount
  ) => {
    // console.log(tries);
    fetch(
      `http://localhost:4000/u/chart/bars/${chain}/${contractAddress}?from=${unixStart}&to=${unixEnd}&res=${chartResolution}&cb=${barCount}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 500) {
          tries++;
          getData(
            chain,
            contractAddress,
            unixStart,
            unixEnd,
            chartResolution,
            barCount
          );
        } else {
          console.log(data);
          setData(data);
        }
      });
  };

  useEffect(() => {
    // fetch data
    getData(
      "ethereum",
      "0x290a6a7460b308ee3f19023d2d00de604bcf5b42",
      1659826800000,
      1659829737815,
      60,
      320
    );
  }, []);

  return (
    <div>
      <svg width={window.innerWidth} height={window.innerHeight}>
        {/* <line x1={0} y1={0} x2={window.innerWidth} y2={0} stroke="grey" /> */}
        <Axes chartConfig={chartConfig} />
        <LineChart chartConfig={chartConfig} data={data} />
      </svg>
    </div>
  );
};

export default Chart;
