export default function ContainerStats({ stats }) {
  const statClass = `h-8 md:h-14 w-full md:w-1/${stats.length} flex flex-row md:flex-col items-center gap-2 justify-between md:justify-center px-2`
  return (
    <div className="flex justify-between flex-wrap">
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
