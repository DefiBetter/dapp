import { ethers } from "ethers";
import { transpose } from "mathjs";
import { data2SvgView, preProcessData } from "./Transformations";

const SdCone = (props) => {
  const getDataPointList = (data) => {
    const binMin = +ethers.utils.formatEther(props.epochData.binStart);
    const binMax =
      binMin + +ethers.utils.formatEther(props.epochData.binSize) * 7;
    const binRange = binMax - binMin;
    const sd =
      (binRange / (+props.instrument.volatilityMultiplier.toString() / 10000)) *
      props.sdCount;

    let dataPointList = [];
    data = preProcessData(data).sort((a, b) => a[0] - b[0]);
    data = transpose(data);

    const { oldRangeInfo, newRangeInfo, epochStartPoint } =
      props.rangeInfo(data);

    const epochTimeRange =
      +props.instrument.epochDurationInSeconds.toString() +
      +props.instrument.bufferDurationInSeconds.toString();
    const timeInterval = epochTimeRange / 100;

    /* generate SD points*/
    const generateSdPointList = (position) => {
      console.log("position", position);
      let multiplier = 1;
      if (position == "lower") {
        multiplier = -1;
      } else if (position == "upper") {
        multiplier = 1;
      }
      let sdPointList = [];
      for (let i = 0; i <= 100; i++) {
        const sdPoint =
          epochStartPoint[1] +
          ((Math.sqrt((timeInterval * i) / epochTimeRange) * sd) / 2) *
            multiplier;

        sdPointList.push([epochStartPoint[0] + timeInterval * i, sdPoint]);
      }
      sdPointList = transpose(sdPointList);

      let newDataPointList = data2SvgView(
        sdPointList,
        oldRangeInfo,
        newRangeInfo,
        props.chartConfig.containerHeight
      );
      newDataPointList = transpose(newDataPointList);

      // // plot sd cone
      // newDataPointList.map((coord) => {
      //   dataPointList.push(
      //     <circle
      //       cx={coord[0]}
      //       cy={coord[1]}
      //       r={2}
      //       fill="red"
      //       className="circle"
      //     />
      //   );
      // });

      // plot lines between coords
      newDataPointList.map((coord, i) => {
        if (i < newDataPointList.length - 1) {
          coord = [coord[0], Number(coord[1])];
          let coordNext = [
            newDataPointList[i + 1][0],
            Number(newDataPointList[i + 1][1]),
          ];
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
    };

    generateSdPointList("upper");
    generateSdPointList("lower");

    return dataPointList;
  };

  return <>{props.data ? getDataPointList(props.data) : null}</>;
};

export default SdCone;
