import api from "./api";
import type { LeaderboardEntry } from "../types/index";

export const leaderboardService = {
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const response = await api.get<LeaderboardEntry[]>("/leaderboard");
    return response.data;
  },

  async getMyRank(): Promise<LeaderboardEntry> {
    const response = await api.get<LeaderboardEntry>("/leaderboard/me");
    return response.data;
  },
};

export default leaderboardService;
