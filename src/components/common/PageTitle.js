export default function PageTitle({ title, fancyTitle }) {
  return (
    <div className=" z-10 flex justify-center ">
      <div className="overflow-hidden relative w-full md:w-1/3 shadow-sm dark:shadow-none shadow-db-cyan-process bg-white dark:bg-db-dark p-2 rounded-lg flex justify-center">
        <div className="flex justify-center text-3xl">
          {title}
          <span className="font-bold mt-7 font-fancy text-4xl text-db-cyan-process">
            {fancyTitle}
          </span>
        </div>
        <div className="absolute -top-0.5 -left-1 opacity-30 text-4xl">💦</div>

      </div>
    </div>
  );
}
