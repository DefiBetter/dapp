import { Link } from "react-router-dom";
import { SwitchNetwork } from "./web3/SwitchNetwork";
import { WalletConnect } from "./web3/WalletConnect";
import styles from "./Navbar.module.css";
import { CardMargin } from "../common/Card";

const Navbar = () => {
  return (
    <CardMargin>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <img
            className={styles.logo}
            src={require("../../static/image/better-logo.png")}
          />
        </Link>
        <div className={styles.pages}>
          <div className={styles.page}>
            <Link to="/presale">Presale</Link>
          </div>
          <div className={styles.page}>
            <Link to="/public-sale">Public Sale</Link>
          </div>
          <div className={styles.page}>
            <Link to="/staking">Staking</Link>
          </div>
          <div className={styles.page}>
            <Link to="/documentation">Documentation</Link>
          </div>
          <div className={styles.page}>
            <Link to="/faq">FAQ</Link>
          </div>
        </div>
        <div className={styles.connect}>
          <SwitchNetwork />
          <WalletConnect />
        </div>
      </div>
    </CardMargin>
  );
};

export default Navbar;
