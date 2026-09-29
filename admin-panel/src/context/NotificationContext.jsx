import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback(
    (message, type = "info", duration = 4000) => {
      setNotification({
        id: Date.now(),
        message,
        type,
      });

      if (duration > 0) {
        setTimeout(() => {
          setNotification(null);
        }, duration);
      }
    },
    []
  );

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const success = useCallback(
    (message, duration = 4000) => {
      showNotification(message, "success", duration);
    },
    [showNotification]
  );

  const error = useCallback(
    (message, duration = 5000) => {
      showNotification(message, "error", duration);
    },
    [showNotification]
  );

  const warning = useCallback(
    (message, duration = 4500) => {
      showNotification(message, "warning", duration);
    },
    [showNotification]
  );

  const info = useCallback(
    (message, duration = 4000) => {
      showNotification(message, "info", duration);
    },
    [showNotification]
  );

  return (
    <NotificationContext.Provider
      value={{
        notification,
        showNotification,
        hideNotification,
        success,
        error,
        warning,
        info,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotification must be used inside NotificationProvider"
    );
  }

  return context;
}