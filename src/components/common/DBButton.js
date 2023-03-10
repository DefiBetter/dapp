export default function DBButton({ children, disabled, onClick }) {
  return (
    <button
      disabled={disabled}
      className="disabled:bg-gray-400 pb-0.5 border-[1px] border-black shadow-db bg-db-cyan-process h-10 w-full rounded-lg text-lg text-white hover:bg-db-blue-200"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
