export interface ScanFeedback {
  type: 'valid' | 'invalid';
  code: string;
}

export interface RecentScanItem {
  id: number | string;
  data: string;
  time: string;
  type: string;
  vehicle: string;
}
