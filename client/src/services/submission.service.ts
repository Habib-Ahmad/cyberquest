import api from "./api";
import type { Submission, SubmitFlagResponse } from "../types/index";

export const submissionService = {
  async submitFlag(
    challengeId: string,
    flag: string
  ): Promise<SubmitFlagResponse> {
    const response = await api.post<SubmitFlagResponse>(
      `/challenges/${challengeId}/submit`,
      { flag }
    );
    return response.data;
  },

  async getMySubmissions(): Promise<Submission[]> {
    const response = await api.get<Submission[]>("/submissions");
    return response.data;
  },

  async getMySolvedChallenges(): Promise<Submission[]> {
    const response = await api.get<Submission[]>("/submissions/solved");
    return response.data;
  },
};

export default submissionService;
