import { Link } from "react-router-dom";
import { SwitchNetwork } from "./web3/SwitchNetwork";
import { WalletConnect } from "./web3/WalletConnect";
import styles from "./Navbar.module.css";
import { FancyText, UnderlineText } from "../common/Text";

const Navbar = () => {
  return (
    <div className={styles.container}>
      <Link to="/" className={styles.logo}>
        <img
          className={styles.logo}
          src={require("../../static/image/better-logo.png")}
        />
      </Link>
      <div className={styles.pages}>
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
            <Link to="/documentation">Documentation</Link>
          </UnderlineText>
        </FancyText>
      </div>
      <div className={styles.connect}>
        <SwitchNetwork />
        <WalletConnect />
      </div>
    </div>
  );
};

export default Navbar;
