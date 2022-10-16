import styled from "styled-components";

const Container = styled.div`
  margin: 1rem;
  display: flex;
  min-height: 900px;
  flex-direction: column;
  border-width: 2px;
  border-style: solid;
  border-color: #2aaee6;
  border-radius: 20px;
  border-width: 5px;
  background-color: #cce5ff;
  box-shadow: 5px 5px 10px 0px grey;
  flex: 1;
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  min-width: 1500px;
`;

export { Container, AppContainer };
