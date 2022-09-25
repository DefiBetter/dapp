import styled from "styled-components";

const Card = styled.div`
  border-radius: 10px;
  border-width: 2px;
  border-color: #2aaee6;
  background-color: white;
  border-style: solid;
  padding: 10px;
`;

const CardBlueBg = styled(Card)`
  background-color: #cce5ff;
`;

export { Card, CardBlueBg };
