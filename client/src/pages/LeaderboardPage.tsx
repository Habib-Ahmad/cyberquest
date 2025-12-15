import { useState, useEffect } from "react";
import { Trophy, Medal, Award, Crown, User } from "lucide-react";
import { useAuth } from "../context/index";
import { leaderboardService } from "../services/index";
import type { LeaderboardEntry } from "../types/index";
import { LoadingSpinner, Alert, Card } from "../components/ui/index";

export default function LeaderboardPage() {
  const { isAuthenticated, user } = useAuth();

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [myRank, setMyRank] = useState<LeaderboardEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      setError("");

      try {
        const data = await leaderboardService.getLeaderboard();
        setLeaderboard(data);

        // Fetch user's rank if authenticated
        if (isAuthenticated) {
          try {
            const rankData = await leaderboardService.getMyRank();
            setMyRank(rankData);
          } catch {
            // User might not have solved any challenges yet
            setMyRank(null);
          }
        }
      } catch {
        setError("Failed to load leaderboard. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [isAuthenticated]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-400" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-300" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return (
          <span className="w-6 h-6 flex items-center justify-center text-gray-400 font-bold">
            {rank}
          </span>
        );
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-900/20 border-yellow-700/50";
      case 2:
        return "bg-gray-800/50 border-gray-600/50";
      case 3:
        return "bg-amber-900/20 border-amber-700/50";
      default:
        return "bg-gray-900/50 border-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <Trophy className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Leaderboard</h1>
        <p className="text-gray-400">Top hackers ranked by score</p>
      </div>

      {error && (
        <Alert variant="danger" onClose={() => setError("")} className="mb-6">
          {error}
        </Alert>
      )}

      {/* User's Rank Card */}
      {isAuthenticated && myRank && (
        <Card className="p-6 mb-8 border-primary-700/50 bg-primary-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary-600/30">
                <User className="h-6 w-6 text-primary-400" />
              </div>
              <div>
                <p className="text-sm text-primary-400 mb-1">Your Ranking</p>
                <p className="text-xl font-bold text-white">#{myRank.rank}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary-400">
                {myRank.score}
              </p>
              <p className="text-sm text-gray-400">
                {myRank.solvedChallenges} solved
              </p>
            </div>
          </div>
        </Card>
      )}

      {isAuthenticated && !myRank && (
        <Alert variant="info" className="mb-6">
          Solve your first challenge to appear on the leaderboard!
        </Alert>
      )}

      {/* Leaderboard Table */}
      {leaderboard.length > 0 ? (
        <Card className="overflow-hidden">
          {/* Table Header */}
          <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-6 py-4 bg-gray-800/50 text-sm font-medium text-gray-400 border-b border-gray-800">
            <div className="col-span-1">Rank</div>
            <div className="col-span-6">Player</div>
            <div className="col-span-3 text-right">Score</div>
            <div className="col-span-2 text-right">Solved</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-800">
            {leaderboard.map((entry) => {
              const isCurrentUser =
                isAuthenticated && user?.username === entry.username;

              return (
                <div
                  key={entry.userId}
                  className={`grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-6 py-4 border-l-4 transition-colors ${
                    isCurrentUser
                      ? "border-l-primary-500 bg-primary-900/10"
                      : `border-l-transparent ${getRankStyle(entry.rank)}`
                  }`}
                >
                  {/* Rank */}
                  <div className="col-span-1 flex items-center">
                    {getRankIcon(entry.rank)}
                  </div>

                  {/* Player */}
                  <div className="col-span-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 font-medium">
                      {entry.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {entry.username}
                        {isCurrentUser && (
                          <span className="ml-2 text-xs text-primary-400">
                            (you)
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500 sm:hidden">
                        {entry.solvedChallenges} challenges solved
                      </p>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="col-span-3 flex items-center justify-end">
                    <span className="text-xl font-bold text-primary-400">
                      {entry.score}
                    </span>
                    <span className="text-gray-500 ml-1 text-sm">pts</span>
                  </div>

                  {/* Solved */}
                  <div className="hidden sm:flex col-span-2 items-center justify-end text-gray-400">
                    {entry.solvedChallenges}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ) : (
        <div className="text-center py-16">
          <Trophy className="h-16 w-16 text-gray-700 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            No rankings yet
          </h3>
          <p className="text-gray-500">
            Be the first to solve a challenge and claim the top spot!
          </p>
        </div>
      )}
    </div>
  );
}
