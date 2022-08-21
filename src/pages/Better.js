import Action from "../components/Better/Action";
import Detail from "../components/Better/Detail";
import Epoch from "../components/Better/Epoch";
import Pair from "../components/Better/Pair";
import Chart from "../components/Chart/Chart";
import Navbar from "../components/Navbar/Navbar";
import styles from "./Better.module.css";

function Better() {
  return (
    <>
      <Navbar></Navbar>
      <div className={styles.container}>
        <div className={styles.header}>
          <Pair />
          <Epoch />
          <Action />
        </div>
        <div className={styles.body}>
          <Chart />
          <Detail />
        </div>
      </div>
    </>
  );
}

export default Better;
