import { io } from "socket.io-client";

let socketInstance = null; // Stays null until explicitly created
const MAX_RECONNECTION_ATTEMPTS = 5; // Example max attempts

/**
 * Initializes the socket connection or returns the existing instance if valid.
 * This function ensures a single, authenticated socket instance is maintained.
 * @param {string} token - The user's authentication token.
 * @returns {import("socket.io-client").Socket | null} The socket instance or null if token is missing.
 */
export const initSocket = (token) => {
    console.log("SOCKET_SERVICE: [initSocket Call] - START. Token status:", token ? "PRESENT" : "MISSING", "Current socketInstance ON ENTRY:", socketInstance ? "EXISTS" : "NULL", "Connected:", socketInstance?.connected);

    if (!token) {
        console.error("SOCKET_SERVICE: [initSocket Call] - Error: Token is required. Returning null.");
        // DO NOT disconnect or set socketInstance to null here. Let disconnectSocket handle it.
        return null;
    }

    // --- Core Logic: Reuse existing, or create new ---
    if (socketInstance) {
        // If it exists, but the token changed or it's not connected, try to reconnect it with the new token
        // This is where we ensure the existing instance is updated/reconnected
        if (socketInstance.auth?.token !== token || !socketInstance.connected) {
            console.log("SOCKET_SERVICE: [initSocket Call] - Existing socket found (connected:", socketInstance.connected, ", token match:", socketInstance.auth?.token === token, "). Reconnecting/updating auth.");
            // Update auth token for existing instance
            socketInstance.auth.token = token;
            if (!socketInstance.connected) {
                // If not connected, explicitly connect it
                console.log("SOCKET_SERVICE: [initSocket Call] - Existing socket disconnected, attempting to connect.");
                socketInstance.connect();
            }
        } else {
            console.log("SOCKET_SERVICE: [initSocket Call] - Reusing existing, connected socket for same token.");
        }
    } else {
        // No existing socket, create a brand new one
        console.log("SOCKET_SERVICE: [initSocket Call] - Creating NEW socket.io-client instance.");
        socketInstance = io("http://localhost:5050", { // <<< VERIFY THIS URL
            auth: { token },
            reconnectionAttempts: MAX_RECONNECTION_ATTEMPTS,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000,
            autoConnect: true // Ensure it tries to connect automatically
        });

        // --- Attach Core Socket Event Listeners (only once when instance is created) ---
        socketInstance.on("connect", () => {
            console.log("SOCKET_SERVICE: [Socket Event] - 'connect' event! Socket ID:", socketInstance.id, "Authenticated:", socketInstance.auth?.token ? "YES" : "NO");
        });
        socketInstance.on("disconnect", (reason) => {
            console.log("SOCKET_SERVICE: [Socket Event] - 'disconnect' event! Reason:", reason);
        });
        socketInstance.on("connect_error", (err) => {
            console.error("SOCKET_SERVICE: [Socket Event] - 'connect_error' event! Error:", err.message, "Description:", err.description);
        });
        socketInstance.on("reconnect_attempt", (attemptNumber) => {
            console.log(`SOCKET_SERVICE: [Socket Event] - 'reconnect_attempt' - Attempt ${attemptNumber}`);
        });
        socketInstance.on("reconnect", (attemptNumber) => {
            console.log(`SOCKET_SERVICE: [Socket Event] - 'reconnect' event! Successfully reconnected after ${attemptNumber} attempts.`);
        });
        socketInstance.on("reconnect_error", (err) => {
            console.error("SOCKET_SERVICE: [Socket Event] - 'reconnect_error' event! Error:", err.message);
        });
        socketInstance.on("reconnect_failed", () => {
            console.error("SOCKET_SERVICE: [Socket Event] - 'reconnect_failed' event! Max reconnect attempts reached. Socket will not try to connect again.");
        });
        socketInstance.on("error", (err) => {
            console.error("SOCKET_SERVICE: [Socket Event] - 'error' event!:", err);
        });
    }

    console.log("SOCKET_SERVICE: [initSocket Call] - END. Returning socketInstance. Connected state:", socketInstance.connected, "socketInstance ON EXIT:", socketInstance ? "EXISTS" : "NULL");
    return socketInstance;
};

/**
 * Safely returns the current socket instance.
 */
export const getSocket = () => {
    console.log("SOCKET_SERVICE: [getSocket Call] - Retrieving socketInstance. Current state:", socketInstance ? "EXISTS" : "NULL", "Connected:", socketInstance?.connected);
    return socketInstance;
};

/**
 * Explicitly disconnects the socket and clears the instance.
 * Use this only for explicit user logout.
 */
export const disconnectSocket = () => {
    console.log("SOCKET_SERVICE: [disconnectSocket Call] - Explicit disconnect requested.");
    if (socketInstance) {
        console.log("SOCKET_SERVICE: [disconnectSocket Call] - Disconnecting and clearing socketInstance.");
        socketInstance.disconnect();
        socketInstance = null; // ONLY PLACE IT BECOMES NULL
    } else {
        console.log("SOCKET_SERVICE: [disconnectSocket Call] - No socketInstance to disconnect.");
    }
};