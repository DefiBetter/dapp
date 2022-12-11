import { useEffect, useState } from "react";
import { data2SvgView, transpose } from "./Transformations";

const Axes = (props) => {
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

  const getXAxisData = () => {
    let data = transpose(props.data);
    console.log("getXAxisData data", data);
    const { oldRangeInfo, newRangeInfo, middleCoords } =
      props.chartConfig.rangeInfo(data);
    console.log("getXAxisData old", oldRangeInfo);
    console.log("getXAxisData new", newRangeInfo);
    console.log("getXAxisData middleCoords", middleCoords[0]);

    let dataPointList = [];

    /* generate coord for x axis labels */
    let xLabelCoordList = [];
    let xAxisRange = data[0][data[0].length - 1] - data[0][0]; // seconds
    console.log("getXAxisData xAxisRange", xAxisRange);

    let interval = timeRange2TimeInterval(xAxisRange);
    console.log("getXAxisData interval", interval);
    let xMiddle = middleCoords[0];
    console.log("getXAxisData xMiddle", xMiddle);

    // historical time
    for (let i = 0; i < xAxisRange / interval; i++) {
      xLabelCoordList.push([xMiddle - interval * i, 0]);
    }
    console.log("getXAxisData xLabelCoordList", xLabelCoordList);

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
    console.log("getXAxisData xLabelList", xLabelList);

    // scale coords to fit svg
    console.log("getXAxisData xLabelList", xLabelList);
    xLabelCoordList = transpose(xLabelCoordList);
    console.log("getXAxisData transpose", xLabelCoordList);
    xLabelCoordList = data2SvgView(
      xLabelCoordList,
      oldRangeInfo,
      newRangeInfo,
      props.chartConfig.containerHeight
    );
    console.log("getXAxisData data2SvgView", xLabelCoordList);

    // move data to correct position
    xLabelCoordList[1] = xLabelCoordList[0].map(
      () => props.chartConfig.chartHeight + props.chartConfig.paddingY()
    );

    xLabelCoordList = transpose(xLabelCoordList);
    console.log("getXAxisData transpose", xLabelCoordList);

    // add label string
    console.log("getXAxisData xLabelList", xLabelList);
    xLabelCoordList.map((x, i) =>
      dataPointList.push(
        <text x={x[0]} y={x[1] + 20} fill="red" text-anchor="middle">
          {xLabelList[i]}
        </text>
      )
    );

    /* generate y coords */

    return dataPointList;
  };

  return (
    <>
      {props.data ? getXAxisData() : null}
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

export default Axes;
