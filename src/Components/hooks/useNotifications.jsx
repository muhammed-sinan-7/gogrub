// Singleton WebSocket with reference counting to avoid duplicate sockets
import { useEffect } from "react";
import { useUser } from "../../Context/UserContext";

let socketSingleton = null;
let socketRefCount = 0;
let socketUrlForSingleton = null;

export const useNotifications = () => {
  const { state, dispatch } = useUser();

  useEffect(() => {
    const token = localStorage.getItem("access");

    // If token changed such that we need a different wsUrl, we close the previous socket
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const host =
      window.location.hostname === "localhost"
        ? `${window.location.hostname}:8000`
        : window.location.host;
    const wsUrl = token
      ? `${protocol}://${host}/ws/notifications/?token=${encodeURIComponent(token)}`
      : null;

    // If there's no token, ensure socket is closed and mark disconnected
    if (!token) {
      if (socketSingleton) {
        // Decrement and maybe close
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

    // If the singleton exists but URL changed (different token/host) close it and recreate
    if (socketSingleton && socketUrlForSingleton !== wsUrl) {
      // tear down old socket
      try {
        socketSingleton.close();
      } catch (e) {
        // ignore
      }
      socketSingleton = null;
      socketRefCount = 0;
      socketUrlForSingleton = null;
    }

    // If we already have a socket for this URL, just increment ref count and return
    if (socketSingleton) {
      socketRefCount += 1;
      dispatch({ type: "SET_WS_CONNECTED", payload: true });
      return;
    }

    // Create socket singleton
    const socket = new WebSocket(wsUrl);
    socketSingleton = socket;
    socketRefCount = 1;
    socketUrlForSingleton = wsUrl;

    socket.onopen = () => {
      console.log("✅ WebSocket connected", wsUrl);
      dispatch({ type: "SET_WS_CONNECTED", payload: true });
    };

    socket.onmessage = (event) => {
      try {
        const raw = event.data;
        const parsed = JSON.parse(raw);
        // Adapt to your backend payload shape: using "payload" below if channels send it
        const notification = parsed.payload ?? parsed;
        dispatch({ type: "ADD_NOTIFICATION", payload: notification });
      } catch (err) {
        console.error("Failed to parse WS message", err, event.data);
      }
    };

    socket.onerror = (err) => {
      console.error("❌ WebSocket error", err);
    };

    socket.onclose = (ev) => {
      console.warn("⚠️ WebSocket closed", ev);
      // close singleton and reset
      socketSingleton = null;
      socketUrlForSingleton = null;
      socketRefCount = 0;
      dispatch({ type: "SET_WS_CONNECTED", payload: false });
    };

    // Cleanup for this hook instance on unmount
    return () => {
      socketRefCount = Math.max(0, socketRefCount - 1);
      if (socketRefCount === 0 && socketSingleton) {
        try {
          socketSingleton.close();
        } catch (e) {
          // ignore
        }
        socketSingleton = null;
        socketUrlForSingleton = null;
      }
      dispatch({ type: "SET_WS_CONNECTED", payload: false });
    };
    // We intentionally include dispatch and state.user so it reacts to login/logout
  }, [state.user, dispatch]);
};