import { useEffect, useState } from "react";
import WindowContext from "../../../context/WindowContext";
import Navbar from "../../Navbar/Navbar";
import { AlertOverlay } from "../AlertMessage";
import styled from "styled-components";

const Container = styled.div`
  padding: 1rem;
`;

const Body = styled.div`
  padding-top: 1rem;
`;

const AppContainer = ({ children }) => {
  const [windowWidth, setWindowWidth] = useState(WindowContext.width);
  const [windowHeight, setWindowHeight] = useState(WindowContext.height);
  const [screen, setScreen] = useState("xs");

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const updateDimensions = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    setWindowWidth(width);
    setWindowHeight(height);
    setScreen(
      (() => {
        if (width >= 1200) {
          return "lg";
        } else if (width >= 992) {
          return "md";
        } else if (width >= 768) {
          return "sm";
        } else {
          return "xs";
        }
      })()
    );
  };

  return (
    <WindowContext.Provider
      value={{ width: windowWidth, height: windowHeight, screen: screen }}
    >
      <Container>
        <AlertOverlay>
          <Navbar />
          <Body>{children}</Body>
        </AlertOverlay>
      </Container>
    </WindowContext.Provider>
  );
};

export default AppContainer;
