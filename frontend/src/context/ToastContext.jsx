import React, { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "info", duration = 5000) => {
    const id = Date.now();
    const newToast = { id, message, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={containerStyle}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              ...toastStyle,
              ...typeStyles[toast.type],
              animation: "slideUp 0.4s ease forwards",
            }}
          >
            {toast.message}
            <span
              style={closeIconStyle}
              onClick={() => removeToast(toast.id)}
            >
              &times;
            </span>
          </div>
        ))}
      </div>
      <style>
        {`
          @keyframes slideUp {
            0% {
              opacity: 0;
              transform: translateY(4rem);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

// Styles

const containerStyle = {
  position: "fixed",
  bottom: "0.8rem",
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  zIndex: 99999,
};

const toastStyle = {
  position: "relative",
  padding: "0.75rem 2rem 0.75rem 1rem",
  borderRadius: "0.3rem",
  color: "white",
  fontSize: "0.9rem",
  minWidth: "250px",
  maxWidth: "90vw",
  fontFamily: "text",
  boxShadow: "0px 2px 8px rgba(0,0,0,0.15)",
};

const closeIconStyle = {
  position: "absolute",
  right: "0.5rem",
  top: "0.3rem",
  cursor: "pointer",
  fontSize: "1.2rem",
};

const typeStyles = {
  success: { backgroundColor: "#0483bb" },
  error: { backgroundColor: "#FC8415" },
  info: { backgroundColor: "#FC8415" },
};
