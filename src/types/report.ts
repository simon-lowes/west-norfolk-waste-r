// Report type - represents an issue report submitted by a user

export enum ReportType {
  MISSED_COLLECTION = 'missedCollection',
  DAMAGED_BIN = 'damagedBin',
  FLY_TIPPING = 'flyTipping',
  OTHER = 'other',
}

export interface Report {
  id: string;
  type: ReportType;
  description: string;
  address: string;
  postcode: string;
  photoUri?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  createdAt: string; // ISO 8601 date string
}

// Helper to get report type display name
export function getReportTypeName(type: ReportType): string {
  switch (type) {
    case ReportType.MISSED_COLLECTION:
      return 'Missed Collection';
    case ReportType.DAMAGED_BIN:
      return 'Damaged Bin';
    case ReportType.FLY_TIPPING:
      return 'Fly Tipping';
    case ReportType.OTHER:
      return 'Other Issue';
  }
}
