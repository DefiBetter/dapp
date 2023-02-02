import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { FancyText, UnderlineText } from "../common/Text";
import styles from "./Navbar.module.css";
import { SwitchNetwork } from "./web3/SwitchNetwork";
import { WalletConnect } from "./web3/WalletConnect";

const NavbarSimple = () => {
  return (
    <div className={styles.container}>
      <Link to="/" style={{ width: "25%" }}>
        <img
          className={styles.logo}
          src={require("../../static/image/better-logo.png")}
        />
      </Link>
      <div className={styles.pages}>
        <FancyText>
          <UnderlineText>
            <a href="/">Better</a>
          </UnderlineText>
        </FancyText>
        <FancyText>
          <UnderlineText>
            <a href="/">Staking</a>
          </UnderlineText>
        </FancyText>
        <FancyText>
          <UnderlineText>
            <a href="/">Strategy vaults</a>
          </UnderlineText>
        </FancyText>
        <FancyText>
          <UnderlineText>
            <a href="/">Documentation</a>
          </UnderlineText>
        </FancyText>
      </div>
      <div className={styles.connect}>
        <SwitchNetwork />
        <WalletConnect />
      </div>
      <Hamburger />
    </div>
  );
};

const NavBar = styled.div`
  display: block;
  position: fixed;
  right: 0px;
  top: 0;
  background-color: white;
  box-shadow: 0px 0px 100px 10px #888888;
  z-index: 1;
  height: 100vh;
  text-align: right;
  padding: 2.5rem;
`;

const Hamburger = () => {
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    updateDims();
    window.addEventListener("resize", updateDims);
    return () => window.removeEventListener("resize", updateDims);
  }, []);

  const updateDims = () => {
    if (window.innerWidth >= 1400) {
      setShowNav(false);
    }
  };

  return (
    <div>
      <div
        style={{ marginRight: "1.5rem" }}
        onClick={() => {
          setShowNav(!showNav);
        }}
      >
        <span className={styles.burger}></span>
        <span className={styles.burger}></span>
        <span className={styles.burger}></span>
      </div>
      {showNav == true ? (
        <NavBar showNav={showNav}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "end",
              marginBottom: "2rem",
            }}
            onClick={() => {
              console.log(showNav);
              setShowNav(!showNav);
            }}
          >
            <span className={styles.burger}></span>
            <span className={styles.burger}></span>
            <span className={styles.burger}></span>
          </div>
          <div>
            <div style={{ alignItems: "end" }}>
              <SwitchNetwork />
            </div>
            <br></br>
            <div style={{ height: "3rem" }}>
              <WalletConnect />
            </div>
            <br></br>
            <FancyText>
              <UnderlineText>
                <a href="/">Better</a>
              </UnderlineText>
            </FancyText>
            <FancyText>
              <UnderlineText>
                <a href="/">Staking</a>
              </UnderlineText>
            </FancyText>
            <FancyText>
              <UnderlineText>
                <a href="/">Strategy vaults</a>
              </UnderlineText>
            </FancyText>
            <FancyText>
              <UnderlineText>
                <a href="/">Documentation</a>
              </UnderlineText>
            </FancyText>
          </div>
        </NavBar>
      ) : null}
    </div>
  );
};
export default NavbarSimple;
