import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
  ArrowLeft,
  Lock,
  Globe,
  Server,
  Search,
  Shuffle,
  Shield,
  Download,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../context/index";
import { challengeService, submissionService } from "../services/index";
import type { Challenge, ChallengeCategory, Submission } from "../types/index";
import {
  Button,
  Badge,
  LoadingSpinner,
  Alert,
  Card,
} from "../components/ui/index";
import { FlagSubmissionForm } from "../components/challenges/index";
import { AxiosError } from "axios";

const categoryIcons: Record<ChallengeCategory, React.ElementType> = {
  CRYPTOLOGY: Lock,
  CRYPTO: Lock,
  WEB: Globe,
  FORENSIC: Search,
  FORENSICS: Search,
  NETWORK: Server,
  REVERSE: Shuffle,
  PWN: Shield,
  MISC: Shuffle,
};

const difficultyColors = {
  EASY: "success" as const,
  MEDIUM: "warning" as const,
  HARD: "danger" as const,
};

export default function ChallengeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [alreadySolved, setAlreadySolved] = useState(false);

  // Fetch challenge data
  useEffect(() => {
    const fetchChallenge = async () => {
      if (!id) return;

      setIsLoading(true);
      setError("");

      try {
        const data = await challengeService.getById(id);
        setChallenge(data);

        // Check if user already solved this challenge
        if (isAuthenticated) {
          try {
            const solvedChallenges =
              await submissionService.getMySolvedChallenges();
            setAlreadySolved(
              solvedChallenges.some((s: Submission) => s.challengeId === id)
            );
          } catch {
            // User might not have any submissions
          }
        }
      } catch (err) {
        if (err instanceof AxiosError && err.response?.status === 404) {
          setError("Challenge not found.");
        } else {
          setError("Failed to load challenge. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallenge();
  }, [id, isAuthenticated]);

  const handleFlagSubmit = async (flag: string) => {
    if (!id) return;

    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const result = await submissionService.submitFlag(id, flag);

      if (result.correct) {
        setSubmitResult({
          success: true,
          message: `Correct! You earned ${result.pointsAwarded} points!`,
        });
        setAlreadySolved(true);
      } else {
        setSubmitResult({
          success: false,
          message: "Incorrect flag. Try again!",
        });
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 429) {
          setSubmitResult({
            success: false,
            message:
              "Too many submission attempts. Please wait before trying again.",
          });
        } else {
          setSubmitResult({
            success: false,
            message: "Failed to submit flag. Please try again.",
          });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Alert variant="danger">{error || "Challenge not found."}</Alert>
        <Button
          variant="ghost"
          onClick={() => navigate("/challenges")}
          className="mt-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Challenges
        </Button>
      </div>
    );
  }

  const CategoryIcon = categoryIcons[challenge.category] || Shield;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <Link
        to="/challenges"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Challenges
      </Link>

      {/* Challenge Header */}
      <Card className="p-6 md:p-8 mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary-600/20">
              <CategoryIcon className="h-8 w-8 text-primary-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <Badge variant="info">{challenge.category}</Badge>
                <Badge variant={difficultyColors[challenge.difficulty]}>
                  {challenge.difficulty}
                </Badge>
                {alreadySolved && <Badge variant="success">SOLVED</Badge>}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {challenge.title}
              </h1>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-4xl font-bold text-primary-400">
              {challenge.points}
            </span>
            <span className="text-lg text-gray-500 block">points</span>
          </div>
        </div>

        {/* Description */}
        <div className="prose prose-invert max-w-none">
          <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
          <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
            {challenge.description}
          </p>
        </div>

        {/* Attachment */}
        {challenge.attachmentUrl && (
          <div className="mt-6 pt-6 border-t border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-3">
              Attachment
            </h3>
            <a
              href={challenge.attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <Download className="h-4 w-4" />
              Download Attachment
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        )}
      </Card>

      {/* Flag Submission */}
      <FlagSubmissionForm
        onSubmit={handleFlagSubmit}
        isLoading={isSubmitting}
        result={submitResult}
        isAuthenticated={isAuthenticated}
        alreadySolved={alreadySolved}
      />
    </div>
  );
}
