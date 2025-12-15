// User types
export interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

// Challenge types
export type ChallengeCategory =
  | "CRYPTOLOGY"
  | "CRYPTO"
  | "WEB"
  | "FORENSIC"
  | "FORENSICS"
  | "NETWORK"
  | "REVERSE"
  | "PWN"
  | "MISC";
export type ChallengeDifficulty = "EASY" | "MEDIUM" | "HARD";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  points: number;
  attachmentUrl?: string | null;
  hints?: string[];
  resourceLink?: string;
  solveCount?: number;
  solved?: boolean;
}

export interface ChallengeFilters {
  category?: ChallengeCategory;
  difficulty?: ChallengeDifficulty;
  search?: string;
  solvedOnly?: boolean;
  unsolvedOnly?: boolean;
}

// Submission types
export interface Submission {
  id: string;
  challengeId: string;
  challengeTitle: string;
  correct: boolean;
  pointsAwarded: number;
  submissionTime: string;
}

export interface SubmitFlagRequest {
  flag: string;
}

export interface SubmitFlagResponse {
  id: string;
  challengeId: string;
  challengeTitle: string;
  correct: boolean;
  pointsAwarded: number;
  submissionTime: string;
}

// Leaderboard types
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  score: number;
  totalPoints: number;
  solvedChallenges: number;
}

// API Error type
export interface ApiError {
  message: string;
  status: number;
}
