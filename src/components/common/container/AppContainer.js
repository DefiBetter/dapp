import { useEffect, useState } from "react";
import Navbar from "../../Navbar/Navbar";
import { AlertOverlay } from "../AlertMessage";
import styled from "styled-components";
import Connect from "../Connect";

const Container = styled.div`
  padding: 1rem;
  height: calc(100vh - 2rem);
  display: flex;
  flex-direction: column;
`;

const AppContainer = ({ children }) => {
  return (
    <Container>
      <AlertOverlay>
        <Navbar />
        <Connect>
          <div className='pt-4 flex-1'>{children}</div>
        </Connect>
      </AlertOverlay>
    </Container>
  );
};

export default AppContainer;
