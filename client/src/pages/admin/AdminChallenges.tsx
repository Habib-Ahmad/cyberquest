import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router";
import { Plus, Edit, Trash2, Target, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Alert from "../../components/ui/Alert";
import Badge from "../../components/ui/Badge";
import { challengeService } from "../../services/challenge.service";
import { useTheme } from "../../context/index";
import type { Challenge, ChallengeDifficulty } from "../../types";

const DIFFICULTY_OPTIONS = [
  { value: "", label: "All Difficulties" },
  { value: "EASY", label: "Easy" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HARD", label: "Hard" },
];

const CATEGORY_OPTIONS = [
  { value: "", label: "All Categories" },
  { value: "WEB", label: "Web" },
  { value: "CRYPTO", label: "Crypto" },
  { value: "FORENSICS", label: "Forensics" },
  { value: "REVERSE", label: "Reverse Engineering" },
  { value: "PWN", label: "Pwn" },
  { value: "MISC", label: "Misc" },
];

export default function AdminChallenges() {
  const { isDark } = useTheme();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [filteredChallenges, setFilteredChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Challenge | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetchChallenges();
  }, []);

  const filterChallenges = useCallback(() => {
    let filtered = [...challenges];

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(searchLower) ||
          c.description.toLowerCase().includes(searchLower)
      );
    }

    if (difficulty) {
      filtered = filtered.filter((c) => c.difficulty === difficulty);
    }

    if (category) {
      filtered = filtered.filter((c) => c.category === category);
    }

    setFilteredChallenges(filtered);
  }, [challenges, search, difficulty, category]);

  useEffect(() => {
    filterChallenges();
  }, [filterChallenges]);

  const fetchChallenges = async () => {
    try {
      setError(null);
      const challenges = await challengeService.getAll();
      setChallenges(challenges);
    } catch (err) {
      setError("Failed to load challenges");
      console.error("Error fetching challenges:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await challengeService.deleteChallenge(deleteTarget.id);
      setChallenges((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setError("Failed to delete challenge");
      console.error("Error deleting challenge:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const getDifficultyBadgeVariant = (
    diff: ChallengeDifficulty
  ): "success" | "warning" | "danger" => {
    switch (diff) {
      case "EASY":
        return "success";
      case "MEDIUM":
        return "warning";
      case "HARD":
        return "danger";
      default:
        return "success";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className={`text-2xl font-bold flex items-center gap-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            <Target className="h-6 w-6 text-primary-500" />
            Manage Challenges
          </h1>
          <p className={isDark ? "text-gray-400 mt-1" : "text-gray-600 mt-1"}>
            Create, edit, and manage CTF challenges
          </p>
        </div>
        <Link to="/admin/challenges/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Challenge
          </Button>
        </Link>
      </div>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search challenges..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select
              options={DIFFICULTY_OPTIONS}
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            />
            <Select
              options={CATEGORY_OPTIONS}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Challenges Table */}
      <Card>
        <CardContent className="p-0">
          {filteredChallenges.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    className={`border-b ${
                      isDark
                        ? "border-gray-800 bg-gray-800/50"
                        : "border-gray-200 bg-gray-50"
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
                    <th
                      className={`text-left py-3 px-4 text-sm font-medium ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Solves
                    </th>
                    <th
                      className={`text-right py-3 px-4 text-sm font-medium ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredChallenges.map((challenge) => (
                    <tr
                      key={challenge.id}
                      className={`border-b ${
                        isDark
                          ? "border-gray-800 hover:bg-gray-800/50"
                          : "border-gray-200 hover:bg-gray-50"
                      } transition-colors`}
                    >
                      <td className="py-3 px-4">
                        <Link
                          to={`/challenges/${challenge.id}`}
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
                        <Badge
                          variant={getDifficultyBadgeVariant(
                            challenge.difficulty
                          )}
                        >
                          {challenge.difficulty}
                        </Badge>
                      </td>
                      <td
                        className={`py-3 px-4 font-medium ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {challenge.points}
                      </td>
                      <td
                        className={`py-3 px-4 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {challenge.solveCount ?? 0}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/admin/challenges/${challenge.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteTarget(challenge)}
                            className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <Target
                className={`h-12 w-12 mx-auto mb-4 ${
                  isDark ? "text-gray-600" : "text-gray-400"
                }`}
              />
              <h3
                className={`text-lg font-medium mb-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                No challenges found
              </h3>
              <p className={isDark ? "text-gray-400" : "text-gray-500"}>
                {challenges.length === 0
                  ? "Create your first challenge to get started."
                  : "Try adjusting your filters."}
              </p>
              {challenges.length === 0 && (
                <Link to="/admin/challenges/new" className="inline-block mt-4">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Challenge
                  </Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <Card className="max-w-md w-full">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-full bg-red-500/20">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <h3
                    className={`text-lg font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Delete Challenge
                  </h3>
                  <p className={isDark ? "text-gray-400" : "text-gray-500"}>
                    This action cannot be undone.
                  </p>
                </div>
              </div>
              <p
                className={`mb-6 ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                Are you sure you want to delete{" "}
                <span className="font-semibold">"{deleteTarget.title}"</span>?
                All associated data will be permanently removed.
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="ghost"
                  onClick={() => setDeleteTarget(null)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  isLoading={isDeleting}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
