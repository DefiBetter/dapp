import styled from "styled-components";

const FancyText = styled.div`
  font-size: 1.5rem;
  font-family: marguerite;
  color: #2aaee6;
`;

const BlueText = styled.div`
  color: #2aaee6;
`;

const UnderlineText = styled.div`
  text-decoration: underline;
`;

const FancyTextWhite = styled(FancyText)`
  color: white;
`;

const CenterText = styled.p`
  text-align: center;
  font-size: 1rem;
  margin: 0px;
`;

const SmallText = styled.div`
  font-size: 0.75rem;
  // height: 0.75rem;
  color: inherit;
`;

const ExSmallText = styled(SmallText)`
  font-size: 0.7rem;
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
  ExSmallText,
  MedText,
  NormalText,
  UnderlineText,
  BlueText,
};
