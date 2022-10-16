import styled from "styled-components";

const FancyText = styled.div`
  font-size: 1rem;
  font-family: marguerite;
  color: #2aaee6;
`;

const FancyTextWhite = styled(FancyText)`
  color: white;
`;

const CenterText = styled.p`
  text-align: center;
  font-size: 1.5rem;
  margin: 0px 20px;
`;

export { FancyText, FancyTextWhite, CenterText };
