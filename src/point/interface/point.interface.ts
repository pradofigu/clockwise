export interface PointResponse {
  userId: string;
  date: string;
  inWorking: string;
  interval: string;
  points: {
    id: string;
    pointType: string;
    time: string;
  }[];
}
