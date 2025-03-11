
export interface GitHubUserData {
  date: string;
  user: GitHubUser[];
  user_public: GitHubUser[];
  user_private: GitHubUser[];
  orgs: any[]; // We're ignoring this as per requirements
}

export interface GitHubUser {
  rank: number;
  name: string;
  login: string;
  avatar: string;
  url: string;
}

export interface UserProfile {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  location: string | null;
  followers: number;
  total_stars: number;
  rank: number;
}

export type TabType = 'user' | 'user_public' | 'user_private';

export interface TabOption {
  id: TabType;
  label: string;
}
