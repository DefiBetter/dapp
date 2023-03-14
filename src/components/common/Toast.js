import { ToastStatus } from "../../context/ToastContext";

const Toast = ({ toast }) => {
  function toastBgColor() {
    if (toast.status === ToastStatus.Success) {
      return "bg-db-cyan-process";
    } else if (toast.status === ToastStatus.Failed) {
      return "bg-red-500";
    } else if (toast.status === ToastStatus.Information) {
      return "bg-orange-500";
    }
  }

  function toastSliderColor() {
    if (toast.status === ToastStatus.Success) {
      return "bg-db-little-boy";
    } else if (toast.status === ToastStatus.Failed) {
      return "bg-red-500";
    } else if (toast.status === ToastStatus.Information) {
      return "bg-orange-500";
    }
  }

  function toastBorderColor() {
    if (toast.status === ToastStatus.Success) {
      return "border-db-cyan-process";
    } else if (toast.status === ToastStatus.Failed) {
      return "border-red-500";
    } else if (toast.status === ToastStatus.Information) {
      return "border-orange-500";
    }
  }

  function toastTitle() {
    if (toast.status === ToastStatus.Success) {
      return "Transaction Executed";
    } else if (toast.status === ToastStatus.Failed) {
      return "Transaction Failed";
    } else if (toast.status === ToastStatus.Information) {
      return "Information";
    }
  }

  return (
    <div
      className={`relative border-2 shadow-db ${toastBorderColor()} opacity-0 animate-toast left-6`}
    >
      <div
        className="w-72 text-sm bg-white sm:w-96 text-black"
        id="static-example"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        data-mdb-autohide="false"
      >
        <div
          className={`flex items-center justify-between ${toastBgColor()}  py-2 px-3`}
        >
          <p className="flex items-center font-bold text-white">
            {toast.status === ToastStatus.Success ? (
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="check-circle"
                className="mr-2 h-4 w-4 fill-current"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  fill="white"
                  d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"
                ></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="white"
                className="mr-2 h-5 w-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            )}
            {toastTitle()}
          </p>
          {toast.hash && (
            <div className="flex">
              <a
                className=" flex items-center gap-1 align-middle text-xs"
                target="_blank"
                rel="noreferrer"
                href={`https://bscscan.com/tx/${toast.hash}`}
              >
                <span className="text-xs text-white">View</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="white"
                  className="h-5 w-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </a>
            </div>
          )}
        </div>
        <div
          className={`absolute top-[36px] ${toastSliderColor()} animate-toast-slider w-full h-1`}
        ></div>
        <div className="break-words p-3">{toast.message}</div>
      </div>
    </div>
  );
};

export default Toast;
