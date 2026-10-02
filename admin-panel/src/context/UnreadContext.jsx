import { createContext, useContext, useState } from "react";

const UnreadContext = createContext();

export function UnreadProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);

  return (
    <UnreadContext.Provider value={{ unreadCount, setUnreadCount }}>
      {children}
    </UnreadContext.Provider>
  );
}

export function useUnread() {
  return useContext(UnreadContext);
}