import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Save, Target } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Alert from "../../components/ui/Alert";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { challengeService } from "../../services/challenge.service";
import { useTheme } from "../../context/index";
import type { ChallengeCategory, ChallengeDifficulty } from "../../types";
import type { CreateChallengePayload } from "../../services/challenge.service";

interface ChallengeFormData {
  title: string;
  description: string;
  category: ChallengeCategory | "";
  difficulty: ChallengeDifficulty | "";
  points: number;
  flag: string;
  resourceLink: string;
}

const DIFFICULTY_OPTIONS = [
  { value: "", label: "Select Difficulty" },
  { value: "EASY", label: "Easy" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HARD", label: "Hard" },
];

const CATEGORY_OPTIONS = [
  { value: "", label: "Select Category" },
  { value: "WEB", label: "Web" },
  { value: "CRYPTO", label: "Crypto" },
  { value: "FORENSICS", label: "Forensics" },
  { value: "REVERSE", label: "Reverse Engineering" },
  { value: "PWN", label: "Pwn" },
  { value: "MISC", label: "Misc" },
];

const initialFormData: ChallengeFormData = {
  title: "",
  description: "",
  category: "",
  difficulty: "",
  points: 100,
  flag: "",
  resourceLink: "",
};

export default function AdminChallengeForm() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<ChallengeFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && id) {
      fetchChallenge(id);
    }
  }, [id, isEdit]);

  const fetchChallenge = async (challengeId: string) => {
    try {
      const response = await challengeService.getChallengeById(challengeId);
      const challenge = response.data;
      setFormData({
        title: challenge.title,
        description: challenge.description,
        category: challenge.category,
        difficulty: challenge.difficulty,
        points: challenge.points,
        flag: "", // Flag is not returned from API for security
        resourceLink: challenge.resourceLink || "",
      });
    } catch (err) {
      setError("Failed to load challenge");
      console.error("Error fetching challenge:", err);
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "points" ? parseInt(value) || 0 : value,
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.title.trim()) return "Title is required";
    if (!formData.description.trim()) return "Description is required";
    if (!formData.category) return "Category is required";
    if (!formData.difficulty) return "Difficulty is required";
    if (formData.points < 1) return "Points must be at least 1";
    if (!isEdit && !formData.flag.trim())
      return "Flag is required for new challenges";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category as ChallengeCategory,
        difficulty: formData.difficulty as ChallengeDifficulty,
        points: formData.points,
        flag: formData.flag.trim(),
        resourceLink: formData.resourceLink.trim() || undefined,
      };

      if (isEdit && id) {
        await challengeService.updateChallenge(id, payload);
        setSuccess("Challenge updated successfully!");
      } else {
        if (!payload.flag) {
          setError("Flag is required");
          return;
        }
        await challengeService.createChallenge(
          payload as CreateChallengePayload
        );
        setSuccess("Challenge created successfully!");
        setFormData(initialFormData);
      }

      // Redirect after short delay
      setTimeout(() => {
        navigate("/admin/challenges");
      }, 1500);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const message =
        error?.response?.data?.message ||
        `Failed to ${isEdit ? "update" : "create"} challenge`;
      setError(message);
      console.error("Error saving challenge:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/admin/challenges")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1
            className={`text-2xl font-bold flex items-center gap-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            <Target className="h-6 w-6 text-primary-500" />
            {isEdit ? "Edit Challenge" : "Create Challenge"}
          </h1>
        </div>
      </div>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Challenge Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <Input
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter challenge title"
              required
            />

            {/* Description */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter challenge description (supports markdown)"
                rows={5}
                required
                className={`w-full px-4 py-3 rounded-lg border transition-colors resize-y ${
                  isDark
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-primary-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-primary-500"
                } focus:outline-none focus:ring-2 focus:ring-primary-500/20`}
              />
            </div>

            {/* Category & Difficulty */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Category"
                name="category"
                options={CATEGORY_OPTIONS}
                value={formData.category}
                onChange={handleChange}
              />
              <Select
                label="Difficulty"
                name="difficulty"
                options={DIFFICULTY_OPTIONS}
                value={formData.difficulty}
                onChange={handleChange}
              />
            </div>

            {/* Points & Flag */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Points"
                name="points"
                type="number"
                value={formData.points.toString()}
                onChange={handleChange}
                min={1}
                required
              />
              <Input
                label={isEdit ? "Flag (leave empty to keep current)" : "Flag"}
                name="flag"
                value={formData.flag}
                onChange={handleChange}
                placeholder="CTF{example_flag}"
                required={!isEdit}
              />
            </div>

            {/* Resource Link */}
            <Input
              label="Resource Link (optional)"
              name="resourceLink"
              value={formData.resourceLink}
              onChange={handleChange}
              placeholder="https://example.com/challenge-files"
            />

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate("/admin/challenges")}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isEdit ? "Update Challenge" : "Create Challenge"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
