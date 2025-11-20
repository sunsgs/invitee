// hooks/use-authenticated-action.ts
import { useSession } from "@/lib/auth-client";
import { useCallback, useState } from "react";

interface UseAuthenticatedActionOptions {
  onSignInRequired?: () => void;
  onSignInSuccess?: () => void;
}

export function useAuthenticatedAction(
  options: UseAuthenticatedActionOptions = {}
) {
  const { data: session } = useSession();
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const requireAuth = useCallback(
    async (action: () => void | Promise<void>) => {
      // Check if user is anonymous or not logged in
      if (!session || session.user.isAnonymous) {
        // Store the action to execute after sign-in
        setPendingAction(() => action);
        options.onSignInRequired?.();
        return false;
      }

      // User is authenticated, execute immediately
      await action();
      return true;
    },
    [session, options]
  );

  const executePendingAction = useCallback(async () => {
    if (pendingAction) {
      await pendingAction();
      setPendingAction(null);
      options.onSignInSuccess?.();
    }
  }, [pendingAction, options]);

  const clearPendingAction = useCallback(() => {
    setPendingAction(null);
  }, []);

  return {
    requireAuth,
    executePendingAction,
    clearPendingAction,
    hasPendingAction: !!pendingAction,
    isAnonymous: session?.user.isAnonymous ?? true,
    isAuthenticated: !!session && !session.user.isAnonymous,
  };
}
