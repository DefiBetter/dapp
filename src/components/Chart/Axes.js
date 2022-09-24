import { useEffect, useState } from "react";

const Axes = (props) => {
  return (
    <>
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

      {/* y axis separator

      {props.chartConfig ? getSeparators() : null} */}
    </>
  );
};

export default Axes;
