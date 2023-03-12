export default function PageTitle({ title, fancyTitle }) {
  return (
    <div className="z-10 text-4xl flex justify-center">
      <div className="w-full md:w-2/3 bg-white dark:bg-db-dark p-4 rounded-lg flex justify-center gap-1 dark:shadow-inner shadow-sm shadow-db-cyan-process dark:shadow-black">
        <div className="flex justify-center text-5xl">
          {title}
          <span className="font-bold mt-7 font-fancy text-5xl text-db-cyan-process">
            {fancyTitle} 💦
          </span>
        </div>
      </div>
    </div>
  );
}
