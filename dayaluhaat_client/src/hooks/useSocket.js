import { useEffect, useState } from "react";
import { initSocket, getSocket, disconnectSocket } from "../services/socketService";

export const useSocket = (token) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // This effect's entire logic depends on the token.
    console.log("USE_SOCKET: [useEffect] - Effect is running. Token:", token ? "PRESENT" : "MISSING");

    // If there is no token, do nothing and ensure we are disconnected.
    if (!token) {
      console.log("USE_SOCKET: [useEffect] - No token provided. Disconnecting any existing socket.");
      disconnectSocket();
      setIsConnected(false);
      return; // Stop the effect here.
    }

    // If we have a token, initialize the socket.
    const socket = initSocket(token);

    // This should not happen if initSocket is working, but it's a good safeguard.
    if (!socket) {
        console.error("USE_SOCKET: [useEffect] - initSocket returned null even with a token.");
        setIsConnected(false);
        return;
    }

    console.log("USE_SOCKET: [useEffect] - Socket instance obtained. Attaching event handlers.");

    // Define event handlers
    const onConnect = () => {
      console.log(`USE_SOCKET: [Socket Event] - 'connect' received! Socket ID: ${socket.id}`);
      setIsConnected(true);
    };

    const onDisconnect = (reason) => {
      console.log("USE_SOCKET: [Socket Event] - 'disconnect' received. Reason:", reason);
      setIsConnected(false);
    };

    const onConnectError = (err) => {
      console.error("USE_SOCKET: [Socket Event] - 'connect_error' received:", err.message);
      setIsConnected(false);
    };

    // Attach listeners
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    
    // If the socket is already connected when this effect runs, update state immediately.
    if (socket.connected) {
        setIsConnected(true);
    }

    // --- Cleanup function for useEffect ---
    // This runs when the token changes or the component unmounts.
    return () => {
      console.log("USE_SOCKET: [useEffect Cleanup] - Cleaning up socket listeners.");
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      // We only disconnect if the token is truly gone, which is handled at the top of the effect.
    };
  }, [token]); // The hook's logic re-runs ONLY when the token changes.

  return { isConnected };
};