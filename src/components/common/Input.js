const InputNumber = (props) => {
  const setMax = () => {
    props.setValue(props.max);
  };

  return (
    <div className="w-full flex items-center p-2 justify-center bg-db-background rounded-lg shadow-db">
      <input
        onChange={props.onChange}
        type={"number"}
        min={props.min}
        placeholder={props.placeholder}
        value={props.value}
        max={props.max}
        className="text-black text-sm"
      />

      <button
        onClick={setMax}
        className="bg-db-cyan-process text-white border-[1px] border-black rounded-md w-12 shadow-db px-2 h-8 flex justify-center items-center"
      >
        MAX
      </button>
    </div>
  );
};

export { InputNumber };
