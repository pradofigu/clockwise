export interface PointResponse {
  user_id: string;
  date: string;
  in_working: string;
  interval: string;
  points: {
    id: string;
    point_type: string;
    time: string;
  }[];
}
