export type LocationData = {
  total_distance_km: number;
  time_by_place_hours: Record<string, number>;
};

export type AnalyticsEntry = {
  date: string;
  time: number;
};

export type Analytics = Record<string, AnalyticsEntry[]>;
