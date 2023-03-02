import React, { createContext, useContext, useEffect, useState } from "react";
import Toast from "../components/common/Toast";

const ToastContext = createContext(null);

export const ToastStatus = {
  Success: 0,
  Failed: 1,
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [activeToasts, setActiveToasts] = useState(0);

  useEffect(() => {
    if (activeToasts === 0) {
      setToasts([]);
    }
  }, [activeToasts]);

  const addToast = (status, message, hash) => {
    setToasts([
      ...toasts,
      {
        status: status,
        message: message,
        hash: hash,
        removeToastTimer: setTimeout(() => {
          setActiveToasts((prev) => prev - 1);
        }, 5500),
      },
    ]);
    setActiveToasts((prev) => prev + 1);
  };

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
      }}
    >
      <div className="fixed z-50 bottom-10 left-3 flex flex-col gap-2">
        {toasts.map((toast) => (
          <Toast key={toast.hash} toast={toast} />
        ))}
      </div>

      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
