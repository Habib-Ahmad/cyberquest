import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  Shield,
  Target,
  Users,
  Trophy,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { challengeService } from "../../services/challenge.service";
import { leaderboardService } from "../../services/leaderboard.service";
import { useTheme } from "../../context/index";
import type { Challenge, LeaderboardEntry } from "../../types";

interface DashboardStats {
  totalChallenges: number;
  totalUsers: number;
  totalSolves: number;
  recentChallenges: Challenge[];
  topPlayers: LeaderboardEntry[];
}

export default function AdminDashboard() {
  const { isDark } = useTheme();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [challenges, leaderboard] = await Promise.all([
          challengeService.getAll(),
          leaderboardService.getLeaderboard(),
        ]);

        // Calculate stats
        const totalSolves = leaderboard.reduce(
          (acc: number, entry: LeaderboardEntry) =>
            acc + entry.solvedChallenges,
          0
        );

        setStats({
          totalChallenges: challenges.length,
          totalUsers: leaderboard.length,
          totalSolves,
          recentChallenges: challenges.slice(-5).reverse(),
          topPlayers: leaderboard.slice(0, 5),
        });
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Challenges",
      value: stats?.totalChallenges || 0,
      icon: Target,
      color: "text-primary-500",
      bgColor: isDark ? "bg-primary-900/30" : "bg-primary-100",
    },
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-blue-500",
      bgColor: isDark ? "bg-blue-900/30" : "bg-blue-100",
    },
    {
      title: "Total Solves",
      value: stats?.totalSolves || 0,
      icon: Trophy,
      color: "text-yellow-500",
      bgColor: isDark ? "bg-yellow-900/30" : "bg-yellow-100",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className={`text-3xl font-bold flex items-center gap-3 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            <Shield className="h-8 w-8 text-yellow-500" />
            Admin Dashboard
          </h1>
          <p className={isDark ? "text-gray-400 mt-1" : "text-gray-600 mt-1"}>
            Manage your CTF platform
          </p>
        </div>
        <Link to="/admin/challenges/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Challenge
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map(({ title, value, icon: Icon, color, bgColor }) => (
          <Card key={title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm font-medium ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {title}
                  </p>
                  <p
                    className={`text-3xl font-bold mt-1 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${bgColor}`}>
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary-500" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link
                to="/admin/challenges"
                className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                  isDark
                    ? "bg-gray-800/50 hover:bg-gray-800"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-primary-500" />
                  <span className={isDark ? "text-white" : "text-gray-900"}>
                    Manage Challenges
                  </span>
                </div>
                <ArrowRight
                  className={`h-4 w-4 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                />
              </Link>
              <Link
                to="/admin/challenges/new"
                className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                  isDark
                    ? "bg-gray-800/50 hover:bg-gray-800"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Plus className="h-5 w-5 text-green-500" />
                  <span className={isDark ? "text-white" : "text-gray-900"}>
                    Create New Challenge
                  </span>
                </div>
                <ArrowRight
                  className={`h-4 w-4 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                />
              </Link>
              <Link
                to="/leaderboard"
                className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                  isDark
                    ? "bg-gray-800/50 hover:bg-gray-800"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span className={isDark ? "text-white" : "text-gray-900"}>
                    View Leaderboard
                  </span>
                </div>
                <ArrowRight
                  className={`h-4 w-4 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Top Players */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Top Players
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.topPlayers && stats.topPlayers.length > 0 ? (
              <div className="space-y-3">
                {stats.topPlayers.map((player, index) => (
                  <div
                    key={player.username}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      isDark ? "bg-gray-800/50" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0
                            ? "bg-yellow-500 text-black"
                            : index === 1
                            ? "bg-gray-400 text-black"
                            : index === 2
                            ? "bg-amber-700 text-white"
                            : isDark
                            ? "bg-gray-700 text-gray-300"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span className={isDark ? "text-white" : "text-gray-900"}>
                        {player.username}
                      </span>
                    </div>
                    <span className="text-primary-500 font-semibold">
                      {player.score} pts
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className={isDark ? "text-gray-400" : "text-gray-500"}>
                No players yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Challenges */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            Recent Challenges
          </CardTitle>
          <Link to="/admin/challenges">
            <Button variant="ghost" size="sm">
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {stats?.recentChallenges && stats.recentChallenges.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    className={`border-b ${
                      isDark ? "border-gray-800" : "border-gray-200"
                    }`}
                  >
                    <th
                      className={`text-left py-3 px-4 text-sm font-medium ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Title
                    </th>
                    <th
                      className={`text-left py-3 px-4 text-sm font-medium ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Category
                    </th>
                    <th
                      className={`text-left py-3 px-4 text-sm font-medium ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Difficulty
                    </th>
                    <th
                      className={`text-left py-3 px-4 text-sm font-medium ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Points
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentChallenges.map((challenge) => (
                    <tr
                      key={challenge.id}
                      className={`border-b ${
                        isDark ? "border-gray-800" : "border-gray-200"
                      }`}
                    >
                      <td className="py-3 px-4">
                        <Link
                          to={`/admin/challenges/${challenge.id}/edit`}
                          className="text-primary-500 hover:text-primary-400 font-medium"
                        >
                          {challenge.title}
                        </Link>
                      </td>
                      <td
                        className={`py-3 px-4 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {challenge.category}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            challenge.difficulty === "EASY"
                              ? "bg-green-500/20 text-green-400"
                              : challenge.difficulty === "MEDIUM"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {challenge.difficulty}
                        </span>
                      </td>
                      <td
                        className={`py-3 px-4 font-medium ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {challenge.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className={isDark ? "text-gray-400" : "text-gray-500"}>
              No challenges created yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
