// contexts/session-context.tsx
"use client";

import { authClient } from "@/lib/auth-client";
import { createContext, ReactNode, useContext } from "react";

type SessionContextType = ReturnType<typeof authClient.useSession>;

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const session = authClient.useSession();

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return context;
}
