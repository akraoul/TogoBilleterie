export const sendSMS = async (to: string, message: string) => {
    // In a real application, integration with Twilio, Mobitech, or local providers would happen here.
    // For now, we simulate sending SMS by logging to the console.
    console.log(`[SMS SIMULATION] To: ${to}`);
    console.log(`[SMS CONTENT]: ${message}`);
    return Promise.resolve(true);
};
