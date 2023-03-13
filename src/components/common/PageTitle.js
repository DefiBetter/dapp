export default function PageTitle({ title, fancyTitle }) {
  return (
    <div className=" z-10 flex justify-center ">
      <div className="w-full md:w-1/2 lg:w-1/3 shadow-sm dark:shadow-none shadow-db-cyan-process bg-white dark:bg-db-dark p-2 rounded-lg flex justify-center">
        <div className="flex justify-center text-3xl">
          {title}
          <span className="font-bold mt-7 font-fancy text-4xl text-db-cyan-process">
            {fancyTitle} 💦
          </span>
        </div>
      </div>
    </div>
  );
}
