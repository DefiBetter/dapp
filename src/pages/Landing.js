import Social from "../components/common/Social";
import { FancyText } from "../components/common/Text";

import styles from "./Landing.module.css";

function Landing() {
  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <div className={styles.text}>
          <FancyText style={{ fontSize: "5vh" }}>Coming soon... 💦</FancyText>
        </div>
        <img
          className={styles.logo}
          src={require("../static/image/better-logo.png")}
        />
        <Social />
      </div>
    </div>
  );
}

export default Landing;
