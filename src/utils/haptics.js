export const vibrate = (pattern) => {
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};
export const emergencyVibrate = () => vibrate([200, 100, 200, 100, 400]);
export const tapVibrate = () => vibrate(50);
export const sosVibrate = () => vibrate([500, 200, 500, 200, 500, 200, 1000]);
