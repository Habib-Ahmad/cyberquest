import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  Clock,
  CheckCircle,
  XCircle,
  Flag,
  Calendar,
  Filter,
} from "lucide-react";
import { submissionService } from "../services/index";
import type { Submission } from "../types/index";
import {
  LoadingSpinner,
  Alert,
  Card,
  Badge,
  Select,
} from "../components/ui/index";

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "correct" | "incorrect">("all");

  useEffect(() => {
    const fetchSubmissions = async () => {
      setIsLoading(true);
      setError("");

      try {
        const data = await submissionService.getMySubmissions();
        // Sort by submission time, newest first
        const sorted = data.sort(
          (a: Submission, b: Submission) =>
            new Date(b.submissionTime).getTime() -
            new Date(a.submissionTime).getTime()
        );
        setSubmissions(sorted);
      } catch {
        setError("Failed to load submissions. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  // Filter submissions
  const filteredSubmissions = submissions.filter((s) => {
    if (filter === "correct") return s.correct;
    if (filter === "incorrect") return !s.correct;
    return true;
  });

  // Stats
  const totalSubmissions = submissions.length;
  const correctSubmissions = submissions.filter((s) => s.correct).length;
  const incorrectSubmissions = totalSubmissions - correctSubmissions;
  const successRate =
    totalSubmissions > 0
      ? Math.round((correctSubmissions / totalSubmissions) * 100)
      : 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Submissions</h1>
        <p className="text-gray-400">Track all your flag submission attempts</p>
      </div>

      {error && (
        <Alert variant="danger" onClose={() => setError("")} className="mb-6">
          {error}
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 text-center">
          <Clock className="h-6 w-6 text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{totalSubmissions}</p>
          <p className="text-sm text-gray-400">Total Attempts</p>
        </Card>

        <Card className="p-4 text-center">
          <CheckCircle className="h-6 w-6 text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{correctSubmissions}</p>
          <p className="text-sm text-gray-400">Correct</p>
        </Card>

        <Card className="p-4 text-center">
          <XCircle className="h-6 w-6 text-red-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">
            {incorrectSubmissions}
          </p>
          <p className="text-sm text-gray-400">Incorrect</p>
        </Card>

        <Card className="p-4 text-center">
          <Flag className="h-6 w-6 text-primary-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{successRate}%</p>
          <p className="text-sm text-gray-400">Success Rate</p>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4 mb-6">
        <Filter className="h-5 w-5 text-gray-400" />
        <Select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value as "all" | "correct" | "incorrect")
          }
          options={[
            { value: "all", label: "All Submissions" },
            { value: "correct", label: "Correct Only" },
            { value: "incorrect", label: "Incorrect Only" },
          ]}
          className="w-48"
        />
        <span className="text-sm text-gray-400">
          Showing {filteredSubmissions.length} submissions
        </span>
      </div>

      {/* Submissions List */}
      {filteredSubmissions.length > 0 ? (
        <Card className="divide-y divide-gray-800">
          {filteredSubmissions.map((submission) => {
            const { date, time } = formatDate(submission.submissionTime);

            return (
              <Link
                key={submission.id}
                to={`/challenges/${submission.challengeId}`}
                className="flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  {/* Status Icon */}
                  <div
                    className={`p-2 rounded-lg ${
                      submission.correct
                        ? "bg-green-600/20 text-green-400"
                        : "bg-red-600/20 text-red-400"
                    }`}
                  >
                    {submission.correct ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <XCircle className="h-5 w-5" />
                    )}
                  </div>

                  {/* Challenge Info */}
                  <div>
                    <p className="font-medium text-white group-hover:text-primary-400 transition-colors">
                      {submission.challengeTitle}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {time}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Result */}
                <div className="flex items-center gap-3">
                  {submission.correct ? (
                    <Badge variant="success">
                      +{submission.pointsAwarded} pts
                    </Badge>
                  ) : (
                    <Badge variant="danger">Incorrect</Badge>
                  )}
                </div>
              </Link>
            );
          })}
        </Card>
      ) : (
        <Card className="p-12 text-center">
          <Flag className="h-16 w-16 text-gray-700 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            No submissions yet
          </h3>
          <p className="text-gray-500 mb-4">
            Start solving challenges to see your submission history
          </p>
          <Link
            to="/challenges"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
          >
            <Flag className="h-4 w-4" />
            Browse Challenges
          </Link>
        </Card>
      )}
    </div>
  );
}
