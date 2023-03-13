export default function ContainerStats({ stats }) {
  const statClass = `h-14 w-full md:w-1/${stats.length} flex flex-col items-center gap-2 justify-center px-2`
  return (
    <div className="flex justify-between flex-wrap gap-4 md:gap-0">
      {stats.map((stat, index) => (
        <div
          key={`${stat.label}-${index}`}
          className={statClass}
        >
          <div className="flex items-center justify-center gap-2 flex-nowrap">
            <div className="text-db-cyan-process">{stat.icon}</div>
            <div className="text-db-cyan-process">{stat.label}</div>
          </div>
          <div className="font-bold">
            {stat.value1} {stat.value2}
          </div>
        </div>
      ))}
    </div>
  );
}
