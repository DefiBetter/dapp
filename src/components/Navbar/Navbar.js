import { Link } from "react-router-dom";
import { SwitchNetwork } from "./web3/SwitchNetwork";
import { WalletConnect } from "./web3/WalletConnect";
import styles from "./Navbar.module.css";
import { FancyText, UnderlineText } from "../common/Text";
import { useContext, useEffect, useRef, useState } from "react";
import WindowContext from "../../context/WindowContext";
import { Grid, GridCol, GridRow } from "../common/Grid";
import styled, { keyframes } from "styled-components";
import { Card } from "../common/Card";
import { Transition } from "react-transition-group";

const BurgerSpan = styled.span`
  height: 0.75rem;
  width: calc(0.75rem * 5);
  display: block;
  background: #cdcdcd;
  border-radius: 1rem;
  float: right;
`;

const Hamburger = (props) => {
  return (
    <div
      onClick={() => {
        console.log("show", props.showSideNavbar);
        props.setShowSideNavbar(!props.showSideNavbar);
      }}
      style={{
        alignSelf: "center",
        width: "100%",
        float: "right",
        display: "block",
        zIndex: "100",
        pointerEvents: "all",
      }}
    >
      <BurgerSpan />
      <br></br>
      <BurgerSpan />
      <br></br>
      <BurgerSpan />
    </div>
  );
};

const NavContainer = ({ children }) => {
  return (
    <Card
      borderWidth={0.3}
      shadow={true}
      style={{ overflow: "unset", height: "70px" }}
    >
      {children}
    </Card>
  );
};

const Navbar = () => {
  const windowDimension = useContext(WindowContext);
  console.log("windowDImension", windowDimension);

  const [showSideNavbar, setShowSideNavbar] = useState(false);
  useEffect(() => {
    setShowSideNavbar(false);
  }, [windowDimension]);

  return (
    <NavContainer>
      <Grid>
        <GridRow>
          <GridCol xs="8" sm="8" md="6" lg="2">
            <Link to="/" className={styles.logo}>
              <img
                height="100%"
                src={require("../../static/image/better-logo.png")}
              ></img>
            </Link>
          </GridCol>
          <GridCol xs="0" sm="0" md="0" lg="6">
            <div className={styles.pages}>
              <FancyText>
                <UnderlineText>
                  <Link to="/">Better</Link>
                </UnderlineText>
              </FancyText>
              <FancyText>
                <UnderlineText>
                  <Link to="/staking">Staking</Link>
                </UnderlineText>
              </FancyText>
              <FancyText>
                <UnderlineText>
                  <Link to="/vaults">Strategy vaults</Link>
                </UnderlineText>
              </FancyText>
              <FancyText>
                <UnderlineText>
                  <a href="https://app.gitbook.com/o/NBcMmIGNsNgrhjS2tczv/s/qLpJBZkEb6TQw9OfyioS/">
                    Documentation
                  </a>
                </UnderlineText>
              </FancyText>
            </div>
          </GridCol>
          <GridCol xs="0" sm="0" md="3" lg="2">
            <SwitchNetwork />
          </GridCol>
          <GridCol xs="0" sm="3" md="2" lg="2">
            <WalletConnect />
          </GridCol>
          <GridCol xs="4" sm="1" md="1" lg="0">
            <Hamburger
              showSideNavbar={showSideNavbar}
              setShowSideNavbar={setShowSideNavbar}
            />
          </GridCol>
        </GridRow>
      </Grid>
      {windowDimension.screen != "lg" ? (
        <SideNavbar showSideNavbar={showSideNavbar} />
      ) : null}
    </NavContainer>
  );
};

const sideNavbarStyles = {
  position: "absolute",
  height: "100vh",
  // borderStyle: "solid",
  top: "0",
  right: "0",
  boxShadow: "5px 5px 100px 0px grey",
  backgroundColor: "white",
  width: "0",
  transition: "width 1000ms",
  zIndex: "99",
  overflow: "hidden",
};

const sideNavbarTransitionStyles = {
  entering: {
    width: "0px",
  },
  entered: {
    width: "300px",
  },
  exiting: {
    width: "300px",
  },
  exited: {
    width: "0px",
  },
};

const sideNavbarItemTransitionStyles = {
  entering: {
    opacity: "0",
  },
  entered: {
    opacity: "1",
  },
  exiting: {
    opacity: "1",
  },
  exited: {
    opacity: "0",
  },
};

const SideNavbar = ({ children, ...props }) => {
  const windowDimension = useContext(WindowContext);
  const nodeRef = useRef(null);

  return (
    <Transition nodeRef={nodeRef} in={props.showSideNavbar} timeout={0}>
      {(state) => (
        <div
          ref={nodeRef}
          style={{
            ...sideNavbarStyles,
            ...sideNavbarTransitionStyles[state],
          }}
        >
          <Transition nodeRef={nodeRef} in={props.showSideNavbar} timeout={0}>
            {(state) => (
              <div
                className={styles.pages}
                style={{
                  transition: "opacity 1000ms",
                  ...sideNavbarItemTransitionStyles[state],
                }}
              >
                {["xs", "sm"].filter((bp) => bp == windowDimension.screen)
                  .length > 0 ? (
                  <div style={{ height: "70px" }}>
                    <SwitchNetwork />
                  </div>
                ) : null}
                {["xs"].filter((bp) => bp == windowDimension.screen).length >
                0 ? (
                  <WalletConnect />
                ) : null}
                {["xs", "sm", "md"].filter(
                  (breakpoint) => breakpoint == windowDimension.screen
                ).length > 0 ? (
                  <>
                    <FancyText>
                      <UnderlineText>
                        <Link to="/">Better</Link>
                      </UnderlineText>
                    </FancyText>
                    <FancyText>
                      <UnderlineText>
                        <Link to="/staking">Staking</Link>
                      </UnderlineText>
                    </FancyText>
                    <FancyText>
                      <UnderlineText>
                        <Link to="/vaults">Strategy vaults</Link>
                      </UnderlineText>
                    </FancyText>
                    <FancyText>
                      <UnderlineText>
                        <a href="https://app.gitbook.com/o/NBcMmIGNsNgrhjS2tczv/s/qLpJBZkEb6TQw9OfyioS/">
                          Documentation
                        </a>
                      </UnderlineText>
                    </FancyText>
                  </>
                ) : null}
              </div>
            )}
          </Transition>
        </div>
      )}
    </Transition>
  );
};

{
  /* <div className={styles.pages}>
        <FancyText>
          <UnderlineText>
            <Link to="/">Better</Link>
          </UnderlineText>
        </FancyText>
        <FancyText>
          <UnderlineText>
            <Link to="/staking">Staking</Link>
          </UnderlineText>
        </FancyText>
        <FancyText>
          <UnderlineText>
            <Link to="/vaults">Strategy vaults</Link>
          </UnderlineText>
        </FancyText>
        <FancyText>
          <UnderlineText>
            <a href="https://app.gitbook.com/o/NBcMmIGNsNgrhjS2tczv/s/qLpJBZkEb6TQw9OfyioS/">
              Documentation
            </a>
          </UnderlineText>
        </FancyText>
      </div>
      <div className={styles.connect}>
        <SwitchNetwork />
        <WalletConnect />
      </div> */
}

export default Navbar;
