import Navbar from "../components/Navbar/Navbar";
import styles from "./Staking.module.css";

function Staking() {
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.innerContainer}>
          <div className={styles.assetContainer}>
            <div className={styles.detailContainer}>
              <div className={styles.detailBack}>
                <button className={styles.asset}>
                  <b>BT-BNB-LP</b>
                </button>
                <div className={styles.arrow}>
                  <svg viewBox="0 0 170 15" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="0,5 0,10 160,10 160,15 170,7.5 160,0 160,5" />
                  </svg>
                </div>
                <button className={styles.asset}>
                  <b>BT</b>
                </button>
              </div>
              <button className={styles.detailFront}>
                <div className={styles.textFancy}>Stake</div>
                <div>
                  <b>BT-BNB-LP</b>
                </div>
                <div className={styles.textFancy}>to receive</div>
                <div>
                  <b>Better Token</b>
                </div>
              </button>
            </div>
            <table className={styles.stakeContainer}>
              <tr>
                <td colSpan={2} className={styles.inputAmount}>
                  <div>
                    <input type={"number"} />
                  </div>
                </td>
                <td className={styles.zapAmount}>
                  <div>
                    <input type={"number"} />
                  </div>
                </td>
              </tr>
              <tr>
                <td className={styles.action}>
                  <button className={styles.actionInner}>Stake</button>
                </td>
                <td className={styles.action}>
                  <button className={styles.actionInner}>Unstake</button>
                </td>
                <td className={styles.action}>
                  <button className={styles.actionInner}>Zap in</button>
                </td>
              </tr>
              <tr>
                <td colSpan={3} className={styles.action}>
                  <button className={styles.actionInner}>Claim</button>
                </td>
              </tr>
            </table>
          </div>
          <div className={styles.assetContainer}>
            <div className={styles.detailContainer}>
              <div className={styles.detailBack}>
                <button className={styles.asset}>
                  <b>BT</b>
                </button>
                <div className={styles.arrow}>
                  <svg viewBox="0 0 170 15" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="0,5 0,10 160,10 160,15 170,7.5 160,0 160,5" />
                  </svg>
                </div>
                <button className={styles.asset}>
                  <b>BNB</b>
                </button>
              </div>
              <button className={styles.detailFront}>
                <div className={styles.textFancy}>Stake</div>
                <div>
                  <b>Better Token</b>
                </div>
                <div className={styles.textFancy}>to receive</div>
                <div>
                  <b>BNB</b>
                </div>
              </button>
            </div>
            <table className={styles.stakeContainer}>
              <tr>
                <td colSpan={2} className={styles.inputAmount}>
                  <div>
                    <input type={"number"} />
                  </div>
                </td>
              </tr>
              <tr>
                <td className={styles.action}>
                  <button className={styles.actionInner}>Stake</button>
                </td>
                <td className={styles.action}>
                  <button className={styles.actionInner}>Unstake</button>
                </td>
              </tr>
              <tr>
                <td colSpan={3} className={styles.action}>
                  <button className={styles.actionInner}>Claim</button>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Staking;
