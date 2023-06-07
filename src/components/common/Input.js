import { BsArrowUpShort } from "react-icons/bs";

const InputNumber = (props) => {
  const setMax = () => {
    props.onMax(props.max);
  };

  return (
    <div
      className={`${
        props.heightTWClass ? props.heightTWClass : "h-14"
      } dark:hover:brightness-125 transition-all w-full bg-white dark:bg-db-dark-input rounded-lg flex gap-4 items-center px-4 shadow-inner shadow-db-cyan-process dark:shadow-black`}
    >
      <input
        type={"number"}
        min={props.min}
        max={props.max}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        className="text-left md:text-center h-10 w-full focus:ring-0 focus:outline-none rounded-lg bg-white dark:bg-db-dark-input"
      />
      {props.max !== 0 && (
        <div
          onClick={setMax}
          className="cursor-pointer rounded-lg flex justify-center items-center h-8 border-[1px] border-db-cyan-process text-db-cyan-process hover:bg-db-cyan-process hover:text-white transition-colors"
        >
          <BsArrowUpShort size={30} />
        </div>
      )}
      <div className="flex-shrink-0">{props.symbol}</div>
    </div>
  );
};

export { InputNumber };
