// Add your reels here. `video` can be a video URL; leave empty to show a placeholder.
export type Reel = { title: string; category: string; video?: string };

export const reels: Reel[] = [
  { title: "Café Diaries", category: "Lifestyle" },
  { title: "Street Frames", category: "Travel" },
  { title: "Morning Routine", category: "Vlog" },
  { title: "Phone Cinematics", category: "Tutorial" },
  { title: "City Lights", category: "B-Roll" },
  { title: "Behind the Reel", category: "BTS" },
];
