import { useEffect } from "react";
import { multiply, resize, identity, size } from "mathjs";
import {
  preProcessData,
  reflect,
  translate,
  transpose,
  scale,
  data2SvgView,
} from "./Transformations";

const LineChart = (props) => {
  const getDataPointList = (data) => {
    /* data needs to be transformed correctly to display data depending on the xType and yType of the chart:
    - xType (x axis scaling):
      - trailing => mid coord is fixed to the latest price
      - epoch => mid coord is fixed to the calculated epoch start price via better.epochTransition()
      - historical => latest price is shown at the right most side of the chart, and historical prices are shown

    - yType (y axis scaling):
      - minMax => scale to fit the historical price based on the biggest difference between min/max and mid coord
      - 1SD => scale to fit the historical price based on the biggest difference between 1 SD values and mid coord
      - 2SD => scale to fit the historical price based on the biggest difference between 2 SD values and mid coord
    */
    let dataPointList = [];
    console.log("plotData data", data);

    data = transpose(data);
    console.log("data2View transpose", data);

    const { oldRangeInfo, newRangeInfo } = props.chartConfig.rangeInfo(data);

    console.log(
      "data2View oldRangeInfo, newRangeInfo",
      oldRangeInfo,
      newRangeInfo
    );

    // transformations
    data = data2SvgView(
      data,
      oldRangeInfo,
      newRangeInfo,
      props.chartConfig.containerHeight
    );

    data = transpose(data);
    console.log("plotData transpose", data);

    // plot circle points are coords
    data.map((coord) => {
      coord = [coord[0], Number(coord[1])];
      dataPointList.push(
        <circle
          cx={coord[0]}
          cy={Number(coord[1])}
          r={2}
          fill="red"
          className="circle"
        />
      );
    });

    // plot lines between coords
    data.map((coord, i) => {
      if (i < data.length - 1) {
        coord = [coord[0], Number(coord[1])];
        let coordNext = [data[i + 1][0], Number(data[i + 1][1])];
        dataPointList.push(
          <line
            x1={coord[0]}
            y1={coord[1]}
            x2={coordNext[0]}
            y2={coordNext[1]}
            stroke="grey"
          />
        );
      }
    });

    // plot bitch
    data.map((coord, i) => {
      let yPad = props.chartConfig.paddingY() + props.chartConfig.chartHeight;
      dataPointList.push(
        <text x={100} y={yPad} fill="red">
          bitch
        </text>
      );
    });
    return dataPointList;
  };

  return <>{props.data ? getDataPointList(props.data, 200) : null}</>;
};

export default LineChart;
