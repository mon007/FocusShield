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
}
export type RootStackParamList = {
  Home: undefined;

  Focus: {
    duration: number;
    apps: string[];
  };
};
export interface InstalledApp {
  name: string;
  packageName: string;
  selected?: boolean;
}