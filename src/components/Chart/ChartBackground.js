import { useEffect, useState } from "react";
import { data2SvgView, transpose } from "./Transformations";

const ChartBackground = (props) => {
  const timeRange2TimeInterval = (range) => {
    console.log("timeRange2TimeInterval range", range);
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
    let temp = range / (60 * 60);
    return 10 * Math.ceil(temp) * 60;
  };

  const priceRange2PriceInterval = (range) => {
    console.log("priceRange2PriceInterval range", range);

    return 0.1;
  };

  const getVerticalBackground = () => {
    let data = transpose(props.data);
    const { oldRangeInfo, newRangeInfo, middleCoords } =
      props.chartConfig.rangeInfo(data);

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
      ).slice(-2)}`;
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
      () => props.chartConfig.chartHeight + props.chartConfig.paddingY()
    );

    xLabelCoordList = transpose(xLabelCoordList);

    // add label element
    xLabelCoordList.map((x, i) => {
      // text
      dataPointList.push(
        <text x={x[0]} y={x[1] + 20} fill="red" text-anchor="middle">
          {xLabelList[i]}
        </text>
      );
      // vertical lines on chart
      dataPointList.push(
        <line
          x1={x[0]}
          y1={props.chartConfig.paddingY() + props.chartConfig.chartHeight}
          x2={x[0]}
          y2={props.chartConfig.paddingY()}
          stroke="grey"
          strokeDasharray="5"
        />
      );
    });

    return dataPointList;
  };

  // const getHorizontalBackground = () => {
  //   let data = transpose(props.data);
  //   const { oldRangeInfo, newRangeInfo, middleCoords } =
  //     props.chartConfig.rangeInfo(data);

  //   let dataPointList = [];

  //   /* generate coord for y axis labels */
  //   let yLabelCoordList = [];
  //   let yAxisRange = data[1][data[1].length - 1] - data[1][0]; // seconds

  //   let interval = priceRange2PriceInterval(1);
  //   let xMiddle = middleCoords[0];

  //   // historical time
  //   for (let i = 0; i < xAxisRange / interval; i++) {
  //     xLabelCoordList.push([xMiddle - interval * i, 0]);
  //   }

  //   // future time
  //   for (let i = 0; i < xAxisRange / interval; i++) {
  //     xLabelCoordList.push([xMiddle + interval * i, 0]);
  //   }

  //   // get x labels for each coord
  //   let xLabelList = transpose(xLabelCoordList)[0];
  //   xLabelList = xLabelList.map((dateTime) => {
  //     const dt = new Date(dateTime * 1000);
  //     return `${("0" + dt.getHours()).slice(-2)}:${(
  //       "0" + dt.getMinutes()
  //     ).slice(-2)}`;
  //   });

  //   // scale coords to fit svg
  //   xLabelCoordList = transpose(xLabelCoordList);
  //   xLabelCoordList = data2SvgView(
  //     xLabelCoordList,
  //     oldRangeInfo,
  //     newRangeInfo,
  //     props.chartConfig.containerHeight
  //   );

  //   // move data to correct position
  //   xLabelCoordList[1] = xLabelCoordList[0].map(
  //     () => props.chartConfig.chartHeight + props.chartConfig.paddingY()
  //   );

  //   xLabelCoordList = transpose(xLabelCoordList);

  //   // add label element
  //   xLabelCoordList.map((x, i) =>
  //     dataPointList.push(
  //       <text x={x[0]} y={x[1] + 20} fill="red" text-anchor="middle">
  //         {xLabelList[i]}
  //       </text>
  //     )
  //   );

  //   /* generate y coords */

  //   return dataPointList;
  // };

  return (
    <>
      {props.data ? getVerticalBackground() : null}
      {/* x axis */}
      <line
        x1={props.chartConfig.paddingX() + 0}
        y1={props.chartConfig.paddingY() + 0}
        x2={props.chartConfig.paddingX() + 0}
        y2={props.chartConfig.paddingY() + props.chartConfig.chartHeight}
        stroke="grey"
      />

      {/* y axis */}
      <line
        x1={props.chartConfig.paddingX() + 0}
        y1={props.chartConfig.paddingY() + props.chartConfig.chartHeight}
        x2={props.chartConfig.paddingX() + props.chartConfig.chartWidth}
        y2={props.chartConfig.paddingY() + props.chartConfig.chartHeight}
        stroke="grey"
      />

      {/* axis label */}

      {/* chart background */}
    </>
  );
};

export default ChartBackground;
