export interface Clock {
  userId: string;
  date: string;
  inWorking: string;
  interval: string;
  clock: {
    id: string;
    clockType: string;
    time: string;
  }[];
}
