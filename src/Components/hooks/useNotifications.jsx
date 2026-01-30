// Singleton WebSocket with reference counting to avoid duplicate sockets
import { useEffect } from "react";
import { useUser } from "../../Context/UserContext";

let socketSingleton = null;
let socketRefCount = 0;
let socketUrlForSingleton = null;

// 🔥 IMPORTANT: backend WS base (NOT Vercel)
const BACKEND_WS_BASE =
  import.meta.env.VITE_BACKEND_WS_BASE ||
  "wss://api.gogrub.online"; // ← change to your backend domain

export const useNotifications = () => {
  const { state, dispatch } = useUser();

  useEffect(() => {
    const token = localStorage.getItem("access");

    if (!token) {
      if (socketSingleton) {
        socketRefCount = Math.max(0, socketRefCount - 1);
        if (socketRefCount === 0) {
          socketSingleton.close();
          socketSingleton = null;
          socketUrlForSingleton = null;
        }
      }
      dispatch({ type: "SET_WS_CONNECTED", payload: false });
      return;
    }

    // ✅ CORRECT WS URL (direct to backend)
    new wsUrl(
  "wss://api.gogrub.online/ws/notifications/",
  ["jwt", token]
);


    // If URL changed (token/user changed), reset socket
    if (socketSingleton && socketUrlForSingleton !== wsUrl) {
      try {
        socketSingleton.close();
      } catch (_) {}
      socketSingleton = null;
      socketRefCount = 0;
      socketUrlForSingleton = null;
    }

    // Reuse existing socket
    if (socketSingleton) {
      socketRefCount += 1;
      dispatch({ type: "SET_WS_CONNECTED", payload: true });
      return;
    }

    // Create singleton socket
    const socket = new WebSocket(wsUrl);
    socketSingleton = socket;
    socketRefCount = 1;
    socketUrlForSingleton = wsUrl;

    socket.onopen = () => {
      console.log("✅ WebSocket connected:", wsUrl);
      dispatch({ type: "SET_WS_CONNECTED", payload: true });
    };

    socket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: parsed.payload ?? parsed,
        });
      } catch (err) {
        console.error("Failed to parse WS message", err, event.data);
      }
    };

    socket.onerror = (err) => {
      console.error("❌ WebSocket error", err);
    };

    socket.onclose = (ev) => {
      console.warn("⚠️ WebSocket closed", ev);
      socketSingleton = null;
      socketUrlForSingleton = null;
      socketRefCount = 0;
      dispatch({ type: "SET_WS_CONNECTED", payload: false });
    };

    return () => {
      socketRefCount = Math.max(0, socketRefCount - 1);
      if (socketRefCount === 0 && socketSingleton) {
        try {
          socketSingleton.close();
        } catch (_) {}
        socketSingleton = null;
        socketUrlForSingleton = null;
      }
      dispatch({ type: "SET_WS_CONNECTED", payload: false });
    };
  }, [state.user, dispatch]);
};
