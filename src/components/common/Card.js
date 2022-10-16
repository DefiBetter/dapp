import styled from "styled-components";

const Card = styled.div`
  border-radius: 20px;
  border-width: 5px;
  border-color: #2aaee6;
  background-color: white;
  border-style: solid;
  padding: 10px;
  box-shadow: 5px 5px 10px 0px grey;
`;

const CardBlueBg = styled(Card)`
  background-color: #cce5ff;
`;

const CardBlueBgBlackBorder = styled(CardBlueBg)`
  border-color: black;
  border-width: 2.5px;
`;

export { Card, CardBlueBg };
