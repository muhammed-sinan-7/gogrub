// Singleton WebSocket with reference counting
import { useEffect } from "react";
import { useUser } from "../../Context/UserContext";

let socketSingleton = null;
let socketRefCount = 0;
let socketUrlForSingleton = null;

export const useNotifications = () => {
  const { state, dispatch } = useUser();

  useEffect(() => {
    const token = localStorage.getItem("access");

    if (!token) {
      if (socketSingleton) {
        socketSingleton.close();
        socketSingleton = null;
        socketRefCount = 0;
      }
      dispatch({ type: "SET_WS_CONNECTED", payload: false });
      return;
    }

    const wsUrl = "wss://api.gogrub.online/ws/notifications/";

    if (socketSingleton && socketUrlForSingleton === wsUrl) {
      socketRefCount += 1;
      return;
    }

    if (socketSingleton) {
      socketSingleton.close();
      socketSingleton = null;
    }

    const socket = new WebSocket(
  wsUrl,
  ["jwt", token] 
);
    socketSingleton = socket;
    socketUrlForSingleton = wsUrl;
    socketRefCount = 1;

    socket.onopen = () => {
      console.log("✅ WebSocket connected", wsUrl);
      dispatch({ type: "SET_WS_CONNECTED", payload: true });
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        dispatch({ type: "ADD_NOTIFICATION", payload: data });
      } catch (e) {
        console.error("WS parse error", e);
      }
    };

    socket.onerror = (e) => {
      console.error("❌ WebSocket error", e);
    };

    socket.onclose = () => {
      console.warn("⚠️ WebSocket closed");
      socketSingleton = null;
      socketUrlForSingleton = null;
      socketRefCount = 0;
      dispatch({ type: "SET_WS_CONNECTED", payload: false });
    };

    return () => {
      socketRefCount -= 1;
      if (socketRefCount <= 0 && socketSingleton) {
        socketSingleton.close();
        socketSingleton = null;
        socketUrlForSingleton = null;
      }
    };
  }, [state.user, dispatch]);
};
