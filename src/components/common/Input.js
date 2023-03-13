const InputNumber = (props) => {
  const setMax = () => {
    props.setValue(props.max);
  };

  return (
    <div className="h-14 w-full bg-white dark:bg-db-dark-input rounded-lg flex items-center px-4">
      <input
        onChange={props.onChange}
        type={"number"}
        min={props.min}
        placeholder={props.placeholder}
        value={props.value}
        max={props.max}
        className="px-4 text-center h-10 w-full focus:ring-0 focus:outline-none rounded-lg bg-white dark:bg-db-dark-input"
      />

      <button
        onClick={setMax}
        className="cursor-pointer rounded-md flex gap-2 justify-center items-center h-9 pb-0.5 px-3 border-[1px] border-db-cyan-process text-db-cyan-process hover:bg-db-cyan-process hover:text-white transition-colors"
      >
        MAX
      </button>
    </div>
  );
};

export { InputNumber };
