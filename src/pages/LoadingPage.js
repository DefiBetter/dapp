import Loader from "../components/common/Loader";

function LoadingPage() {
  return (
    <div className="bg-db-light dark:bg-db-dark-nav transition-colors rounded-lg p-2 md:p-4 min-h-[92vh] border-b-2 border-db-cyan-process w-full flex justify-center items-center">
      <div className="p-2 md:p-4 flex justify-around w-full items-center">
        <Loader text="Loading" />
      </div>
    </div>
  );
}

export default LoadingPage;
