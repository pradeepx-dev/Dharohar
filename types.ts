export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  githubLink: string;
  liveDemoLink?: string;
  techStack: string[];
  category: string;
  userId: string;
  authorName: string;
  createdAt: number;
  likes: number;
  likedBy: string[];
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export enum ProjectCategory {
  Web = "Web Development",
  Mobile = "Mobile App",
  AI = "AI & ML",
  DataScience = "Data Science",
  Blockchain = "Blockchain",
  Web3 = "Web3",
  Game = "Game Development",
  Other = "Other"
}