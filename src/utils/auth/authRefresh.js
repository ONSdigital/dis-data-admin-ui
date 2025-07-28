import SessionManagement from "dis-authorisation-client-js";

/**
 * Initialises session management library to handle passive auth refreshing 
 */
const initAuthRefresh = async () => {
    const refreshConfig = {
        timeOffsets: { passiveRenewal: 300000 }, // Session renewal offset: 5 minutes
        onRenewFailure: (error) => {
            console.error("[APP] Session renewal failed:", error);
            logout();
        },
        onError: (error) => {
            console.error("[APP] Error:", error);
            logout();
        },
    };

    // Initialise the SessionManagement library
    SessionManagement.init(refreshConfig);

    // Set the expiry timer using defaults from cookie
    SessionManagement.setSessionExpiryTime();
}

export { initAuthRefresh };