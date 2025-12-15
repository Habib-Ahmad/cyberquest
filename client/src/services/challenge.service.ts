import api from "./api";
import type {
  Challenge,
  ChallengeCategory,
  ChallengeDifficulty,
} from "../types/index";

export interface ChallengeQueryParams {
  category?: ChallengeCategory;
  difficulty?: ChallengeDifficulty;
}

export interface CreateChallengePayload {
  title: string;
  description: string;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  points: number;
  flag: string;
  hints?: string[];
  resourceLink?: string;
}

export interface UpdateChallengePayload {
  title: string;
  description: string;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  points: number;
  flag?: string;
  hints?: string[];
  resourceLink?: string;
}

export const challengeService = {
  // Get all challenges (public)
  getAllChallenges(params?: ChallengeQueryParams) {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append("category", params.category);
    if (params?.difficulty) queryParams.append("difficulty", params.difficulty);

    const queryString = queryParams.toString();
    const url = queryString ? `/challenges?${queryString}` : "/challenges";

    return api.get<Challenge[]>(url);
  },

  // Get single challenge by ID (public)
  getChallengeById(id: string) {
    return api.get<Challenge>(`/challenges/${id}`);
  },

  // Create new challenge (admin only)
  createChallenge(payload: CreateChallengePayload) {
    return api.post<Challenge>("/challenges", payload);
  },

  // Update existing challenge (admin only)
  updateChallenge(id: string, payload: UpdateChallengePayload) {
    return api.put<Challenge>(`/challenges/${id}`, payload);
  },

  // Delete challenge (admin only)
  deleteChallenge(id: string) {
    return api.delete(`/challenges/${id}`);
  },

  // Legacy methods for backward compatibility
  async getAll(params?: ChallengeQueryParams): Promise<Challenge[]> {
    const response = await this.getAllChallenges(params);
    return response.data;
  },

  async getById(id: string): Promise<Challenge> {
    const response = await this.getChallengeById(id);
    return response.data;
  },
};

export default challengeService;
