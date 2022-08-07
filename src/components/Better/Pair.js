import SelectSearch from "react-select-search";
import "react-select-search/style.css";

const Pair = (props) => {
  let options = [
    { name: "Ethereum", value: "ETH" },
    { name: "Avalanche", value: "AVAX" },
  ];
  return (
    <>
      <image />
      <SelectSearch options={options} className="select-search" search />
    </>
  );
};

export default Pair;
