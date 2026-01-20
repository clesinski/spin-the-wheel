export interface WheelItem {
  id: string;
  label: string;
}

export interface Theme {
  name: string;
  colors: string[];
  textColor: string;
  accentColor: string;
  backgroundColor: string;
  buttonTextColor: string;
}

export type AppState = 'setup' | 'spinning' | 'result';

export interface WheelState {
  items: WheelItem[];
  rotation: number;
  appState: AppState;
  winner: WheelItem | null;
}
