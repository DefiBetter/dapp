import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { data2SvgView, preProcessData, transpose } from "../Transformations";

const ChartBackground = (props) => {
  const timeRange2TimeInterval = (range) => {
    // range in seconds
    // if (range < 60 * 60) {
    //   return 5 * 60; // 5 mins interval
    // } else if (range < 2 * 60 * 60) {
    //   return 10 * 60;
    // } else if (range < 4 * 60 * 60) {
    //   return 20 * 60;
    // } else if (range < 8 * 60 * 60) {
    //   return 40 * 60;
    // } else if (range < 16 * 60 * 60) {
    //   return 80 * 60;
    // }
    let temp = range / (1 * 60);
    return Math.ceil(temp) * 10;
  };

  const priceRange2PriceInterval = (range) => {
    return +ethers.utils.formatEther(props.epochData.binSize);
  };

  const getVerticalBackground = () => {
    let data = preProcessData(props.data);
    data = transpose(data);
    const {
      oldRangeInfo,
      newRangeInfo,
      epochStartPoint: middleCoords,
    } = props.rangeInfo(data);

    let dataPointList = [];

    /* generate data points for x axis labels */
    let xLabelCoordList = [];
    let xAxisRange = data[0][data[0].length - 1] - data[0][0]; // seconds

    let interval = timeRange2TimeInterval(xAxisRange);
    let xMiddle = middleCoords[0];

    // historical time
    for (let i = 0; i < xAxisRange / interval; i++) {
      xLabelCoordList.push([xMiddle - interval * i, 0]);
    }

    // future time
    for (let i = 0; i < xAxisRange / interval; i++) {
      xLabelCoordList.push([xMiddle + interval * i, 0]);
    }

    // get x labels for each coord
    let xLabelList = transpose(xLabelCoordList)[0];
    xLabelList = xLabelList.map((dateTime) => {
      const dt = new Date(dateTime * 1000);
      return `${("0" + dt.getHours()).slice(-2)}:${(
        "0" + dt.getMinutes()
      ).slice(-2)}:${("0" + dt.getSeconds()).slice(-2)}`;
    });

    // scale coords to fit svg
    xLabelCoordList = transpose(xLabelCoordList);
    xLabelCoordList = data2SvgView(
      xLabelCoordList,
      oldRangeInfo,
      newRangeInfo,
      props.chartConfig.containerHeight
    );

    // move data to correct position
    xLabelCoordList[1] = xLabelCoordList[0].map(
      () => props.chartConfig.containerHeight
    );

    xLabelCoordList = transpose(xLabelCoordList);

    // add label element
    // xLabelCoordList.map((x, i) => {
    //   // text
    //   dataPointList.push(
    //     <text
    //       x={x[0]}
    //       y={x[1]}
    //       fill="red"
    //       textAnchor="middle"
    //       alignmentBaseline="text-after-edge"
    //     >
    //       {xLabelList[i]}
    //     </text>
    //   );
    // });

    // buffer time line
    let bufferTime =
      +props.lastEpochData.closeTime.toString() +
      +props.instrument.epochDurationInSeconds.toString();

    let bufferCoord = transpose([[bufferTime, 0]]);

    bufferCoord = data2SvgView(
      bufferCoord,
      oldRangeInfo,
      newRangeInfo,
      props.chartConfig.containerHeight
    );

    dataPointList.push(
      <line
        x1={bufferCoord[0]}
        y1={0}
        x2={bufferCoord[0]}
        y2={props.chartConfig.containerHeight}
        stroke="black"
        strokeDasharray="5"
      />
    );

    // epoch start line
    let ePoint = data2SvgView(
      [[middleCoords[0]], [middleCoords[1]]],
      oldRangeInfo,
      newRangeInfo,
      props.chartConfig.containerHeight
    );

    dataPointList.push(
      <line
        x1={ePoint[0]}
        y1={props.chartConfig.containerHeight}
        x2={ePoint[0]}
        y2={props.chartConfig.containerHeight / 2}
        stroke="black"
        strokeDasharray="5"
      />
    );

    // epoch start text
    dataPointList.push(
      <text
        x={ePoint[0]}
        y={props.chartConfig.containerHeight}
        fill="#C4DCF5"
        textAnchor="middle"
        alignmentBaseline="text-after-edge"
      >
        Epoch start
      </text>
    );

    // vertical guide lines on chart
    // dataPointList.push(
    //   <line
    //     x1={x[0]}
    //     y1={props.chartConfig.containerHeight}
    //     x2={x[0]}
    //     y2={0}
    //     stroke="grey"
    //     strokeDasharray="5"
    //   />
    // );

    return dataPointList;
  };

  const getHorizontalBackground = () => {
    let data = preProcessData(props.data);
    data = transpose(data);
    const {
      oldRangeInfo,
      newRangeInfo,
      epochStartPoint: middleCoords,
      yLabelSize,
    } = props.rangeInfo(
      data,
      props.chartConfig,
      props.epochData,
      props.instrument
    );

    let dataPointList = [];

    /* generate coord for y axis labels */
    let yLabelCoordList = [];
    let yAxisRange = oldRangeInfo[1][2];

    let interval = priceRange2PriceInterval();

    for (let i = 0; i < 8; i++) {
      yLabelCoordList.push([0, oldRangeInfo[1][0] + yLabelSize * i]);
    }

    // get y labels for each coord
    let yLabelList = transpose(yLabelCoordList)[1];
    yLabelList = yLabelList.map((price) => price.toPrecision(5));

    // scale coords to fit svg
    yLabelCoordList = transpose(yLabelCoordList);
    yLabelCoordList = data2SvgView(
      yLabelCoordList,
      oldRangeInfo,
      newRangeInfo,
      props.chartConfig.containerHeight
    );

    // move data to correct position
    yLabelCoordList[0] = yLabelCoordList[0].map(() =>
      props.chartConfig.paddingX()
    );

    yLabelCoordList = transpose(yLabelCoordList);

    // add label element
    yLabelCoordList.map((y, i) => {
      // text string
      // dataPointList.push(
      //   <text
      //     x={y[0] - 5}
      //     y={y[1]}
      //     fill="red"
      //     textAnchor="end"
      //     alignmentBaseline="middle"
      //   >
      //     {yLabelList[i]}
      //   </text>
      // );

      // vertical lines on chart
      dataPointList.push(
        <line
          x1={0}
          y1={y[1]}
          x2={props.chartConfig.containerWidth}
          y2={y[1]}
          stroke="black"
          strokeDasharray="5"
        />
      );
    });

    /* generate y coords */

    return dataPointList;
  };

  return (
    <>
      {props.data && props.epochData ? getVerticalBackground() : null}
      {props.data && props.epochData ? getHorizontalBackground() : null}

      {/* y axis */}
      {/* <line
        x1={props.chartConfig.paddingX() + 0}
        y1={props.chartConfig.paddingY() + 0}
        x2={props.chartConfig.paddingX() + 0}
        y2={props.chartConfig.paddingY() + props.chartConfig.chartHeight}
        stroke="grey"
      /> */}

      {/* x axis */}
      {/* <line
        x1={props.chartConfig.paddingX() + 0}
        y1={props.chartConfig.paddingY() + props.chartConfig.chartHeight}
        x2={props.chartConfig.paddingX() + props.chartConfig.chartWidth}
        y2={props.chartConfig.paddingY() + props.chartConfig.chartHeight}
        stroke="grey"
      /> */}

      {/* axis label */}

      {/* chart background */}
    </>
  );
};

export default ChartBackground;
