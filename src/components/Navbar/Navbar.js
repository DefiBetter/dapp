import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <div className={styles.container}>
      <Link to="/" className={styles.logo}>
        <svg>
          <text x={20} y={50} className={styles.defi}>
            DeFi
          </text>
          <text x={100} y={80} className={styles.better}>
            Better
          </text>
        </svg>
      </Link>
      <div className={styles.pages}>
        <div className={styles.page}>
          <Link to="/presale">Presale</Link>
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
      <div className={styles.connect}></div>
    </div>
  );
};

export default Navbar;
