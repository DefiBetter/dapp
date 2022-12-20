import { useEffect } from "react";
import { multiply, resize, identity, size } from "mathjs";
import {
  preProcessData,
  reflect,
  translate,
  transpose,
  scale,
  data2SvgView,
  rangeInfo,
} from "./Transformations";

const LineChart = (props) => {
  const getDataPointList = (data) => {
    /* data needs to be transformed correctly to display data depending on the xType and yType of the chart:
    - xType (x axis scaling):
      - trailing => mid coord is fixed to the latest price
      - epoch => mid coord is fixed to the calculated epoch start price via better.epochTransition()
      - historical => latest price is shown at the right most side of the chart, and historical prices are shown
      - nEpoch => coord for y mid fixed, but the x coord is calculated based on the number of historical epoch user wants to view. eg. n = 9 epochs, x coord is 90% chart width, as remaining 10% represents current epoch

    - yType (y axis scaling):
      - minMax => scale to fit the historical price based on the biggest difference between min/max and mid coord
      - 1SD => scale to fit the historical price based on the biggest difference between 1 SD values and mid coord
      - 2SD => scale to fit the historical price based on the biggest difference between 2 SD values and mid coord
      - binBorder => scale to align with the bin border
    */
    let dataPointList = [];

    data = transpose(data);

    const { oldRangeInfo, newRangeInfo, epochStartPoint } =
      props.rangeInfo(data);

    data[0].push(epochStartPoint[0]);
    data[1].push(epochStartPoint[1]);
    // transformations
    data = data2SvgView(
      data,
      oldRangeInfo,
      newRangeInfo,
      props.chartConfig.containerHeight
    );

    data = transpose(data);
    let ePoint = data.pop();

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

    dataPointList.push(
      <circle
        cx={ePoint[0]}
        cy={ePoint[1]}
        r={2}
        fill="blue"
        className="circle"
      />
    );

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

  return (
    <>
      {props.data && props.epochData ? getDataPointList(props.data, 200) : null}
    </>
  );
};

export default LineChart;
