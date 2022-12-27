// import { useEffect } from "react";
// import { multiply, resize, identity, size } from "mathjs";
// import { reflectXAxis, translate, transpose } from "./Transformations";

// const Axes = (props) => {
//   //   // sample bin data
//   //   let data = [
//   //     { start: 5, end: 4.5 },
//   //     { start: 4.5, end: 4 },
//   //     { start: 4, end: 3.5 },
//   //     { start: 3.5, end: 3 },
//   //     { start: 3, end: 2.5 },
//   //     { start: 2.5, end: 2 },
//   //     { start: 2, end: 1.5 },
//   //   ];

//   const viewRange = () => {
//     return [
//       [0 + props.chartConfig.paddingX(), props.chartConfig.middleCoord()[0]],
//       [
//         0 + props.chartConfig.paddingY(),
//         props.chartConfig.paddingY() + props.chartConfig.chartHeight,
//       ],
//     ];
//   };

//   const data2View = (range) => {
//     try {
//       let data = transpose(preProcessData());
//       let _dataRange = dataRange(data, range);

//       data = translate(data, 0, -(_dataRange[1][2] / 2 + _dataRange[1][0]));
//       data = reflectXAxis(data, true, false);
//       data = translate(data, 0, _dataRange[1][2] / 2 + _dataRange[1][0]);

//       let _viewRange = viewRange();
//       let viewRangeValue = [
//         _viewRange[0][1] - _viewRange[0][0],
//         _viewRange[1][1] - _viewRange[1][0],
//       ];

//       let viewMatrix = data.map((axis, i) =>
//         axis.map(
//           (value) =>
//             ((value - _dataRange[i][0]) * viewRangeValue[i]) /
//               _dataRange[i][2] +
//             _viewRange[i][0]
//         )
//       );

//       let offsetY =
//         viewMatrix[1][viewMatrix[1].length - 1] -
//         props.chartConfig.middleCoord()[1];

//       viewMatrix = translate(viewMatrix, 0, -offsetY);

//       return viewMatrix;
//     } catch (e) {
//       return [];
//     }
//   };

//   const plotData = (range) => {
//     try {
//       let data = data2View(range);

//       data = transpose(data);

//       let dataPoints = [];
//       data.map((coord) => {
//         coord = [coord[0], Number(coord[1])];
//         dataPoints.push(
//           <circle
//             cx={coord[0]}
//             cy={Number(coord[1])}
//             r={0}
//             fill="red"
//             className="circle"
//           />
//         );
//       });

//       data.map((coord, i) => {
//         if (i < data.length - 1) {
//           coord = [coord[0], Number(coord[1])];
//           let coordNext = [data[i + 1][0], Number(data[i + 1][1])];
//           dataPoints.push(
//             <line
//               x1={coord[0]}
//               y1={coord[1]}
//               x2={coordNext[0]}
//               y2={coordNext[1]}
//               stroke="grey"
//             />
//           );
//         }
//       });
//       return dataPoints;
//     } catch (e) {}
//   };

//   return (
//     <>
//       {plotData(320)}
//       {/* <circle cx="1" cy="1" r={100} fill="red" /> */}
//     </>
//   );
// };

// export default Axes;
