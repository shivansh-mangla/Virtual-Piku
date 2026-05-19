export type Announcement = {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success";
  date: string;
};

export const announcements: Announcement[] = [
  {
    id: "1",
    title: "New Feature Added",
    message: "Track your daily water intake with the updated Water module.",
    type: "success",
    date: "May 19",
  },
  {
    id: "2",
    title: "Maintenance Notice",
    message: "Scheduled downtime on May 21 from 11 PM to 1 AM.",
    type: "warning",
    date: "May 20",
  },
  {
    id: "3",
    title: "Fitness Challenge",
    message: "Join this week's step challenge and win rewards!",
    type: "info",
    date: "May 18",
  },
];
