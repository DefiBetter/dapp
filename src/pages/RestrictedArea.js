import {RiSignalWifiErrorLine} from 'react-icons/ri'

function RestrictedArea({ country }) {
  return (
    <div className="bg-db-light dark:bg-db-dark-nav transition-colors rounded-lg p-2 md:p-4 min-h-[85vh] border-b-2 border-db-cyan-process w-full flex justify-center items-center">
      {/* <PageTitle title="Strategy" fancyTitle="Vaults" /> */}

      <div className="p-2 md:p-4 flex flex-col justify-around w-full items-center gap-10 text-center text-xl">
        <RiSignalWifiErrorLine size={100} />
        <div>
          It seems you are trying to reach this site from the USA.<br />
          app.defibetter.finance is as of now not available to users from the
          USA yet.
        </div>
        <div>
          Should you be not from the USA and believe you have been falsely
          detected as such,<br /> for example due to using a <span className='font-bold'>VPN like in the OperaGX
          browser</span> or other technologies <span className='font-bold'>to alter your detected location</span>, please
          turn off your VPN and try reloading the page.
        </div>
      </div>
    </div>
  );
}

export default RestrictedArea;
