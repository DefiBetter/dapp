import { createContext, useRef, useState } from "react";
import { keyframes } from "styled-components";
import { Card } from "./Card";
import styled from "styled-components";
import AlertContext from "../../context/AlertContext";

const timerBarKeyframes = keyframes`
  0% {
    width: 100%;
  }
  99% {
    width: 1%;
  }
  100% {
    width: 0%;
    display: none;
  }
`;

const TimerBar = styled.div`
  background-color: #80a9e4;
  height: 0.5rem;
  width: 100%;
  bottom: 0;
  right: 0;
  position: absolute;
  border-radius: 0.5rem 0 0.5rem 0.5rem;
  margin: 0rem;
  animation-duration: 10s;
  animation-name: ${timerBarKeyframes};
  animation-timing-function: linear;
  &:hover {
    animation-play-state: paused;
  }
`;

const AlertMessage = ({
  children,
  idx,
  alertMessageList,
  setAlertMessageList,
}) => {
  const cardRef = useRef(null);
  return (
    <Card style={{ position: "relative", marginTop: "1rem" }} ref={cardRef}>
      <div
        style={{ textAlign: "right", fontSize: "1.5rem" }}
        onClick={() => {
          console.log("alertMessageList", idx, alertMessageList);
          const arr = [...alertMessageList].splice(idx);
          console.log("alertMessageList arr", arr);
          setAlertMessageList(arr);
        }}
      >
        &times;
      </div>
      <div style={{ wordWrap: "break-word" }}>{children}</div>
      <TimerBar
        onAnimationEnd={() => {
          console.log("cardRef", cardRef.current);
          cardRef.current.remove();
        }}
      />
    </Card>
  );
};

const AlertOverlay = ({ children }) => {
  const [alertMessageList, setAlertMessageList] = useState([]);

  if (alertMessageList.length != 0) {
    console.log("rerendering...");
    return (
      <>
        <AlertContext.Provider value={[alertMessageList, setAlertMessageList]}>
          {children}
        </AlertContext.Provider>
        <div
          style={{
            width: "300px",
            height: "100%",
            position: "absolute",
            zIndex: "100",
            // borderStyle: "solid",
            // backgroundColor: "black",
            bottom: "1rem",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: "0",
              width: "calc(100% - 1rem * 2)",
              margin: "0 1rem",
            }}
          >
            {alertMessageList.map((msg, idx, arr) => {
              if (idx <= 0) {
                return (
                  <AlertMessage
                    idx={idx}
                    alertMessageList={arr}
                    setAlertMessageList={setAlertMessageList}
                  >
                    {msg}
                  </AlertMessage>
                );
              } else {
                return (
                  <AlertMessage
                    idx={idx}
                    alertMessageList={arr}
                    setAlertMessageList={setAlertMessageList}
                  >
                    <div>{msg}</div>
                  </AlertMessage>
                );
              }
            })}
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <AlertContext.Provider value={[alertMessageList, setAlertMessageList]}>
          {children}
        </AlertContext.Provider>
      </>
    );
  }
};

export { AlertMessage, AlertOverlay };
