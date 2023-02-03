import { useAccount, useNetwork } from "wagmi";
import Social from "../components/common/Social";

import { NavbarSimple } from "../components/Navbar/NavbarSimple";
import styles from "./Landing.module.css";

function Landing() {
  return (
    <>
      <NavbarSimple />
      <div className={styles.container}>
        <div className={styles.fancyText}>Coming soon... 💦</div>
        <img
          className={styles.logo}
          src={require("../static/image/better-logo.png")}
        />
        <br></br>
        <br></br>
        <br></br>
        <div style={{ width: "100%" }}>
          <Social />
        </div>
        <br></br>
        <br></br>
      </div>
    </>
  );
}

export default Landing;
