import { AiOutlineLoading } from "react-icons/ai";

export default function Loader({text}) {
  return (
    <div className="w-full flex items-center justify-center gap-2">
      <div>{text}</div>
      <div>
        <AiOutlineLoading size={20} className="animate-spin mb-1.5" />
      </div>
    </div>
  );
}
