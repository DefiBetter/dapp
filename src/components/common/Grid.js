import styled from "styled-components";

const Grid = styled.table`
  width: 100%;
  padding: 5px;
`;

const GridRow = styled.tr``;
const GridCell = styled.td`
  width: 100%;
  padding: 5px;
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
