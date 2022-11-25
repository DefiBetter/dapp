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

const SmallText = styled(FancyText)`
  font-size: 0.75rem;
  height: 0.75rem;
  color: inherit;
`;

const MedText = styled(FancyText)`
  font-size: 1rem;
  height: 1.5rem;
  color: inherit;
`;

const NormalText = styled.div`
  font-family: Arial;
  color: inherit;
`;

export {
  FancyText,
  FancyTextWhite,
  CenterText,
  SmallText,
  MedText,
  NormalText,
};
