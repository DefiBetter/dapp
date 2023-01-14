import styled from "styled-components";

const Grid = styled.table`
  width: 100%;
  padding: ${(props) =>
    props.padding == 0 || props.padding ? props.padding : 0.5}rem;
  max-height: 100%;
`;

const GridRow = styled.tr``;
const GridCell = styled.td`
  padding: ${(props) =>
    props.padding == 0 || props.padding ? props.padding : 0.5}rem;
  // border-color: black;
  // border-style: solid;
`;
const GridCell2 = styled(GridCell)`
  width: calc(100% / 2);
`;
const GridCell3 = styled(GridCell)`
  width: calc(100% / 3);
`;
const GridCell4 = styled(GridCell)`
  width: calc(100% / 4);
`;

export { Grid, GridRow, GridCell, GridCell2, GridCell3, GridCell4 };
