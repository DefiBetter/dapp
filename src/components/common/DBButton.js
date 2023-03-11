export default function DBButton({ children, disabled, onClick }) {
  return (
    <button
      disabled={disabled}
      className="h-14 disabled:bg-gray-400 shadow-sm shadow-db-cyan-process pb-0.5 bg-db-cyan-process dark:text-white w-full rounded-lg text-lg transition-colors"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
