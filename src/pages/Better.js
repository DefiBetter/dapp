import Action from "../components/Better/Action";
import Detail from "../components/Better/Detail";
import Epoch from "../components/Better/Epoch";
import Pair from "../components/Better/Pair";
import Chart from "../components/Chart/Chart";
import "./Better.css";

function Better() {
  return (
    <>
      <div className="container">
        <div className="header">
          <Pair />
          <Epoch />
          <Action />
        </div>
        <div className="body">
          <Chart />
          <Detail />
        </div>
      </div>
    </>
  );
}

export default Better;
