// ToastContext.js
import React, { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "info", duration = 3000) => {
    const id = Date.now();
    const newToast = { id, message, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={containerStyle}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{ ...toastStyle, ...typeStyles[toast.type],fontFamily:"text" }}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

// Styles
const containerStyle = {
  position: "fixed",
  bottom: "0.5rem",
  left: "0.5rem",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  zIndex: 99999,
};

const toastStyle = {
  padding: "0.5rem 1rem",
  borderRadius: "0.1rem",
  color: "black",
  fontSize:"0.9rem"
};

const typeStyles = {
  success: { backgroundColor: "#0483bb" },
  error: { backgroundColor: "#FC8415" },
  info: { backgroundColor: "#FC8415" },
};
