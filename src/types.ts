export interface Session {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  mode: string;
  privacy: "private" | "public";
  course?: string | { courseCode: string; title: string };
  tags?: string[];
  isRequested?: boolean;
  creatorId?: string;
}
