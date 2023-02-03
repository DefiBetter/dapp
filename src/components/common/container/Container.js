import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import WindowContext from "../../../context/WindowContext";

const Container = styled.div`
  margin: 1rem;
  display: flex;
  flex-direction: column;
  border-width: 2px;
  border-style: solid;
  border-color: #2aaee6;
  border-radius: 20px;
  border-width: 5px;
  background-color: #cce5ff;
  box-shadow: 5px 5px 10px 0px grey;
  flex: 1;
  ${(props) => (props.overflow ? null : "overflow: hidden;")}
`;

styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  min-width: 1500px;
`;

const InnerContainer = styled.div`
  max-width: 55rem;
  width: 100vw;
  min-width: 55rem;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export { Container, InnerContainer };
