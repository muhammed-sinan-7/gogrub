// import { useEffect, useRef } from "react";
// import { useUser } from "../../Context/UserContext";

// export const cations = () => {
//   const { state, dispatch } = useUser();
//   const socketRef = useRef(null);

//   useEffect(() => {
//     // 🔒 Wait until auth is fully ready
//     if (!state.authLoaded || !state.user) {
//       return;
//     }

//     // 🛑 Prevent duplicate connections
//     if (socketRef.current) {
//       return;
//     }

//     const token = localStorage.getItem("access");
//     if (!token) return;

//     const wsUrl = "wss://api.gogrub.online/ws/notifications/";

//     const socket = new WebSocket(wsUrl, ["jwt", token]);
//     socketRef.current = socket;

//     socket.onopen = () => {
//       console.log("✅ WebSocket connected");
//       dispatch({ type: "_CONNECTED", payload: true });
//     };

//     socket.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         dispatch({ type: "CATION", payload: data });
//       } catch (e) {
//         console.error("WS parse error", e);
//       }
//     };

//     socket.onerror = (e) => {
//       console.error("❌ WebSocket error", e);
//     };

//     socket.onclose = () => {
//       console.warn("⚠️ WebSocket closed");
//       socketRef.current = null;
//       dispatch({ type: "_CONNECTED", payload: false });
//     };

//     // 🧹 Cleanup ONLY on logout / unmount
//     return () => {
//       if (socketRef.current) {
//         socketRef.current.close();
//         socketRef.current = null;
//       }
//     };
//   }, [state.authLoaded, state.user?.id]); 
// };
