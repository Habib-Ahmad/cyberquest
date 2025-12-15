import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  Trophy,
  Flag,
  CheckCircle,
  Calendar,
  Shield,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../context/index";
import {
  leaderboardService,
  submissionService,
  challengeService,
} from "../services/index";
import type { LeaderboardEntry, Submission } from "../types/index";
import {
  LoadingSpinner,
  Alert,
  Card,
  Badge,
  Button,
} from "../components/ui/index";

export default function ProfilePage() {
  const { user } = useAuth();

  const [myRank, setMyRank] = useState<LeaderboardEntry | null>(null);
  const [solvedChallenges, setSolvedChallenges] = useState<Submission[]>([]);
  const [totalChallenges, setTotalChallenges] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      setError("");

      try {
        const [challenges, solved] = await Promise.all([
          challengeService.getAll(),
          submissionService.getMySolvedChallenges().catch(() => []),
        ]);

        setTotalChallenges(challenges.length);
        setSolvedChallenges(solved);

        // Get rank
        try {
          const rank = await leaderboardService.getMyRank();
          setMyRank(rank);
        } catch {
          setMyRank(null);
        }
      } catch {
        setError("Failed to load profile data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Calculate stats
  const totalPoints = solvedChallenges.reduce(
    (sum, s) => sum + s.pointsAwarded,
    0
  );
  const solvedCount = solvedChallenges.length;
  const completionRate =
    totalChallenges > 0 ? Math.round((solvedCount / totalChallenges) * 100) : 0;

  // Get recent solves (last 5)
  const recentSolves = [...solvedChallenges]
    .sort(
      (a, b) =>
        new Date(b.submissionTime).getTime() -
        new Date(a.submissionTime).getTime()
    )
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {error && (
        <Alert variant="danger" onClose={() => setError("")} className="mb-6">
          {error}
        </Alert>
      )}

      {/* Profile Header */}
      <Card className="p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-4xl font-bold text-white shadow-lg shadow-primary-600/25">
            {user?.username.charAt(0).toUpperCase()}
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-white mb-2">
              {user?.username}
            </h1>
            <p className="text-gray-400 mb-4">{user?.email}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              {user?.roles.map((role) => (
                <Badge
                  key={role}
                  variant={role === "ROLE_ADMIN" ? "warning" : "info"}
                >
                  <Shield className="h-3 w-3 mr-1" />
                  {role.replace("ROLE_", "")}
                </Badge>
              ))}
              {myRank && (
                <Badge variant="success">
                  <Trophy className="h-3 w-3 mr-1" />
                  Rank #{myRank.rank}
                </Badge>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="text-center md:text-right">
            <p className="text-4xl font-bold text-primary-400">{totalPoints}</p>
            <p className="text-gray-400">Total Points</p>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 text-center">
          <Flag className="h-8 w-8 text-primary-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{solvedCount}</p>
          <p className="text-sm text-gray-400">Challenges Solved</p>
        </Card>

        <Card className="p-4 text-center">
          <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{totalPoints}</p>
          <p className="text-sm text-gray-400">Points Earned</p>
        </Card>

        <Card className="p-4 text-center">
          <TrendingUp className="h-8 w-8 text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{myRank?.rank || "-"}</p>
          <p className="text-sm text-gray-400">Global Rank</p>
        </Card>

        <Card className="p-4 text-center">
          <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{completionRate}%</p>
          <p className="text-sm text-gray-400">Completion Rate</p>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-white">Challenge Progress</h3>
          <span className="text-sm text-gray-400">
            {solvedCount} / {totalChallenges} completed
          </span>
        </div>
        <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-600 to-primary-400 transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </Card>

      {/* Recent Solves */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">Recent Solves</h3>
          <Link to="/submissions">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </div>

        {recentSolves.length > 0 ? (
          <div className="space-y-3">
            {recentSolves.map((solve) => (
              <Link
                key={solve.id}
                to={`/challenges/${solve.challengeId}`}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary-600/20 text-primary-400 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-white group-hover:text-primary-400 transition-colors">
                      {solve.challengeTitle}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {new Date(solve.submissionTime).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <Badge variant="success">+{solve.pointsAwarded} pts</Badge>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Flag className="h-12 w-12 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-400">No challenges solved yet</p>
            <Link to="/challenges">
              <Button variant="primary" size="sm" className="mt-3">
                Start Hacking
              </Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
