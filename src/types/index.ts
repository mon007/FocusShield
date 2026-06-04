export interface BlockedApp {
  id: string;
  name: string;
  packageName: string;
  selected: boolean;
}

export interface FocusSession {
  active: boolean;
  duration: number;
  endTime: number;

  apps: string[];
  appNames: string[];
}
export type RootStackParamList = {
  Home: undefined;

  Focus: undefined;
};
export interface InstalledApp {
  name: string;
  packageName: string;
  selected?: boolean;
}