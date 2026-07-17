export const logAnalytics = (action) => {
  console.log(`[Analytics] User interacted with Class Waitlist SMS Notification Job (Twilio Mock) - ${action}`);
};

export const logError = (error, context) => {
  console.error(`[Error] ${context || 'Unknown context'}:`, error);
};
