import {NativeModules} from 'react-native';

const {FocusBlocker} = NativeModules;

export default {
  getDeviceName(): Promise<string> {
    return FocusBlocker.getDeviceName();
  },
  getInstalledApps() {
  return FocusBlocker.getInstalledApps();
},
saveBlockedApps(
  apps: string[],
) {
  return FocusBlocker.saveBlockedApps(
    apps,
  );
},
saveSessionEndTime(
  endTime: number,
) {
  return FocusBlocker
    .saveSessionEndTime(
      endTime,
    );
},
clearFocusSession() {
  return FocusBlocker.clearFocusSession();
},

startForegroundService() {
  return FocusBlocker
    .startForegroundService();
},

stopForegroundService() {
  return FocusBlocker
    .stopForegroundService();
},
saveBlockedAppNames(
  names: string,
) {
  return FocusBlocker
    .saveBlockedAppNames(
      names,
    );
},
isAccessibilityEnabled() {
  return FocusBlocker
    .isAccessibilityEnabled();
},

openAccessibilitySettings() {
  return FocusBlocker
    .openAccessibilitySettings();
},
};