import styled from "styled-components";

const TitleImage = styled.div`
  width: 200px;
  height: 80px;
  margin: 0 auto;
`;

const Word1 = styled.text`
  font-size: 2.5rem;
`;

const Word2 = styled.text`
  font-size: 2.5rem;
  font-family: marguerite;
  fill: #2aaee6;
`;

const FancyTitle = (props) => {
  return (
    <TitleImage>
      <svg>
        <Word1 x="20" y="50">
          {props.word1}
        </Word1>
        <Word2 x="80" y="80">
          {props.word2}
        </Word2>
      </svg>
    </TitleImage>
  );
};

export default FancyTitle;
